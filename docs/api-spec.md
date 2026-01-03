# API Specification

本文件說明「長輩圖分享平台」的後端 API 規格。

*   **Base URL**: `http://localhost:5000/api/posts`
*   **Base URL**: `http://localhost:5000/api/users`
*   **Authentication**: 部分 API 需要在 Header 帶入 JWT Token。
    *   Header Format: `Authorization: Bearer <token>`

---

## 1. User API (使用者相關)

### 1.1 註冊使用者 (Register)
*   **Method**: `POST`
*   **URL**: `/users`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
    }
    ```
*   **Error (400 Bad Request)**: 使用者已存在或欄位缺漏。

### 1.2 使用者登入 (Login)
*   **Method**: `POST`
*   **URL**: `/users/login`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
    }
    ```
*   **Error (400 Bad Request)**: 帳號或密碼錯誤。

### 1.3 取得當前使用者資訊 (Get Me)
*   **Method**: `GET`
*   **URL**: `/users/me`
*   **Access**: Private (需要 Token)
*   **Response (200 OK)**:
    ```json
    {
      "_id": "60d0fe4f5311236168a109ca",
      "name": "User Name",
      "email": "user@example.com",
      "role": "user",
      "avatar": "..."
    }
    ```

---

## 2. Post API (貼文相關)

### 2.1 取得貼文列表 (Get Posts)
*   **Method**: `GET`
*   **URL**: `/posts`
*   **Access**: Public
*   **Query Parameters (Optional)**:
    *   `category`: 依分類篩選 (e.g. `?category=早安`)
    *   `creatorId`: 依創作者 ID 篩選 (e.g. `?creatorId=123`)
*   **Response (200 OK)**:
    ```json
    [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "美麗的早晨",
        "imageUrl": "http://...",
        "category": "早安",
        "description": "祝大家有美好的一天",
        "likes": 5,
        "creatorId": "60d0fe4f5311236168a109ca",
        "creatorName": "User Name",
        "createdAt": "2021-06-22T04:20:55.000Z",
        "likesBy": [...],
        "collectedBy": [...]
      },
      ...
    ]
    ```

### 2.2 新增貼文 (Create Post)
*   **Method**: `POST`
*   **URL**: `/posts`
*   **Access**: Private
*   **Request Body**:
    ```json
    {
      "title": "貼文標題",
      "imageUrl": "圖片連結 (URL)",
      "category": "分類 (早安/晚安/節慶/勸世/其他)",
      "description": "貼文內容描述"
    }
    ```
*   **Response (201 Created)**: 回傳新增的貼文物件。

### 2.3 更新貼文 (Update Post)
*   **Method**: `PUT`
*   **URL**: `/posts/:id`
*   **Access**: Private (僅限原創作者或 Admin)
*   **Request Body**:
    ```json
    {
      "title": "新的標題",
      "imageUrl": "新的圖片連結",
      "category": "新的分類",
      "description": "新的描述"
    }
    ```
*   **Response (200 OK)**: 回傳更新後的貼文物件。

### 2.4 刪除貼文 (Delete Post)
*   **Method**: `DELETE`
*   **URL**: `/posts/:id`
*   **Access**: Private (僅限原創作者或 Admin)
*   **Response (200 OK)**:
    ```json
    {
      "id": "deleted_post_id"
    }
    ```

### 2.5 按讚/取消按讚 (Like/Unlike Post)
*   **Method**: `PUT`
*   **URL**: `/posts/:id/like`
*   **Access**: Private
*   **Response (200 OK)**:
    ```json
    {
      "id": "post_id",
      "likes": 6,
      "isLiked": true,
      "likesBy": [...]
    }
    ```

### 2.6 收藏/取消收藏 (Collect/Uncollect Post)
*   **Method**: `PUT`
*   **URL**: `/posts/:id/collect`
*   **Access**: Private
*   **Response (200 OK)**:
    ```json
    {
      "id": "post_id",
      "isCollected": true,
      "collectedBy": [...]
    }
    ```
