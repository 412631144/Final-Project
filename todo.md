# 專案開發待辦清單 (Project To-Do List)

這份清單基於前後端分離 (MERN/Node.js) 架構，並包含 Docker 容器化部署流程。

## 1. 📂 檔案結構整理與修正 (Refactor Structure)
- [ ] **移動檔案**：將 `docker/docker-compose.yml` 移至 **專案根目錄**（方便統一管理）。
- [ ] **補齊目錄**：在 `server/` 內建立 `config/` (存放 DB 設定) 與 `middleware/` (存放驗證/錯誤處理)。
- [ ] **補齊目錄**：在 `client/` 內建立 `assets/` (存放圖片/資源)。

## 2. 🖥️ 後端開發 (Server - Node.js/Express)
### 初始化與設定
- [ ] 執行 `npm init -y` 初始化 `package.json`。
- [ ] 安裝核心套件：`npm install express mongoose dotenv cors`。
- [ ] 安裝開發套件：`npm install --save-dev nodemon`。
- [ ] **建立 `.env` 檔案**：設定 `PORT`, `MONGO_URI`, `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`。
- [ ] **建立 `server.js` (或 `app.js`)**：設定 Express App、Middleware、Router 與 Server Listen。

### 邏輯實作
- [ ] **Database Connection**：在 `config/db.js` 中撰寫 Mongoose 連線邏輯。
- [ ] **Models**：在 `models/` 定義資料庫 Schema (例如 User, Post 等)。
- [ ] **Controllers**：在 `controllers/` 撰寫商業邏輯 (GET, POST, PUT, DELETE 處理函式)。
- [ ] **Routes**：在 `routes/` 設定 API 路徑並對應到 Controller。

### 容器化
- [ ] **建立 `Dockerfile`**：定義 Node.js 環境、複製原始碼、安裝依賴、暴露 Port。

## 3. 🎨 前端開發 (Client)
- [ ] **HTML 骨架**：完善 `index.html`，引入 CSS 與 JS。
- [ ] **樣式設計**：在 `style.css` 中撰寫頁面樣式。
- [ ] **API 串接**：在 `script.js` 中撰寫 `fetch` 或 `axios` 請求，呼叫後端 API 並渲染畫面。
- [ ] (選用) **容器化**：若需獨立部署前端，建立 `Dockerfile` (例如使用 Nginx 託管靜態檔)。

## 4. 🐳 Docker 環境設定
- [ ] **Database Init**：確認 `docker/mongo-init.js` 內容正確 (建立初始使用者與 DB)。
- [ ] **Docker Compose**：編輯根目錄的 `docker-compose.yml`。
    - [ ] 定義 `mongo` 服務 (掛載 volume, 設定 env)。
    - [ ] 定義 `server` 服務 (build context 指向 ./server, 設定 depends_on mongo)。
    - [ ] 定義 `client` 服務 (若有容器化需求)。
- [ ] **網路設定**：確保所有服務在同一個 Docker Network 內。

## 5. ✅ 測試與除錯 (Testing)
- [ ] 執行 `docker-compose up --build` 啟動所有服務。
- [ ] 檢查 MongoDB 是否成功連線。
- [ ] 使用 Postman 或瀏覽器測試後端 API 功能。
- [ ] 確認前端頁面能否正確顯示並與後端互動。