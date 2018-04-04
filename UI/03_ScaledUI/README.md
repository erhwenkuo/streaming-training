# 03 ScaledUI
02_ScaledUI透過Redis的擴展讓我們擁有可以根據負載來scale-out後台的Socket.io的服務。隨之而來問題就是每一個App的instance可以支撐多少的連線與負載量呢?
對於很多進入IT產業的工程師來說，能夠把使用者提出的功能需求順利完成就己經是氣喘噓噓了，壓力測試就上線後再慢慢調教吧!今天我們在03_ScaledUI就想要對ScaledUI進行壓力測試，讓我們在簡單快速開發之時，也能夠對上線後接踵而來的Scale-out與Throughtput進行思考與調教。

在03_ScaledUI要進行壓測之前我們要對app裡會打印一些debug/info的訊息進行簡單的重構，主要就是引入logging(winston模組)來控制在後台output在console的改善。

參考: [Logging in Node.js done right](http://www.jyotman.xyz/post/logging-in-node.js-done-right)

另外在壓力測試的試驗下也發現Node.js過長的GC Pause會導致Socket.io後台與前台的連線中斷，最後產生雪崩效應以致Node.js的instance crash掉。因此透過Redis來scale-out不僅能服務更多的使用者的同時，也是讓後台更加穩定的提供服務。

## 重要概念
為了進行壓力測試，選擇一個好的測試工具很重要。由於整個服務最重要的服務有:
1. Web資源的取得
2. Web REST Api的呼叫
3. WebSocket(Socket.io)的連線與呼叫

因此我們選擇了[artillery](https://artillery.io/)這個簡單且強大的工具。

![architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/03_ScaledUI/architecture.png)

## 安裝
下載本專案後, 使用`npm install`來下載相關的Node.js的packages

同時使用`npm install -g artillery`來安裝artillery。

## 安裝redis
docker run --name redis --port 6379:6379 -d redis

## 設定
修改 `config/default-0.json`、 `config/default-1.json`、 `config/default-2.json` (三個instances的設定檔):
- app.id (int) 代表一個application的instance編號, 例如: 0, 1, 2...
- app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000, 3001, 3002...
- app.socket_io.scaled_with_redis (bool) 是否要使用Redis來scale out
- redis.host (string) Redis服務的host
- redis.port (int) Reids服務的port

## 測試單一instance的服務的socket穩定最大連線數的負載測試
啟動app.js的一個instance:
`node app.js`

啟動壓力測試:
`artillery run socketio-conn-test.yaml`

測試設定:
```
cconfig:
  target: "http://localhost:3000"
  phases:
    - duration: 1200 # 持續1200秒
      arrivalRate: 10 # 每秒產生10個socket連線
  socketio:
    transports: ["websocket"]

scenarios:
  - engine: "socketio"
    flow:
      - think: 1200 # 每個連線連接完成後不作什麼事，但是1200秒就斷開連接
```

結果:

連線數衝到了7000多個的時候, 因為Node.js的GC pause過長，導致了新連線無法建立以及現有連線被斷開的現象。經過了多次的壓力測試後大約可以知道一個Node.js的instance(未經過其它的參數調整)在5000個sockets的同時連線下是可以穩定提供服務。

## 測試單一instance的服務在不同socket連線行為的負載測試
啟動app.js的一個instance:
`node app.js`

啟動壓力測試:
`artillery run socketio-load-test.yaml`

測試設定:
```
config:
  target: "http://localhost:3000"
  phases:
    - duration: 1200  # 持續1200秒
      arrivalRate: 10 # 每秒產生10個socket連線
  variables:
    greeting: ["hello", "goedemorgen", "добрый день", "guten tag", "bonjour", "hola"] # 固定的訊息
  processor: "./functions.js" # 使用Javascript動態產生的訊息
  socketio:
    transports: ["websocket"]

scenarios:
  - name: "A user that just lurks" # 第一類的使用者，主要連上Server但沒有發什麼訊息
    weight: 75 # 佔所有產生的使用者的75%
    engine: "socketio"
    flow:
      - think: 600 # 每秒執行1次持續600秒

  - name: "A mostly quiet user" # 第二類的使用者，偶而發些訊息
    weight: 15 # 佔所有產生的使用者15%
    engine: "socketio"
    flow:
      - emit:
          channel: "c_msg"
          data: "{{ greeting }}"
      - think: 600 # 每秒執行1次持續600秒

  - name: "A chatty user" # 第三類的使用者，很頻繁發訊息
    weight: 10 # 佔所有產生的使用者10%
    engine: "socketio"
    flow:
      - emit:
          channel: "new message"
          data: "{{ greeting }}"
      - loop:
          - function: "setMessage"
          - emit:
              channel: "c_msg"
              data: "{{ message }}"
          - think: 10 # 每秒執行1次持續10秒
        count: 10 # 迭代10次
      - think: 600 # 每秒執行1次持續600秒
```

## 啟動多個instances的服務 (要先啟動Reids)最大連線數的負載測試
使用3個terminal分別啟動3個app.js的instances:
- 使用`default-0.json`的設定
  - `NODE_APP_INSTANCE=0 node app.js`
- 使用`default-1.json`的設定
  - `NODE_APP_INSTANCE=1 node app.js`
- 使用`default-2.json`的設定
  - `NODE_APP_INSTANCE=2 node app.js`

使用3個terminal分別啟動連線壓力測試:
`artillery run socketio-conn-test-00.yaml`
`artillery run socketio-conn-test-01.yaml`
`artillery run socketio-conn-test-02.yaml`

## 測試多個instances的服務在不同socket連線行為的負載測試
使用3個terminal分別啟動3個app.js的instances:
- 使用`default-0.json`的設定
  - `NODE_APP_INSTANCE=0 node app.js`
- 使用`default-1.json`的設定
  - `NODE_APP_INSTANCE=1 node app.js`
- 使用`default-2.json`的設定
  - `NODE_APP_INSTANCE=2 node app.js`

使用3個terminal分別啟動連線壓力測試:
`artillery run socketio-load-test-00.yaml`
`artillery run socketio-load-test-01.yaml`
`artillery run socketio-load-test-02.yaml`