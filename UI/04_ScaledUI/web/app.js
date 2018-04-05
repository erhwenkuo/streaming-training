var express = require('express');
var logger = require('./logger'); // 引入logging的設定
var bodyParser = require('body-parser'); 
var routes = require('./routes/routes.js'); // 定義讓client來呼叫的REST API
var gc = (require('gc-stats'))(); // 監聽GC pause

var app = express();

//require("http").globalAgent.maxSockets = Infinity;

var http = require('http').Server(app);
var io = require('socket.io')(http);

// 解決在不同的目錄下啟動app.js時找不到設定的目錄
var config_dir = __dirname + '/config/'
process.env.NODE_CONFIG_DIR = config_dir;

// 載入configuration檔案
var config = require('config'); // 使用"config"模組來控制組態與設定

logger.info("App ID:"+config.get('app.id'));

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

    // 廣播由某一個client所送出來的訊息給所有連線的clients
    socket.on('c_msg', function(msg){
        logger.debug('message: ' + msg);
        // 廣播訊息給所有連接的socket clients
        io.emit('s_msg', msg);
    });

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

// 關注Node.js的GC 狀態
gc.on('stats', function (stats) {
    // 我們只關心GC pause太久的事件 (GC Pause大約5ms)
    if(stats.pauseMS > 10){
        logger.warn('GC Pause: '+ stats.pauseMS + 'ms @' + new Date().toLocaleTimeString());
    }else{
        logger.debug('GC Pause: '+ stats.pauseMS + 'ms @' + new Date().toLocaleTimeString());
    }
    // 廣播這個node的"GC stats"訊息
    io.local.emit('s_gc_stats', stats);
});

// 在特定的port number啟動服務
http.listen(config.get('app.http.port'), function(){
    logger.debug('listening on *:' + config.get('app.http.port'));
});