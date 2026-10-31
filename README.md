# Sistem Data Panitia (Tugas 3 Pemrograman Web)

Aplikasi CRUD data panitia kegiatan dengan **Express.js, EJS, dan MySQL**.
Seluruh query memakai **Prepared Statements** (placeholder `?`), arsitektur **MVC**,
kredensial database disimpan di `.env`, dan koneksi memakai **Connection Pool**.

## Struktur
```
app.js                      entry point (middleware, router, 404)
config/database.js          connection pool (mysql2/promise)
models/panitia.model.js     seluruh query SQL (prepared statements)
controllers/                alur data, validasi, redirect
routes/panitia.routes.js    definisi endpoint
views/                      tampilan EJS (pages + partials)
public/css/style.css        gaya tampilan
database.sql                skema tabel + data contoh
```

## Cara menjalankan
1. `npm install`
2. Salin `.env.example` menjadi `.env`, lalu isi `DB_PASSWORD`.
3. Buat database dan tabel: `mysql -u root -p < database.sql`
4. `npm run dev`, lalu buka http://localhost:3000

## Skema tabel `panitia`
| Kolom | Tipe |
|---|---|
| id | INT AUTO_INCREMENT PRIMARY KEY |
| nim | VARCHAR(20) UNIQUE |
| nama_lengkap | VARCHAR(100) |
| divisi | ENUM |
| jabatan | ENUM |
| no_hp | VARCHAR(20) |
| tanggal_bergabung | DATE |
| jumlah_kehadiran | INT |
| status | ENUM |
| catatan | TEXT |
| created_at | TIMESTAMP |

## Traceability Matrix
Isi kolom **Status** (Pass/Fail) setelah pengujian dilakukan.

| ID Uji | Fitur / Operasi | Endpoint URL | HTTP Method | Skenario Pengujian | Hasil yang Diharapkan | Status | Bukti Tangkapan Layar |
|---|---|---|---|---|---|---|---|
| TC-01 | Koneksi Pool | App Startup | - | Server dijalankan pertama kali | Terhubung ke MySQL Pool tanpa error | | docs/screenshots/t3-01-db-pool-connection.png |
| TC-02 | Read (All) | /panitia | GET | Akses halaman daftar panitia | Seluruh record tabel MySQL tampil di antarmuka EJS | | docs/screenshots/t3-02-read-select-render.png |
| TC-03 | Create | /panitia/tambah | POST | Submit formulir panitia baru | Data tersimpan di DB, DevTools mencatat 302 Redirect ke /panitia | | docs/screenshots/t3-03-create-insert-prg.png |
| TC-04 | Update | /panitia/edit/:id | POST | Mengubah jabatan dan status panitia | Nilai kolom pada baris MySQL berubah sesuai input baru | | docs/screenshots/t3-04-update-param-redirect.png |
| TC-05 | Delete | /panitia/hapus/:id | POST | Eksekusi tombol hapus panitia | Baris record terhapus dari MySQL dan UI ter-refresh | | docs/screenshots/t3-05-delete-feedback.png |
| TC-06 | Keamanan | /panitia?divisi=... | GET | Input `Acara' OR '1'='1` via URL | Prepared Statement memperlakukan input sebagai literal (0 data, tidak ada injeksi) | | docs/screenshots/t3-06-sql-injection-mitigation.png |
| TC-07 | Validasi Server | /panitia/tambah | POST | Submit NIM berisi huruf / NIM duplikat | Form tampil kembali dengan pesan galat (400), data tidak tersimpan | | docs/screenshots/t3-07-validasi-form.png |
| TC-08 | Data Tidak Ditemukan | /panitia/edit/:id | GET | Buka /panitia/edit/9999 | Halaman 404 yang rapi, server tidak crash | | docs/screenshots/t3-08-not-found-404.png |
