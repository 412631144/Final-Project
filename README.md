# 長輩圖分享平台 (Elderly Greetings Platform)

這是一個專為分享與製作「長輩圖」（早安、晚安、節慶問候等）所設計的 Web 平台。使用者可以瀏覽、按讚、收藏各式問候圖片，並可以自行上傳創作。

## 1. 專案主題與目標

**主題**：長輩圖分享與互動社群。

**目標**：
*   **建立社群**：提供一個集中的平台，讓使用者方便尋找並分享日常問候圖。
*   **互動性**：透過按讚 (Like) 與收藏 (Collect) 功能，增加使用者參與度。
*   **內容管理**：提供創作者上傳與管理功能，並具備管理員權限以維護平台內容品質。
*   **學習實踐**：實作前後端分離架構、RESTful API 設計、資料庫整合與容器化部署。

## 2. 技術選擇與原因

本專案採用 **MERN** 相關技術堆疊（Mongo, Express, Node.js），前端採用原生 JavaScript 搭配 Bootstrap。

*   **前端 (Frontend)**：
    *   **HTML5 / CSS3 / JavaScript (ES6+)**：使用原生技術構建，確保輕量化並深入理解 DOM 操作與 Fetch API 的運作。
    *   **Bootstrap 5**：快速建構響應式 (Responsive) 且美觀的 UI 介面，包含 Modal、Card 等元件。

*   **後端 (Backend)**：
    *   **Node.js & Express.js**：利用 JavaScript 單一語言優勢，快速開發高效能的 RESTful API。
    *   **JWT (JSON Web Token)**：實作無狀態 (Stateless) 的使用者驗證機制。
    *   **Bcryptjs**：進行密碼加密，確保資安。

*   **資料庫 (Database)**：
    *   **MongoDB**：NoSQL 資料庫，適合儲存非結構化或彈性欄位的資料（如貼文資訊、使用者資料），搭配 Mongoose 進行建模。
    *   **自動化資料建立 (Seeding)**：系統啟動時會自動檢查並建立管理員帳號與預設範例文章，大幅降低測試門檻。

*   **開發維運 (DevOps)**：
    *   **Docker**：容器化應用程式與資料庫，解決「在我電腦上可以跑」的環境一致性問題，並簡化部署流程。

## 3. 架構說明

專案採用 **前後端分離 (Client-Server Architecture)** 架構。

### 目錄結構
*   `client/`：前端程式碼。
    *   `src/`：包含 `index.html`, `script.js`, `style.css`。
    *   `public/`：存放靜態資源。
*   `server/`：後端 API 伺服器。
    *   `controllers/`：處理業務邏輯 (Posts, Users)。
    *   `models/`：MongoDB 資料模型 (Schema)。
    *   `routes/`：API 路由定義。
    *   `middleware/`：攔截器 (錯誤處理、Auth 驗證)。
    *   `seeder.js`：資料庫初始化腳本 (Admin & Sample Data)。
*   `docker/`：Docker 配置相關檔案。

### 系統運作流程
1.  **Server 啟動**：連接資料庫後，自動執行 `seeder.js` 檢查是否需要建立預設資料。
2.  **Client 請求**：透過 `fetch()` 發送 HTTP 請求至 **Server**。
3.  **Server 處理**：驗證請求 (JWT)，並透過 **Mongoose** 操作 **MongoDB**。
4.  **回應更新**：Server 回傳 JSON，Client 動態更新 DOM 呈現畫面。

## 4. 安裝與執行指引

### 本機開發模式 (Local Dev)

1.  **啟動資料庫**：
    *   確保本機有安裝 MongoDB 或利用 Docker 啟動一個 Mongo 容器：
        ```bash
        # 在 docker 資料夾下執行
        docker compose up -d mongo
        ```
    *   **注意**：請勿同時啟動 `docker-compose up` (全開) 與 `npm run dev`，否則 Port 5000 會衝突。建議只用 Docker 跑資料庫。

2.  **設定後端**：
    *   進入 `server` 目錄：
        ```bash
        cd server
        ```
    *   安裝套件：
        ```bash
        npm install
        ```
    *   啟動伺服器：
        ```bash
        npm run dev
        ```
        **MONGO DB連接**：MONGO_URI=mongodb://root:example@localhost:27017/mern_db?authSource=admin
    *   **自動初始化**：啟動後，Console 會顯示 `MongoDB Connected`，隨後若資料庫為空，會自動建立：
        *   **管理員帳號**：`admin@example.com` / 密碼 `admin`
        *   **範例文章**：自動載入 5 篇預設長輩圖貼文。

3.  **啟動前端**：
    *   開啟 `client/src/index.html` 即可開始使用。
    *   使用管理員帳號登入即可測試「編輯」與「刪除」他人貼文的權限。

---
