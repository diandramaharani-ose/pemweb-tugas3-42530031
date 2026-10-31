const express = require('express');
const router = express.Router();
const panitiaController = require('../controllers/panitia.controller');

// READ
router.get('/panitia', panitiaController.getDaftarPanitia);

// CREATE
router.get('/panitia/tambah', panitiaController.getFormTambah);
router.post('/panitia/tambah', panitiaController.postTambahPanitia);

// UPDATE (rute dinamis)
router.get('/panitia/edit/:id', panitiaController.getFormEdit);
router.post('/panitia/edit/:id', panitiaController.postUpdatePanitia);

// DELETE
router.post('/panitia/hapus/:id', panitiaController.postHapusPanitia);

module.exports = router;
