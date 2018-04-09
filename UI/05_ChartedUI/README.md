# 05 ChartedUI
有一個快速處理資料計算後台與即時將有效資訊送達前後的資料頻道對於讓資料展現價值很重要，但是如果發揮資料的方式是要透過人來解讀與應用的話。資料/資訊的展示力就至關重要。

資料的可視化或視覺化一向是展示一家公司對於資訊應用的最佳進入點，因此選擇一個能夠充份表現資料的圖表元件並整合到資料處理的流程中就是05_ChartedUI。

## 元件選用
- ace (code editor) 
Ace是一個用JavaScript編寫的可嵌入代碼編輯器。它與Sublime，Vim和TextMate等原生編輯器的功能和性能相匹配。它可以很容易地嵌入到任何網頁和JavaScript應用程序中。在本專案我們透過"ace"來編輯Echarts所需要的資料結構與圖型設定。
官網: https://ace.c9.io/

- echart (visualization chart)
ECharts是一款由百度前端技術部開發的，基於Javascript的數據可視化圖表庫，提供直觀，生動，可交互，可個性化定制的數據可視化圖表。它不但使用起來很簡單，同時也支援非常多的charting的格式。Echarts現在己經是Apache incubator的專案。
官網: http://echarts.baidu.com/


## 安裝

下載本專案後, 使用`npm install`來下載相關的Node.js的packages

## 設定
修改 `config/default.json`的設定檔:
- app.id (int) 代表一個application的instance編號, 例如: 0, 1, 2...
- app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000, 3001, 3002...
- app.socket_io.scaled_with_redis (bool) 是否要使用Redis來scale out
- redis.host (string) Redis服務的host
- redis.port (int) Reids服務的port

## 啟動
啟動app.js的一個instance:
`node app.js`

## 驗證

- 多個瀏覽器連接
  - http://localhost:3000

- 透過下拉選單選擇想要看的視覺化圖表

- 點選"Send to Server"

- 檢查每一個瀏覽器是不是同時會展現出相同的視覺化圖表

## 圖表範例
在這個專案裡, 收集了百度Echart官網將近150個圖表範例。透過這個專案你將學到如何動態地對使用者推送最更新的視覺化圖表。
