// 傳進來兩個物件 app (Express) , io (socket.io)
var appRouter = function(app, io, appContext){
    app.get("/api/", function(req, res){
        res.status(200).send({message: 'Welcome to our restful API'});
    });

    // 回覆廣播"現在socket.io連線數"訊息
    app.get("/api/online_counter", function(req, res){
        var data = {counter: appContext.onlineCounter};
        res.status(200).send(data);
    });

    // 回覆"Server時間"訊息
    app.get("/api/server_clock", function(req, res){
        var data = {serverClock: new Date().getTime()}
        res.status(200).send(data);
    })
}

module.exports = appRouter;