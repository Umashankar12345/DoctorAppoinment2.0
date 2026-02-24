const express = require('express');
const router = express.Router();
const { getClinics, getClinicById, getNearbyClinics } = require('../controllers/clinicController');

router.get('/nearby', getNearbyClinics);
router.get('/:id', getClinicById);
router.get('/', getClinics);

module.exports = router;
