# ChatTruth — REST API Documentation

All API endpoints are versioned under `/api/v1`.

---

## 1. Authentication Endpoints

### Register User
- **POST** `/api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "usr_...", "email": "user@example.com", "role": "user" },
      "token": "jwt_token..."
    }
  }
  ```
- Sets HTTP-only session cookie.

### Login User
- **POST** `/api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```

### Logout User
- **POST** `/api/v1/auth/logout`
- Clears session cookie.

### Current User Profile
- **GET** `/api/v1/auth/me`
- **Auth**: Required (Cookie or `Authorization: Bearer <token>`)

---

## 2. Uploads & Inspection

### Preview Chat Export
- **POST** `/api/v1/uploads/preview`
- **Content-Type**: `multipart/form-data` with `file` OR `application/json` with `{ "rawText": "..." }`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "totalMessages": 450,
      "systemMessageCount": 2,
      "participants": ["Alice", "Bob"],
      "startDate": "2024-01-01T08:00:00.000Z",
      "endDate": "2024-02-01T22:00:00.000Z",
      "formatDetected": "whatsapp_android",
      "previewExcerpts": [
        { "sender": "Alice", "content": "Hello!", "timestamp": "..." }
      ]
    }
  }
  ```

---

## 3. Reports & Analysis

### Create Report
- **POST** `/api/v1/reports`
- **Content-Type**: `multipart/form-data` with `file` OR `application/json` with `{ "rawText": "...", "category": "relationship" }`
- **Response**: `201 Created` (Returns Free Preview & Report ID)

### Get Report
- **GET** `/api/v1/reports/:id`
- Returns full report if paid or requester is admin; otherwise returns safe Free Preview with `requiresPayment: true`.

### Delete Report
- **DELETE** `/api/v1/reports/:id`
- **Auth**: Requires owner of the report or admin.

---

## 4. Payments

### Create Order
- **POST** `/api/v1/payments/create-order`
- **Request Body**:
  ```json
  {
    "reportId": "rep_...",
    "provider": "razorpay"
  }
  ```

### Verify Payment
- **POST** `/api/v1/payments/verify`
- **Request Body**:
  ```json
  {
    "provider": "razorpay",
    "orderId": "order_...",
    "paymentId": "pay_...",
    "signature": "hmac_sha256_signature...",
    "reportId": "rep_..."
  }
  ```
- **Response**: `200 OK` (Unlocks full report on the server)

---

## 5. System Health

- **GET** `/api/v1/health`
- **GET** `/api/v1/ready`
