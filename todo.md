# 專案待辦清單 (Project TODOs) - 早安長輩圖社群平台

本專案採用前後端分離架構，後端使用 Node.js (Express) 與 Docker 容器化部署，資料庫使用 MongoDB。

## 1. 專案初始化與基礎建設 (Infrastructure)

- [ ] **目錄結構建立**
    - [ ] 建立根目錄 `elder-greeting-app`
    - [ ] 建立 `frontend/` (前端原始碼)
    - [ ] 建立 `backend/` (後端 API 與邏輯)
    - [ ] 建立 `docs/` (文件)

- [ ] **Docker 環境建置 (Root)**
    - [ ] 建立 `docker-compose.yml`
        - [ ] 定義 `mongo` 服務 (資料庫，設定 Volume 持久化)
        - [ ] 定義 `backend` 服務 (連結 `mongo` 網路)
    - [ ] 建立 `.env` 範例檔 (`.env.example`)
        - [ ] 定義 `MONGO_URI`, `PORT`, `JWT_SECRET`

---

## 2. 後端開發 (Backend) - `backend/`

### 環境與套件
- [ ] 初始化專案 (`npm init -y`)
- [ ] 安裝核心套件: `express`, `mongoose`, `dotenv`, `cors`
- [ ] 安裝認證套件: `bcryptjs` (密碼加密), `jsonwebtoken` (JWT)
- [ ] 安裝開發套件: `nodemon`
- [ ] 撰寫 `Dockerfile` (Node.js 環境設定)

### 資料模型 (Models) - `backend/models/`
- [ ] **User Model (`User.js`)**
    - [ ] `username` (字串, 必填)
    - [ ] `email` (字串, 唯一, 必填)
    - [ ] `password` (字串, 加密後 hash)
    - [ ] `avatar` (字串, 頭像 URL)
    - [ ] `collections` (陣列, 儲存收藏的 Greeting ID)
    - [ ] `likedGreetings` (陣列, 儲存已按讚的 Greeting ID)
- [ ] **Greeting Model (`Greeting.js`)**
    - [ ] `title` (字串)
    - [ ] `imageUrl` (字串, 外部連結)
    - [ ] `category` (字串, enum: ['早安', '晚安', '節慶', '勸世'])
    - [ ] `description` (字串)
    - [ ] `creator` (ObjectId, 關聯 User)
    - [ ] `likesCount` (數字, 預設 0)
    - [ ] `createdAt` (時間)

### API 路由與控制器 (Routes & Controllers)
- [ ] **認證系統 (`/api/auth`)**
    - [ ] `POST /register`: 使用者註冊 (包含密碼 Hash)
    - [ ] `POST /login`: 使用者登入 (回傳 JWT Token 與使用者資訊)
    - [ ] Middleware: `verifyToken` (驗證 Header 中的 JWT)

- [ ] **長輩圖 CRUD (`/api/greetings`)**
    - [ ] `GET /`: 取得圖片列表 (支援 query 篩選：全部/特定分類)
    - [ ] `POST /`: 新增圖片 (需驗證 Token, 寫入 `creator`)
    - [ ] `PUT /:id`: 修改圖片 (需驗證 Token & 確認是否為 `creator`)
    - [ ] `DELETE /:id`: 刪除圖片 (需驗證 Token & 確認是否為 `creator`)

- [ ] **互動功能 (`/api/interactions`)**
    - [ ] `POST /:id/like`: 切換按讚 (Toggle Like)
        - [ ] 更新 `Greeting.likesCount`
        - [ ] 更新 `User.likedGreetings`
    - [ ] `POST /:id/collect`: 切換收藏 (Toggle Collection)
        - [ ] 更新 `User.collections`

- [ ] **使用者資料 (`/api/users`)**
    - [ ] `GET /me/creations`: 取得「我的圖片」列表 (搜尋 `creator` 為自己的圖片)
    - [ ] `GET /me/collections`: 取得「我的收藏」列表 (Populate `collections`)
    - [ ] `GET /me/likes`: 取得「按讚紀錄」列表 (Populate `likedGreetings`)

---

## 3. 前端開發 (Frontend) - `frontend/`

### 環境與架構
- [ ] 初始化 Vite 專案 (`npm create vite@latest`)
- [ ] 安裝依賴: `axios` (API請求), `bootstrap` (UI樣式), `pinia` (狀態管理, 若使用 Vue)
- [ ] 設定 `axios` 攔截器 (Interceptor)
    - [ ] 自動將 `localStorage` 中的 Token 帶入 Request Header

### 元件開發 (`src/components/`)
- [ ] **Navbar Component**
    - [ ] 判斷登入狀態切換顯示內容
    - [ ] 顯示使用者頭像 (Avatar)
    - [ ] 實作下拉選單 (我的圖片、收藏、按讚、登出)
- [ ] **Auth Modal Component**
    - [ ] 登入表單 UI 與串接
    - [ ] 註冊表單 UI 與串接
- [ ] **Greeting Card Component**
    - [ ] 圖片顯示與排版
    - [ ] **按讚按鈕**: 根據 `isLiked` 狀態變更顏色/呼叫 API
    - [ ] **收藏按鈕**: 根據 `isCollected` 狀態變更顏色/呼叫 API
    - [ ] **下載按鈕**: 實作 Blob 下載邏輯
    - [ ] **編輯/刪除選單**: 僅在 `currentUserId === creatorId` 時顯示

### 頁面邏輯 (`src/views/` 或 `App.vue`)
- [ ] **首頁 (Home)**
    - [ ] 呼叫 `GET /api/greetings`
    - [ ] 實作分類篩選 Tabs
- [ ] **個人過濾頁面**
    - [ ] **我的圖片**: 呼叫 `GET /api/users/me/creations`
    - [ ] **我的收藏**: 呼叫 `GET /api/users/me/collections`
    - [ ] **按讚紀錄**: 呼叫 `GET /api/users/me/likes`
- [ ] **新增/編輯視窗**
    - [ ] 呼叫 `POST` 或 `PUT` API
    - [ ] 成功後刷新列表

---

## 4. 文件 (Documentation) - `docs/`

- [ ] **API 規格書 (`api-spec.md`)**
    - [ ] 定義所有 API Endpoints
    - [ ] 定義 Request Body 格式
    - [ ] 定義 Response Success/Error 範例
- [ ] **部署手冊**
    - [ ] 說明如何設定 `.env`
    - [ ] 說明如何執行 `docker-compose up --build`