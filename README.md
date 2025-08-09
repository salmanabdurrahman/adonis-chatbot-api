# REST API Sederhana untuk Chatbot

Ini adalah project REST API sederhana yang dibangun menggunakan AdonisJS v5 dan PostgreSQL. API ini berfungsi sebagai perantara antara pengguna dan API chatbot eksternal, sambil menyimpan riwayat percakapan.

## Fitur Utama

- Validasi input otomatis
- Struktur database rapi dengan schema `chatbot`
- Primary key pakai UUID
- Endpoint CRUD percakapan
- Pagination untuk daftar percakapan
- Proteksi API Key untuk endpoint sensitif

## Persyaratan

- Node.js (v14)
- PostgreSQL (v12 atau lebih baru)

## Panduan Instalasi & Setup

1.  **Clone Repositori**

    ```bash
    git clone https://github.com/salmanabdurrahman/adonis-chatbot-api.git
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
    - Atur `API_KEY` Anda sendiri untuk keamanan.

      ```env
      # .env
      DB_CONNECTION=pg
      PG_HOST=localhost
      PG_PORT=5432
      PG_USER=postgres
      PG_PASSWORD=root (sesuaikan dengan password PostgreSQL Anda)
      PG_DB_NAME=chatbot_api_db

      API_KEY=ini-adalah-kunci-rahasia-saya
      ```

4.  **Jalankan Migrasi Database**
    Perintah ini akan membuat schema `chatbot` beserta tabel `conversations` dan `messages`.

    ```bash
    node ace migration:run
    ```

5.  **Jalankan Aplikasi**
    ```bash
    node ace serve --watch atau npm run dev
    ```
    Server akan berjalan di `http://127.0.0.1:3333`.

## Dokumentasi Endpoint API

### 1. Kirim Pertanyaan

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

- **Contoh Response Sukses (200 OK):**
  ```json
  {
    "session_id": "f4e6b3a0-1b2c-4d5e-8f9a-0b1c2d3e4f5a",
    "your_question": "ada layanan apa di majadigi?",
    "bot_answer": "Halo! Saya Maja.AI, asisten informasi publik Jawa Timur..."
  }
  ```

### 2\. Ambil Semua Percakapan

Endpoint ini untuk melihat semua riwayat percakapan dengan pagination.

- **URL:** `/conversations`
- **Method:** `GET`
- **Otorisasi:** **Wajib**
- **Headers:**
  - `X-API-KEY`: `[API_KEY_ANDA_DARI_.ENV]`
- **Query Params (Opsional):**
  - `page`: Nomor halaman (default: `1`)
  - `limit`: Jumlah data per halaman (default: `10`)
- **Contoh URL:** `http://127.0.0.1:3333/conversations?page=1&limit=5`
- **Contoh Response Sukses (200 OK):**
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

### 3\. Ambil Detail Percakapan

Endpoint ini untuk melihat satu percakapan spesifik beserta seluruh pesannya.

- **URL:** `/conversations/:id`
- **Method:** `GET`
- **Otorisasi:** **Wajib**
- **Headers:**
  - `X-API-KEY`: `[API_KEY_ANDA_DARI_.ENV]`
- **Contoh Response Sukses (200 OK):**
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

### 4\. Hapus Percakapan

Endpoint ini untuk menghapus satu percakapan spesifik.

- **URL:** `/conversations/:id`
- **Method:** `DELETE`
- **Otorisasi:** **Wajib**
- **Headers:**
  - `X-API-KEY`: `[API_KEY_ANDA_DARI_.ENV]`
- **Contoh Response Sukses (200 OK):**
  ```json
  {
    "message": "Percakapan berhasil dihapus."
  }
  ```
