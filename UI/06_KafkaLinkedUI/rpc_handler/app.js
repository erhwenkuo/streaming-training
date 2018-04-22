var logger = require('./logger'); // 引入logging的設定

// 解決在不同的目錄下啟動app.js時找不到設定的目錄
var config_dir = __dirname + '/config/'
process.env.NODE_CONFIG_DIR = config_dir;

// 載入configuration檔案
var config = require('config'); // 使用"config"模組來控制組態與設定
logger.info("App ["+config.get('app.name')+"]");

// 產生一個上下文(context)物件
var appContext = {};

// 示範一個簡單的RpcNames
appContext.rpcNames = new Set(["ADD","SUBTRACT", "MULTIPLY", "DIVIDE"])

//console.log("kafka.host:" , config.get('kafka.host'));

// 引入Kafka的模組
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    KeyedMessage = kafka.KeyedMessage,
    kafkaClient = new kafka.KafkaClient({kafkaHost: config.get('kafka.host')}),
    producer = new Producer(kafkaClient),
    consumer = new Consumer(kafkaClient,[{topic: config.get('kafka.request_topic')}],{autoCommit: true});


producer.on('ready', function () {
    // 把producer的參考保存在來
    appContext.kafkaProducer = producer;
});

producer.on('error', function (err) {});

consumer.on('message', function(message){
    // 收到從socket傳過來的RPC reqeust物件
    // logger.info(message);

    /*
        {
            id: yyyyyy, # id由socket client產生, 主要是讓socket client收到response後去配對
            rpcName: "ADD",
            rpcParams: {num1: 1, num2: 20},
            appId: 1, # 是由那一個App instance所發出來的
            socketId: xxxxxxx, # socketId根據socket.io所產生, 主要是用來知道要將response送給那個socket連線
        }
    */ 
    
    // message的key就是App instance id
    var appId = message.key;
    
    // 將message的value轉成物件
    var request = JSON.parse(message.value);

    // 取出RpcName與RpcParams
    var rpcName = request.rpcName;
    var rpcParams = request.rpcParams;
    
    // 最後要回覆的RpcResult
    var rpcResponse = {
        id: request.id,
        appId: request.appId,
        socketId: request.socketId,
        rpcName: request.rpcName,
        rpcParams: request.rpcParams,
    };

    // 檢查RpcName是否在定義中
    if(appContext.rpcNames.has(rpcName.toUpperCase())){
        rpcResponse.status = 200
        if(rpcName.toUpperCase()=="ADD"){
            var result = parseFloat(rpcParams.num1) + parseFloat(rpcParams.num2);
            rpcResponse.rpcResult = {result:result};
        } else if(rpcName.toUpperCase()=="SUBTRACT"){
            var result = parseFloat(rpcParams.num1) - parseFloat(rpcParams.num2);
            rpcResponse.rpcResult = {result:result};
        } else if(rpcName.toUpperCase()=="MULTIPLY"){
            var result = parseFloat(rpcParams.num1) * parseFloat(rpcParams.num2);
            rpcResponse.rpcResult = {result:result};
        } else if(rpcName.toUpperCase()=="DIVIDE"){
            var result = parseFloat(rpcParams.num1) / parseFloat(rpcParams.num2);
            rpcResponse.rpcResult = {result:result};
        }
    } else {
        rpcResponse.status = 400 // Bad request
        rpcResponse.rpcResult = {error:'RpcName not found!'};
    }

    // 把訊息送進Kafka
    var km = new KeyedMessage(appId, JSON.stringify(rpcResponse));
    payloads = [
        { topic: config.get('kafka.response_topic'), messages: [km] }
    ];    
    sendToKafka(rpcName, payloads);    
});

function sendToKafka(rpcName, payloads){
    // 送進Kafka中
    var delay = 0;
    if(rpcName=="ADD")
        delay = 1000;
    else if(rpcName=="SUBTRACT")
        delay = 3000;
    else if(rpcName=="MULTIPLY")
        delay = 6000;
    else if(rpcName=="DIVIDE")
        delay = 12000;
    
    setTimeout(()=>{
        logger.info(payloads);
        producer.send(payloads, function (err, data) {
            //logger.info(data);
        });
    }, delay);
}

