# streaming-training
串流計算概念與實作的training

## UI

### 01_BaseUI 建立前端UI與Http後台的雙向訊息傳輸

BaseUI主要想用Socket.io的web-socket的溝通手法來讓後台可以在事件發生的當下，即時以推送(Push)的手法通知前台UI來展現。這個案例想要帶領大家用簡單的手法來體會推(Push)與拉(Pull)兩種手法的融合不僅可以提升使用者的體驗，同時也讓工程師有360度的溝通手法來串連前台與後台。

![01_architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/01_BaseUI/architecture.png)


### 02_ScaledUI 建立可Scale-out的後台服務

ScaledUI設計的目的就是展示如何擴展Socket.io的後台服務的專案。為了能夠讓多個Socket.io的nodes可以能夠透明暢通, 我們引進了Redis並透過Redis的PUB/SUB作為所有Socket.io的nodes的訊息管道。

![02_architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/02_ScaledUI/architecture.png)

### 03_ScaledUI 對後台的服務進行連線與負載的壓力測試

scaledUI透過Redis的擴展讓我們擁有可以根據負載來scale-out後台的Socket.io的服務。隨之而來問題就是每一個App的instance可以支撐多少的連線與負載量呢?
對於很多進入IT產業的工程師來說，能夠把使用者提出的功能需求順利完成就己經是氣喘噓噓了，壓力測試就上線後再慢慢調教吧!
03_ScaledUI就想要對ScaledUI的後台服務進行連線與負載的壓力測試，讓我們在簡單快速開發之時，也能夠對上線後接踵而來的Scale-out與Throughtput進行思考與調教。

![03_architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/03_ScaledUI/architecture.png)

### 04_ScaledUI 透過Reverse-Proxy來對後台的服務進行負載分散

了解每種服務的上限(天花板)對於提供穩定服務品質給使用者是重要的，及早了解自己服務的物理限制才能夠對症下藥進行改善。
我們透過了Redis的幫助，讓我們有機會平行擴展web服務的instances來服務更多使用者連線。然而每一個新加入的web服務都可能是不同ip或port，對於使用者而言要求連線到不同的ip與port來存取服務是很不方便也不親民。本專案將在`03_ScaledUI`為基礎下進行專業結構的調整以及使用Nginx來配置reverse-proxy來解決問題。

![04_architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/04_ScaledUI/architecture.png)


### 05_ChartedUI 即時的視覺化圖表的產出與推送

有一個快速處理資料計算後台與即時將有效資訊送達前後的資料頻道對於讓資料展現價值很重要，但是如果發揮資料的方式是要透過人來解讀與應用的話。資料/資訊的展示力就至關重要。
資料的可視化或視覺化一向是展示一家公司對於資訊應用的最佳進入點，因此選擇一個能夠充份表現資料的圖表元件並整合到資料處理的流程中就是`05_ChartedUI`。

![05_architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/05_ChartedUI/architecture.png)
