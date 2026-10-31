const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/database');
const panitiaRoutes = require('./routes/panitia.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper format untuk tampilan (bisa dipakai di semua file EJS)
app.locals.formatTanggal = (tgl) => {
  if (!tgl) return '-';
  const d = new Date(`${String(tgl).slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};
app.locals.formatAngka = (n) => Number(n).toLocaleString('id-ID');

// Halaman awal diarahkan ke daftar panitia
app.get('/', (req, res) => res.redirect('/panitia'));

app.use('/', panitiaRoutes);

// Fallback 404 (harus paling bawah)
app.use((req, res) => {
  res.status(404).render('pages/error', {
    pageTitle: '404 - Tidak Ditemukan',
    kode: 404,
    pesan: 'Halaman yang kamu cari tidak ditemukan.'
  });
});

// Verifikasi koneksi basis data saat startup
db.query('SELECT 1 + 1 AS result')
  .then(() => {
    console.log('[DATABASE] Terhubung ke MySQL Pool secara aman.');
    app.listen(PORT, () => console.log(`[SERVER] Aktif di http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('[DATABASE ERROR] Gagal terhubung ke MySQL:', err.message);
  });
