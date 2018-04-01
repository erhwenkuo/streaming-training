var express = require('express');
var bodyParser = require('body-parser'); 
var routes = require('./routes/routes.js'); // 定義讓client來呼叫的REST API

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('config'); // 使用"config"模組來控制組態與設定
console.log(config.get('app.id'))

// 是否使用"redis"來擴展"socket.io"
if(config.get('app.socket_io.scaled_with_redis')){    
    var redisAdapter = require('socket.io-redis');
    var redis_host = config.get('redis.host');
    var redis_port = config.get('redis.port');
    io.adapter(redisAdapter({host: redis_host, port: redis_port}));
}

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
app.use(express.static('public'));

// ================================================================  //

// *** 使用socket.io來做server對client呼叫的管道 ***

// 建立一個map物件來保存socket連線物件(便於Server程式)查找想要送通知的socket連線
appContext.socketsMap = new Map();
appContext.onlineCounter = 0;

// 當有socket.io的client連結上來時被觸發
io.on('connection', onConnect);

function onConnect(socket){
    console.log('connection:'+socket.id);
    // 保存socket.id映對到socket實例
    appContext.socketsMap.set(socket.id, socket);
    // 增加"現在連線數"
    appContext.onlineCounter++;

    // 廣播這個node的"App的相關基本Profile"訊息給連線到這個node的clients
    io.local.emit('s_app_profile', appProfile);

    // 廣播這個node的"現在連線數"訊息
    io.local.emit('s_oneline_count', appContext.onlineCounter);
    console.log('Online Counter:'+appContext.onlineCounter);

    // 廣播由某一個client所送出來的訊息給所有連線的clients
    socket.on('c_msg', function(msg){
        console.log('message: ' + msg);
        // 廣播訊息給所有連接的socket clients
        io.emit('s_msg', msg);
    });

    // 當發生錯誤時被觸發
    socket.on('error', function(error){
        console.log("error:"+socket.id);
    });

    // 當socket client停止連結後被觸發
    socket.on('disconnect', function(reason){
        console.log("disconnect:"+socket.id);
        // 移除斷線的socket實例
        appContext.socketsMap.delete(socket.id);
        // 扣減"現在連線數"
        appContext.onlineCounter--;
        // 廣播這個node的"現在連線數"訊息
        io.local.emit('s_oneline_count', appContext.onlineCounter);
        console.log('Online Counter:'+appContext.onlineCounter);
    });
};

// 廣播這個node的"Server時間"訊息
setInterval(function(){
    var serverClock = new Date().getTime();
    io.local.emit('s_server_clock', serverClock);
}, 1000);

// 在特定的port number啟動服務
http.listen(config.get('app.http.port'), function(){
    console.log('listening on *:' + config.get('app.http.port'));
});