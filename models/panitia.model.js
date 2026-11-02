const db = require('../config/database');

// Daftar nilai yang diizinkan (sama dengan definisi ENUM di tabel)
const DIVISI = ['Acara', 'Humas', 'Konsumsi', 'Perlengkapan', 'Dokumentasi', 'Sekretariat'];
const JABATAN = ['Koordinator', 'Wakil Koordinator', 'Anggota'];
const STATUS = ['Aktif', 'Nonaktif'];

// Seluruh query SQL HANYA ada di file ini, dan semuanya memakai placeholder (?)
// db.execute() = prepared statement sungguhan: struktur query dan nilai dikirim terpisah.
const PanitiaModel = {
  DIVISI,
  JABATAN,
  STATUS,

  // READ (semua) + filter opsional divisi dan pencarian nama.
  // Query tetap satu bentuk (tanpa menyambung string SQL): filter kosong = diabaikan.
  getAll: async ({ divisi = '', q = '' } = {}) => {
    const sql = `
      SELECT * FROM panitia
      WHERE (? = '' OR divisi = ?)
        AND (? = '' OR nama_lengkap LIKE CONCAT('%', ?, '%'))
      ORDER BY id DESC
    `;
    const [rows] = await db.execute(sql, [divisi, divisi, q, q]);
    return rows;
  },

  // READ (satu data berdasarkan id)
  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM panitia WHERE id = ?', [id]);
    return rows[0];
  },

  // CREATE
  create: async (d) => {
    const sql = `
      INSERT INTO panitia
        (nim, nama_lengkap, divisi, jabatan, no_hp, tanggal_bergabung, jumlah_kehadiran, status, catatan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      d.nim, d.nama_lengkap, d.divisi, d.jabatan, d.no_hp,
      d.tanggal_bergabung, d.jumlah_kehadiran, d.status, d.catatan
    ]);
    return result;
  },

  // UPDATE
  update: async (id, d) => {
    const sql = `
      UPDATE panitia
      SET nim = ?, nama_lengkap = ?, divisi = ?, jabatan = ?, no_hp = ?,
          tanggal_bergabung = ?, jumlah_kehadiran = ?, status = ?, catatan = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(sql, [
      d.nim, d.nama_lengkap, d.divisi, d.jabatan, d.no_hp,
      d.tanggal_bergabung, d.jumlah_kehadiran, d.status, d.catatan, id
    ]);
    return result;
  },

  // DELETE
  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM panitia WHERE id = ?', [id]);
    return result;
  }
};

module.exports = PanitiaModel;
