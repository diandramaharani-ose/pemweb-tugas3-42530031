const PanitiaModel = require('../models/panitia.model');

// ---------- Fungsi bantu (tidak ada SQL di sini) ----------
const teks = (v) => (typeof v === 'string' ? v.trim() : '');
const idValid = (id) => /^\d+$/.test(id);

const opsiForm = () => ({
  divisiList: PanitiaModel.DIVISI,
  jabatanList: PanitiaModel.JABATAN,
  statusList: PanitiaModel.STATUS
});

const bacaInput = (body) => ({
  nim: teks(body.nim),
  nama_lengkap: teks(body.nama_lengkap),
  divisi: teks(body.divisi),
  jabatan: teks(body.jabatan),
  no_hp: teks(body.no_hp),
  tanggal_bergabung: teks(body.tanggal_bergabung),
  jumlah_kehadiran: teks(body.jumlah_kehadiran),
  status: teks(body.status),
  catatan: teks(body.catatan)
});

const tanggalValid = (s) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(new Date(s).getTime()) &&
  new Date(s).toISOString().slice(0, 10) === s;

// Validasi server-side: mengembalikan daftar pesan galat (kosong = valid)
const validasi = (d) => {
  const e = [];
  if (!/^\d{5,20}$/.test(d.nim)) e.push('NIM wajib diisi berupa angka (5-20 digit).');
  if (d.nama_lengkap.length < 3 || d.nama_lengkap.length > 100) e.push('Nama lengkap wajib diisi (3-100 karakter).');
  if (!PanitiaModel.DIVISI.includes(d.divisi)) e.push('Divisi tidak valid.');
  if (!PanitiaModel.JABATAN.includes(d.jabatan)) e.push('Jabatan tidak valid.');
  if (!/^[0-9+\-\s]{8,20}$/.test(d.no_hp)) e.push('Nomor HP tidak valid (8-20 karakter: angka, +, -, spasi).');
  if (!tanggalValid(d.tanggal_bergabung)) e.push('Tanggal bergabung tidak valid.');
  if (!/^\d{1,3}$/.test(d.jumlah_kehadiran)) e.push('Jumlah kehadiran harus berupa angka 0-999.');
  if (!PanitiaModel.STATUS.includes(d.status)) e.push('Status tidak valid.');
  if (d.catatan.length > 1000) e.push('Catatan maksimal 1000 karakter.');
  return e;
};

// Mengubah input form menjadi nilai siap simpan (angka sebagai Number, catatan kosong = NULL)
const keNilaiDb = (d) => ({
  ...d,
  jumlah_kehadiran: Number(d.jumlah_kehadiran),
  catatan: d.catatan === '' ? null : d.catatan
});

const renderForm = (res, kode, { judul, action, labelTombol, data, errors }) =>
  res.status(kode).render('pages/panitia-form', {
    pageTitle: judul, action, labelTombol, data, errors, ...opsiForm()
  });

const renderError = (res, kode, pesan) =>
  res.status(kode).render('pages/error', {
    pageTitle: `Error ${kode}`, kode, pesan
  });

// ---------- READ (semua) ----------
exports.getDaftarPanitia = async (req, res) => {
  try {
    const filter = { divisi: teks(req.query.divisi), q: teks(req.query.q).slice(0, 100) };
    const panitiaList = await PanitiaModel.getAll(filter);
    res.render('pages/panitia-list', {
      pageTitle: 'Data Panitia',
      panitiaList,
      filter,
      divisiList: PanitiaModel.DIVISI
    });
  } catch (error) {
    console.error('[ERROR getDaftarPanitia]:', error);
    renderError(res, 500, 'Terjadi galat internal saat mengambil data.');
  }
};

// ---------- CREATE ----------
exports.getFormTambah = (req, res) => {
  renderForm(res, 200, {
    judul: 'Tambah Data Panitia',
    action: '/panitia/tambah',
    labelTombol: 'Simpan ke Basis Data',
    data: {
      nim: '', nama_lengkap: '', divisi: '', jabatan: 'Anggota', no_hp: '',
      tanggal_bergabung: new Date().toLocaleDateString('en-CA'),
      jumlah_kehadiran: '0', status: 'Aktif', catatan: ''
    },
    errors: []
  });
};

exports.postTambahPanitia = async (req, res) => {
  const data = bacaInput(req.body);
  const errors = validasi(data);
  const tampilkanForm = (kode) => renderForm(res, kode, {
    judul: 'Tambah Data Panitia', action: '/panitia/tambah',
    labelTombol: 'Simpan ke Basis Data', data, errors
  });

  if (errors.length > 0) return tampilkanForm(400);

  try {
    await PanitiaModel.create(keNilaiDb(data));
    console.log(`[DATABASE] Data "${data.nama_lengkap}" berhasil di-insert.`);
    res.redirect('/panitia'); // Pola Post-Redirect-Get (PRG)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      errors.push('NIM sudah terdaftar. Gunakan NIM yang lain.');
      return tampilkanForm(400);
    }
    console.error('[ERROR postTambahPanitia]:', error);
    renderError(res, 500, 'Gagal menyimpan data ke basis data.');
  }
};

// ---------- UPDATE ----------
exports.getFormEdit = async (req, res) => {
  const { id } = req.params; // parameter rute dinamis
  if (!idValid(id)) return renderError(res, 404, 'Data panitia tidak ditemukan.');

  try {
    const panitia = await PanitiaModel.getById(id);
    if (!panitia) return renderError(res, 404, 'Data panitia tidak ditemukan.');

    renderForm(res, 200, {
      judul: `Edit Data Panitia #${panitia.id}`,
      action: `/panitia/edit/${panitia.id}`,
      labelTombol: 'Perbarui Perubahan',
      data: { ...panitia, catatan: panitia.catatan || '' }, // form terisi data lama (pre-filled)
      errors: []
    });
  } catch (error) {
    console.error('[ERROR getFormEdit]:', error);
    renderError(res, 500, 'Galat internal saat memuat form edit.');
  }
};

exports.postUpdatePanitia = async (req, res) => {
  const { id } = req.params;
  if (!idValid(id)) return renderError(res, 404, 'Data panitia tidak ditemukan.');

  const data = { ...bacaInput(req.body), id };
  const errors = validasi(data);
  const tampilkanForm = (kode) => renderForm(res, kode, {
    judul: `Edit Data Panitia #${id}`, action: `/panitia/edit/${id}`,
    labelTombol: 'Perbarui Perubahan', data, errors
  });

  if (errors.length > 0) return tampilkanForm(400);

  try {
    const result = await PanitiaModel.update(id, keNilaiDb(data));
    if (result.affectedRows === 0) return renderError(res, 404, 'Data panitia tidak ditemukan.');

    console.log(`[DATABASE] Record ID ${id} berhasil diperbarui.`);
    res.redirect('/panitia');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      errors.push('NIM sudah dipakai panitia lain.');
      return tampilkanForm(400);
    }
    console.error('[ERROR postUpdatePanitia]:', error);
    renderError(res, 500, 'Gagal memperbarui data.');
  }
};

// ---------- DELETE ----------
exports.postHapusPanitia = async (req, res) => {
  const { id } = req.params;
  if (!idValid(id)) return renderError(res, 404, 'Data panitia tidak ditemukan.');

  try {
    const result = await PanitiaModel.delete(id);
    if (result.affectedRows === 0) {
      console.warn(`[DATABASE] Tidak ada record yang terhapus untuk ID ${id}`);
    } else {
      console.log(`[DATABASE] Record ID ${id} berhasil dihapus.`);
    }
    res.redirect('/panitia');
  } catch (error) {
    console.error('[ERROR postHapusPanitia]:', error);
    renderError(res, 500, 'Gagal menghapus data dari basis data.');
  }
};
