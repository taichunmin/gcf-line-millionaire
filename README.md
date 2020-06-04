# gcf-line-millionaire

一個模擬「Who Wants to Be a Millionaire?」的 LINE 聊天機器人，用來示範如何在聊天機器人中使用 Google Analytics，並且搭配 Data Studio 來做出有意義的圖表。

## GCP 服務帳戶權限

* Cloud Build Service 帳戶
* Cloud Build 編輯者
* Cloud Functions 管理員
* 服務帳戶使用者
* Storage 物件建立者
* 檢視者

## gcf `ENV_PROD=`

```yaml
NODE_ENV: production
```

## GitHub Secrets

```
ENV_PROD=
GCP_PROJECT=
GCP_SA_KEY=
```
