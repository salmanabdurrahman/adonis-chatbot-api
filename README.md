# REST API Chatbot dengan AdonisJS v5

Ini adalah project REST API sederhana yang dibangun menggunakan **AdonisJS v5** dan **PostgreSQL**. API ini berfungsi sebagai perantara antara pengguna dan API chatbot eksternal, sambil menyimpan riwayat percakapan dengan sistem otentikasi modern.

## ✨ Fitur Unggulan

- ✅ **Otentikasi JWT:** Sistem keamanan modern menggunakan JSON Web Token (JWT) untuk melindungi endpoint.
- ✅ **Validasi Input:** Menggunakan `Validator` bawaan AdonisJS untuk memastikan integritas data.
- ✅ **Struktur Database Profesional:** Menggunakan Schema PostgreSQL, UUID sebagai _primary key_, dan relasi yang tepat.
- ✅ **Fitur Lengkap (CRUD):** Menyediakan endpoint untuk membuat, membaca, dan menghapus data percakapan.
- ✅ **Pagination:** Endpoint untuk mengambil daftar percakapan sudah dilengkapi pagination untuk efisiensi.

## ⚙️ Persyaratan

- Node.js (v14 atau lebih baru)
- PostgreSQL (v12 atau lebih baru)

## 🚀 Panduan Instalasi & Setup

1.  **Clone Repositori**

    ```bash
    git clone [https://github.com/salmanabdurrahman/adonis-chatbot-api.git](https://github.com/salmanabdurrahman/adonis-chatbot-api.git)
    cd adonis-chatbot-api
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    - Salin file `.env.example` menjadi `.env`.
      ```bash
      cp .env.example .env
      ```
    - Buka file `.env` dan sesuaikan konfigurasi database PostgreSQL Anda (`PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DB_NAME`).
    - Pastikan Anda sudah membuat database dengan nama yang sesuai di PostgreSQL.
    - Atur `ADMIN_EMAIL` dan `ADMIN_PASSWORD` untuk user admin.

      ```env
      # .env
      DB_CONNECTION=pg
      PG_HOST=localhost
      PG_PORT=5432
      PG_USER=postgres (sesuaikan dengan user PostgreSQL Anda)
      PG_PASSWORD=root (sesuaikan dengan password PostgreSQL Anda)
      PG_DB_NAME=chatbot_api_db

      # API_KEY=your_secure_random_api_key

      ADMIN_EMAIL=admin@example.com
      ADMIN_PASSWORD=password123
      ```

4.  **Jalankan Migrasi Database**
    Perintah ini akan membuat semua tabel yang dibutuhkan (`users`, `api_tokens`, `conversations`, `messages`).

    ```bash
    node ace migration:run
    ```

5.  **Jalankan Database Seeder**
    Perintah ini akan membuat satu user admin untuk keperluan login dan testing.

    ```bash
    node ace db:seed
    ```

6.  **Jalankan Aplikasi**
    ```bash
    node ace serve --watch atau npm run dev
    ```
    Server akan berjalan di `http://127.0.0.1:3333`.

## API Endpoints

### 1. Autentikasi

#### Login Pengguna

Endpoint ini untuk otentikasi pengguna dan mendapatkan Bearer Token (JWT).

- **URL:** `/login`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "email": "admin@gmail.com",
    "password": "password123"
  }
  ```
- **Response Sukses (200 OK):**
  ```json
  {
    "type": "bearer",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "..."
  }
  ```

### 2. Chatbot

#### Kirim Pertanyaan

Endpoint ini untuk mengirim pertanyaan baru atau melanjutkan percakapan yang sudah ada.

- **URL:** `/questions`
- **Method:** `POST`
- **Otorisasi:** Tidak perlu (Publik)
- **Body (JSON):**
  ```json
  {
    "question": "ada layanan apa di majadigi?",
    "session_id": "opsional jika ingin melanjutkan percakapan"
  }
  ```
- **Response Sukses (200 OK):**
  ```json
  {
    "session_id": "f4e6b3a0-1b2c-4d5e-8f9a-0b1c2d3e4f5a",
    "your_question": "ada layanan apa di majadigi?",
    "bot_answer": "Halo! Saya Maja.AI, asisten informasi publik Jawa Timur..."
  }
  ```

### 3. Conversations (Membutuhkan Otorisasi)

Semua endpoint di bawah ini **wajib** menyertakan `Bearer Token` di header `Authorization`.

- **Header:** `Authorization: Bearer [TOKEN_DARI_LOGIN]`

#### Ambil Semua Percakapan

Endpoint untuk melihat semua riwayat percakapan dengan pagination.

- **URL:** `/conversations`
- **Method:** `GET`
- **Query Params (Opsional):**
  - `page`: Nomor halaman (default: `1`)
  - `limit`: Jumlah data per halaman (default: `10`)
  - **Contoh URL:** `http://127.0.0.1:3333/conversations?page=1&limit=5`
- **Response Sukses (200 OK):**
  ```json
  {
    "meta": {
      "total": 20,
      "per_page": 5,
      "current_page": 1,
      "last_page": 4,
      "first_page": 1,
      "first_page_url": "/conversations?page=1",
      "last_page_url": "/conversations?page=4",
      "next_page_url": "/conversations?page=2",
      "previous_page_url": null
    },
    "data": [
      {
        "id": "f4e6b3a0-...",
        "session_id": "f4e6b3a0-...",
        "created_at": "...",
        "updated_at": "...",
        "messages": [{ "...": "..." }, { "...": "..." }]
      }
    ]
  }
  ```

#### Ambil Detail Percakapan

Endpoint untuk melihat satu percakapan spesifik.

- **URL:** `/conversations/:id`
- **Method:** `GET`
- **Response Sukses (200 OK):**
  ```json
  {
    "id": "f4e6b3a0-...",
    "session_id": "f4e6b3a0-...",
    "created_at": "...",
    "updated_at": "...",
    "messages": [
      {
        "id": "a1b2c3d4-...",
        "conversation_id": "f4e6b3a0-...",
        "sender_type": "user",
        "message": "ada layanan apa di majadigi?",
        "...": "..."
      },
      {
        "id": "e5f6g7h8-...",
        "conversation_id": "f4e6b3a0-...",
        "sender_type": "bot",
        "message": "Halo! Saya Maja.AI...",
        "...": "..."
      }
    ]
  }
  ```

#### Hapus Percakapan

Endpoint untuk menghapus satu percakapan spesifik.

- **URL:** `/conversations/:id`
- **Method:** `DELETE`
- **Response Sukses (200 OK):**
  ```json
  {
    "message": "Percakapan berhasil dihapus."
  }
  ```
