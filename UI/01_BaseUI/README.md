# 01 BaseUI
為了能夠展現及時的串流資料處理End-to-End的概念與實作，一個能夠及時的接收後端及時訊息推播的前端UI將是一個重要的環節。 這個專案被設計的目的是為了構建一個方便展現即時訊息的前台，但是又不會太過于複雜。 之後的一些相關的訓練課程如果有需要UI來進行展示時，會以這個BaseUI為基礎架構下進行修改與功能的改善。

## 重要概念
隨著手機的普及與4G/5G網路速度的提升，使用者對於資訊系統在處理速度的要求愈來愈高。過往的資料處理手法的批次處理(Batch process)、拉式(Pulling)的訊息溝通(Request/Respons)雖然仍然是重要的技術，在某些即時(Realtime)的數據處理/展現的需求就顯得有點難以招架。

BaseUI主要想用Socket.io的web-socket的溝通手法來讓後台可以在事件發生的當下，即時以推送(Push)的手法通知前台UI來展現。這個案例想要帶領大家用簡單的手法來體會推(Push)與拉(Pull)兩種手法的融合不僅可以提升使用者的體驗，同時也讓工程師有360度的溝通手法來串連前台與後台。

![page_screen](https://github.com/erhwenkuo/streaming-training/blob/master/UI/01_BaseUI/architecture.png)

## 後端Stacks
- node.js
- socket.io

## 前端Stacks
- Jquery
- AngularJs
- Bootstrap

## 安裝
下載本專案後, 使用`npm install`來下載相關的Node.js的packages

## 設定
修改 `config/default.json` :
- app.id (int) 代表一個application的instance編號, 例如: 0,1,2...
- app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000

```
{
    "app":{
        "id": 0,
        "http":{
            "port": 3000
        }
    }
}
```

## 啟動服務
`node app.js`

並使用瀏覽器連結至 http://localhost:3000，可以同時使用多個網頁來觀察"Online"的counter的即時變動。

![page_screen](https://github.com/erhwenkuo/streaming-training/blob/master/UI/01_BaseUI/ui_screenshot.png)


