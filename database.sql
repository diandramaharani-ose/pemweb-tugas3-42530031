CREATE DATABASE IF NOT EXISTS db_panitia;
USE db_panitia;

CREATE TABLE IF NOT EXISTS panitia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nim VARCHAR(20) NOT NULL UNIQUE,
  nama_lengkap VARCHAR(100) NOT NULL,
  divisi ENUM('Acara','Humas','Konsumsi','Perlengkapan','Dokumentasi','Sekretariat') NOT NULL,
  jabatan ENUM('Koordinator','Wakil Koordinator','Anggota') NOT NULL DEFAULT 'Anggota',
  no_hp VARCHAR(20) NOT NULL,
  tanggal_bergabung DATE NOT NULL,
  jumlah_kehadiran INT NOT NULL DEFAULT 0,
  status ENUM('Aktif','Nonaktif') NOT NULL DEFAULT 'Aktif',
  catatan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data benih (NIM dan nomor HP adalah data contoh; ubah lewat fitur Edit)
INSERT IGNORE INTO panitia
  (nim, nama_lengkap, divisi, jabatan, no_hp, tanggal_bergabung, jumlah_kehadiran, status, catatan)
VALUES
  ('42599001', 'Yohanes Risky Putra Helben Mbira', 'Acara',        'Koordinator',       '081200000001', '2026-09-01', 8, 'Aktif',    'Koordinator divisi acara.'),
  ('42599002', 'Diandra Maharani',                  'Sekretariat',  'Koordinator',       '081200000002', '2026-09-01', 9, 'Aktif',    'Koordinator divisi sekretariat.'),
  ('42599003', 'Komang Widya Paramitha',            'Humas',        'Koordinator',       '081200000003', '2026-09-03', 7, 'Aktif',    'Koordinator divisi humas.'),
  ('42599004', 'Ladhisya Izyafa Faiqatuzihni',      'Konsumsi',     'Wakil Koordinator', '081200000004', '2026-09-05', 6, 'Aktif',    'Wakil koordinator divisi konsumsi.'),
  ('42599005', 'Ardelia Naenda Ahmadi',             'Perlengkapan', 'Anggota',           '081200000005', '2026-09-08', 5, 'Aktif',    'Anggota divisi perlengkapan.'),
  ('42599006', 'Sendhy Nabila Pramesty',            'Dokumentasi',  'Anggota',           '081200000006', '2026-09-10', 2, 'Nonaktif', 'Sedang tidak aktif di kepanitiaan.');
