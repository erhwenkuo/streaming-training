# 06 KafkaLinkeddUI
Apache Kafka 是開放原始碼的分散式訊息發佈與訂閱(Pub/Sub)系統， 它是現在許多串流資料的即時應用程式的核心骨幹。您可以將網站點擊流、金融交易和應用程式日誌之類的串流資料傳送到 Kafka 叢集，它會緩衝資料並將資料提供給建置在 Apache Spark Streaming、Apache Storm、Apache Samza 或 Kafka Streaming/KSQL等框架上的串流處理應用程式。

這個專案的建置主要是想透過Socket.io來串連Kafka來展示一個非同步的RPC呼叫以及即時的RPC結果回傳至前端UI的基本概念與架構。

![architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/06_KafkaLinkedUI/architecture.png)

## 元件選用
由於在之後的相關的演示與範例都會跟Kafka及其相關的應用有著非常緊密的關係, 因此我們選擇使用Confluent版本的Kafka:

- Confluent Opensource v4.1
Confluent.io是由LinkedIn開發出Apache Kafka實時信息列隊技術的團隊成員Jay Kreps帶頭創立了新創公司。
官網: http://confluent.io

## 安裝Confluent Kafka
- 至Confluent.io下載最新版本的Kafaka (v4.1)
  - confluent-oss-4.1.0-2.11.tar.gz

- 解壓縮

```
tar -xzvf confluent-oss-4.1.0-2.11.tar.gz
```

- 啟動Kafak
  - 以下用<CONFLUENT_HOME>代表Confluent解壓縮的根目錄
```
$<CONFLUENT_HOME>/bin/confluent start kafka
```


以上的指令會啟動兩個服務: zookeeper & kafka
```
Using CONFLUENT_CURRENT: /tmp/confluent.YQrxQOOe
Starting zookeeper
zookeeper is [UP]
Starting kafka
kafka is [UP]
```

- 建立兩個在範例裡會用到的topic
  - socket-request
  - socket-response

```
$ <CONFLUENT_HOME>/bin/kafka-topics --create --zookeeper localhost:2181 \
  --replication-factor 1 --partitions 1 --topic socket-request

$ <CONFLUENT_HOME>/bin/kafka-topics --create --zookeeper localhost:2181 \
  --replication-factor 1 --partitions 1 --topic socket-response
```
- 檢查topic創建成功
```
$ <CONFLUENT_HOME>/bin/kafka-topics --list --zookeeper localhost:2181
```

如果成功的話, 應該會看到:
```
socket-request
socket-response
```

## 主要程式
  - web/app.js
  - web/public/index.html
  - rpc_handler/app.js

## 安裝WebUI
  - 下載本專案之後, 切換到`06_KafkaLinkedUI/web`的目錄
  - 執行`npm install`來下載相關的Node.js的packages
```
cd 06_KafkaLinkedUI/web

npm install
```
  - 修改 `web/config/default.json`的設定檔:
    - app.id (int) 代表一個application的instance編號, 例如: 0, 1, 2...
    - app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000, 3001, 3002...

  - 啟動WebUI
    - 啟動app.js的一個instance

```
cd 06_KafkaLinkedUI/web

node app.js
```
## 安裝Rpc_Handler
 - 下載本專案之後, 切換到`06_KafkaLinkedUI/rpc_handler`的目錄
  - 執行`npm install`來下載相關的Node.js的packages
```
cd 06_KafkaLinkedUI/rpc_handler

npm install
```

## 驗證

- 多個瀏覽器連接
  - http://localhost:3000

- 透過下拉選單選擇想要送出的RPC
  - ADD (要1秒才會完成)
  - SUBSTRACT (要3秒才會完成)
  - MULTIPLY (要6秒才會完成)
  - DIVIDE (要12秒才會完成)
- 填入NUM1與NUM2的數值

- 點選"Send to Server"

- 由於每一個RPC的方法回傳的時間不一樣, 測試時可以同時送出不同種類的RPC的呼叫, 然後觀察從UI收到RPC response的順序

![ui_demo](https://github.com/erhwenkuo/streaming-training/blob/master/UI/06_KafkaLinkedUI/ui_demo.png)

