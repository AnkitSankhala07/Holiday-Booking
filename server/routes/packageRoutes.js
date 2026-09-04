const express = require('express');
const router = express.Router();
const { getPackages, getPackageById, createPackage } = require('../controllers/packageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/', protect, admin, createPackage);

module.exports = router;
