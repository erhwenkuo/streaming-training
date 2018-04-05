# 04 ScaledUI
`03_ScaledUI`展示了如何對web的後台進行壓力測試，也間接讓大家體驗到每一個服務都有它物理的上限。了解每種服務的上限(天花板)對於提供穩定服務品質給使用者是重要的，及早了解自己服務的物理限制才能夠對症下藥進行改善。
我們透過了Redis的幫助，讓我們有機會平行擴展web服務的instances來服務更多使用者連線。然而每一個新加入的web服務都可能是不同ip或port，對於使用者而言要求連線到不同的ip與port來存取服務是很不方便也不親民。本專案將在`03_ScaledUI`為基礎下進行專業結構的調整以及使用Nginx來配置reverse-proxy來解決問題。

## 重要概念
當對web後台進行scale-out或scale-in的時候，透過reverse-proxy來讓使用者只需要連接到同一個ip與port。

Reverse-proxy可以有很多的選擇，包括了硬體的解決方案與軟體的解決方案。事實證明軟體的解決方案己經可以應付很大的負載。一般的選擇有:
- HAproxy
- Nginx

本專案選擇了[Nginx](https://nginx.org/)這個簡單高效的軟體。

![architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/04_ScaledUI/architecture.png)

## 安裝
有些模組會需要使用`node-gyp`來編譯C/C++的模組。在現在這些編譯是透過python2.7來進行的。由於很多的OS己經升級python到3.x版本，常常導致編譯的失敗。因此要確定OS裡頭有安裝python2.7，並且設定npm使用python2.7來執行編譯。

`npm config set python python2.7`

下載本專案後, 使用`npm install`來下載相關的Node.js的packages

## 設定
修改 `config/default-0.json`、 `config/default-1.json`、 `config/default-2.json` (三個instances的設定檔):
- app.id (int) 代表一個application的instance編號, 例如: 0, 1, 2...
- app.http.port (int) 代表要使用那一個http的port來提供服務, 例如: 3000, 3001, 3002...
- app.socket_io.scaled_with_redis (bool) 是否要使用Redis來scale out
- redis.host (string) Redis服務的host
- redis.port (int) Reids服務的port

## 安裝nginx
由於我的電腦是Mac, 以下的是Mac OS的相關步驟, linux-like的系統可以參考一些網路的資源來進行nginx的安裝。

- 安裝`Homebrew` 

請參考[安裝 Homebrew](https://brew.sh/index_zh-tw)來安裝`Homebrew`。

- 安裝`nginx`
  - `brew install nginx`
- 啟動`nginx`
  - `sudo nginx`
- 測試`nginx`
  - 使用瀏覽器打開以下的網址:
    - http://localhost:8080

![architecture](https://github.com/erhwenkuo/streaming-training/blob/master/UI/04_ScaledUI/nginx_default.png)

- 停止`nginx`
  - 我們想要讓nginx聆聽port"80", 並且對我們即將啟動的3個app instances進行load-balance
  - `sudo nginx -s stop`

- 設定`nginx`的設定檔
  - 找到`nginx`的設定檔路徑
    - 在Mac上Homebrew的預設路徑為:
      - `/usr/local/etc/nginx/nginx.conf`
    - 複製`04_ScaledUI/reverse_proxy/nginx.conf`來覆蓋預設的`nginx.conf`

```
events {
  worker_connections  4096;  ## Default: 1024
}

http {    
    upstream io_nodes {
        ## ip_hash; (因為ip_hash只會針對xxx.xxx.xxx.xxx的第三個數字進行hash)
        hash $remote_addr consistent;
        server 127.0.0.1:3000;
        server 127.0.0.1:3001;
        server 127.0.0.1:3002;
    }
    server {
        listen 80;
               
        location / {
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;
            proxy_http_version 1.1;
            proxy_pass http://io_nodes;
        }
    }
}
```

- 重新啟動`nginx`
  - `sudo nginx`

- 啟動`redis`
  - `docker run --name redis --port 6379:6379 -d redis`

- 啟動3個instances的app服務(在"04_ScaledUI/web"的路徑下)
  - 使用`default-0.json`的設定
    - `NODE_APP_INSTANCE=0 node app.js`
  - 使用`default-1.json`的設定
    - `NODE_APP_INSTANCE=1 node app.js`
  - 使用`default-2.json`的設定
    - `NODE_APP_INSTANCE=2 node app.js`


## 驗證

- 使用瀏覽器連接到**App:00**:
  - http://localhost:3000

- 使用瀏覽器連接到**App:01**:
  - http://localhost:3001

- 使用瀏覽器連接到**App:02**:
  - http://localhost:3002

- 使用瀏覽器連接到本機的IP:
  - http://localhost

- 使用不同IP的電腦連接到本機的IP (舉例來說:本機的IP為192.168.0.88)
  - http://192.168.0.88

由於我們在nginx上使用了:
`hash $remote_addr consistent;`的設置(為了讓相同client的連線可以跟相同一個app instance持續連線)，因此只要是從同一個IP來的連線, nginx都會導到同一個app instance。為了驗證我們的設定是有分散負載的功能，必需要透過從不同IP的Brower連線來觀察所連接到的"App:ID"來檢查!!
