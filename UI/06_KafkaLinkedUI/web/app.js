var express = require('express');
var logger = require('./logger'); // 引入logging的設定
var bodyParser = require('body-parser'); 
var routes = require('./routes/routes.js'); // 定義讓client來呼叫的REST API

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// 解決在不同的目錄下啟動app.js時找不到設定的目錄
var config_dir = __dirname + '/config/'
process.env.NODE_CONFIG_DIR = config_dir;

// 載入configuration檔案
var config = require('config'); // 使用"config"模組來控制組態與設定
logger.info("App ["+config.get('app.name')+"] - Instance Id: " + config.get('app.id'));
    
// 是否使用"redis"來擴展"socket.io"
if(config.get('app.socket_io.scaled_with_redis')){    
    var redisAdapter = require('socket.io-redis');
    var redis_host = config.get('redis.host');
    var redis_port = config.get('redis.port');
    io.adapter(redisAdapter({host: redis_host, port: redis_port}));
}

console.log("kafka.host:" , config.get('kafka.host'));

// 引入Kafka的模組
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    KeyedMessage = kafka.KeyedMessage,
    kafkaClient = new kafka.KafkaClient({kafkaHost: config.get('kafka.host')}),
    producer = new Producer(kafkaClient),
    consumer = new Consumer(kafkaClient,[{topic: config.get('kafka.response_topic')}],{autoCommit: true});;

// 產生一個上下文(context)物件
var appContext = {};

// 產生一個App的profile物件
var appProfile = {};
appProfile.id = config.get('app.id'); // 標註這是那一個App的instance id

// *** 使用Express來提供client對server的Req/Res的管道 ***
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//在Express中定義讓client來呼叫的REST API
routes(app, io, appContext); 

// 在Express中提供靜態檔案
app.use(express.static(__dirname + '/public'));

// ================================================================  //

// *** 使用socket.io來做server對client呼叫的管道 ***

// 建立一個map物件來保存socket連線物件(便於Server程式)查找想要送通知的socket連線
appContext.socketsMap = new Map();
appContext.onlineCounter = 0;

// 一個socket的request的message
/*
{
  app_id: 1,          # 讓app去過濾屬於它自己的response訊息
  socket_id: xxxxxxx, # socket_id根據socket.io所產生, 主要是用來知道要將response送給那個socket連線
  request_id: yyyyyy, # request_id由socket client產生, 主要是讓socket client收到response後去配對
  request_payload: {} # reqeust
}
*/


producer.on('ready', function () {
    // 把producer的參考保存在來
    appContext.kafkaProducer = producer;
});

producer.on('error', function (err) {});

consumer.on('message', function(message){
    // 收到從Kafka的訊息
    var appId = parseInt(message.key);

    // 檢查是否是這個App instance的訊息
    if(appId == config.get('app.id')){
        console.log(message);
        // 取回RPC的response result
        var result = JSON.parse(message.value);
        /*
        {
            id: yyyyyy, # rid由socket client產生, 主要是讓socket client收到response後去配對
            appId: 1,
            socketId: xxxxx,
            rpcResult: {}
        }
        */

       // 檢查發RPC request的socket是否還在線上
       if(appContext.socketsMap.has(result.socketId)){
           var socket = appContext.socketsMap.get(result.socketId);
           socket.emit('s_response', result); //將訊息送給socket client
       }
        console.log(result);
    }
});


// 當有socket.io的client連結上來時被觸發
io.on('connection', onConnect);

function onConnect(socket){
    logger.debug('connection:'+socket.id);
    // 保存socket.id映對到socket實例
    appContext.socketsMap.set(socket.id, socket);

    // 增加"現在連線數"
    appContext.onlineCounter++;

    // 廣播這個node的"App的相關基本Profile"訊息給連線到這個node的clients
    socket.emit('s_app_profile', appProfile);

    // 廣播這個node的"現在連線數"訊息
    io.local.emit('s_oneline_count', appContext.onlineCounter);
    logger.info('Online Counter:'+appContext.onlineCounter);
    
    // 收到由client送進來的Request物件
    socket.on('c_request', function(request){
        /*
        {
            id: yyyyyy, # rid由socket client產生, 主要是讓socket client收到response後去配對
            rpcName: "getChartOption",
            rpcParams: {chartName: "01_barchart"}
        }
        */  
        // appId: 1,          # 讓app去過濾屬於它自己的response訊息
        // socketId: xxxxxxx, # socketId根據socket.io所產生, 主要是用來知道要將response送給那個socket連線
        
        request.appId = config.get('app.id');
        request.socketId = socket.id;

        // 把訊息送進Kafka
        var km = new KeyedMessage(config.get('app.id'), JSON.stringify(request));

        payloads = [
            { topic: config.get('kafka.request_topic'), messages: [km] }
        ];

        //console.log(request);
        // 送進Kafka中
        producer.send(payloads, function (err, data) {
            //console.log(data);
        });
    })

    // 當發生錯誤時被觸發
    socket.on('error', function(error){
        logger.debug("error:"+socket.id);
    });

    // 當socket client停止連結後被觸發
    socket.on('disconnect', function(reason){
        logger.debug("disconnect:"+socket.id);
        // 移除斷線的socket實例
        appContext.socketsMap.delete(socket.id);
        // 扣減"現在連線數"
        appContext.onlineCounter--;
        // 廣播這個node的"現在連線數"訊息
        io.local.emit('s_oneline_count', appContext.onlineCounter);
        logger.info('Online Counter:'+appContext.onlineCounter);
    });
};



// 在特定的port number啟動服務
http.listen(config.get('app.http.port'), function(){
    logger.info('Listening on *:' + config.get('app.http.port'));
});