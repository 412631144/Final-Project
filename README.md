# MERN Stack Project - Early Morning Greetings (長輩圖)

這是一個基於 MERN (MongoDB, Express, React/Vanilla JS, Node.js) 的全端網頁應用程式，旨在提供長輩圖的分享與互動平台。

## 專案結構

- `client/`: 前端 (HTML, CSS, JS)
- `server/`: 後端 (Node.js, Express)
- `docker/`: Docker 配置 (MongoDB)

## 快速開始 (Hybrid Mode)

我們採用 **Hybrid Mode** 開發：資料庫透過 Docker 執行，伺服器與前端在本地執行。

### 1. 啟動資料庫

請確保已安裝 Docker Desktop 並啟動。

```bash
docker-compose -f docker/docker-compose.yml up -d
```

這將會在 `localhost:27017` 啟動 MongoDB。
預設帳號：`root`
預設密碼：`example`

### 2. 啟動後端伺服器

```bash
cd server
npm install
npm run dev
```

伺服器將於 `http://localhost:5000` 啟動。

### 3. 開啟前端

直接在瀏覽器中打開 `client/index.html`，或者若已整合靜態檔案服務，可訪問：
`http://localhost:5000/public/index.html` (需視伺服器設定而定，目前建議直接從檔案總管打開 index.html 測試，或使用 Live Server)。

注意：目前的 `server.js` 設定並未直接將根路徑 `/` 指向 `index.html`，而是作為 API 伺服器。前端 `script.js` 會呼叫 `http://localhost:5000/api/posts`。

## 功能

-瀏覽長輩圖
- 分類篩選 (早安、晚安、節慶等)
- 按讚互動
- 新增長輩圖 (輸入圖片網址)

## 開發筆記

- API 文件：查看 `server/routes/*.js`
- 資料庫管理：可使用 MongoDB Compass 連線 `mongodb://root:example@localhost:27017/mern_db?authSource=admin`
