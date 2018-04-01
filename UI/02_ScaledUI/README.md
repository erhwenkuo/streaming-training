# 02 ScaledUI
01_BaseUI的設計給了一個能夠及時的接收後端及時訊息推播的前端UI。但是接下來的一個要思考的問題就是如何scale-out，因為不管再怎麼強大的後台WebServer都有一定在物理上的限制。也就是說, 如何擴展01_BaseUI的後台能夠讓我們發揮螞蟻雄兵的力量(也就是構建一個可以load-balance負載的後台服務)。

## 重要概念
02_ScaledUI設計的目的就是展示如何擴展Socket.io的後台服務的專案。為了能夠讓多個Socket.io的nodes可以能夠透明暢通, 我們引進了Redis並透過Redis的PUB/SUB作為所有Socket.io的nodes的訊息管道。

![page_screen](https://github.com/erhwenkuo/streaming-training/blob/master/UI/02_ScaledUI/architecture.png)

## 後端Stacks
- node.js
- socket.io

## 前端Stacks
- Jquery
- AngularJs
- Bootstrap

## 安裝
下載本專案後, 使用`npm install`來下載相關的Node.js的packages

## 安裝redis
docker run --name redis --port 6379:6379 -d redis

## 設定
修改 `config/default-0.json`、 `config/default-1.json`、 `config/default-2.json` (三個instances的設定檔):
- app.id (int) 代表一個application的instance編號, 例如: 0, 1, 2...
- app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000, 3001, 3002...
- app.socket_io.scaled_with_redis (bool) 是否要使用Redis來scale out
- redis.host (string) Redis服務的host
- redis.port (int) Reids服務的port

```
{
    "app":{
        "id": 0,
        "http":{
            "port": 3000
        },
        "socket_io":{
            "scaled_with_redis": true
        }
    },
    "redis":{
        "host": "localhost",
        "port": 6379
    }
}
```

## 啟動單一instance的服務
`node app.js`

## 啟動多個instances的服務 (要先啟動Redis)
- 使用`default-0.json`的設定
  - `NODE_APP_INSTANCE=0 node app.js`
- 使用`default-1.json`的設定
  - `NODE_APP_INSTANCE=1 node app.js`
- 使用`default-2.json`的設定
  - `NODE_APP_INSTANCE=2 node app.js`

## 驗證
使用瀏覽器連接到不同的app的host與port, 觀察UI上的"AppId"及"Online"人數。不同的AppId的Online人數是獨立被更新的。
但是發佈訊息時, 所有的瀏覽器都應該會收到相同的訊息。

![page_screen](https://github.com/erhwenkuo/streaming-training/blob/master/UI/02_ScaledUI/ui_screenshot.png)
