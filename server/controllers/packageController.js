const Package = require('../models/Package');

// @desc    Get all holiday packages with optional search and filters
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
  try {
    const { type, country, theme, search } = req.query;
    let query = {};

    if (type) query.type = type;
    if (country) query.country = new RegExp(country, 'i');
    if (theme) query.theme = theme;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') },
        { overview: new RegExp(search, 'i') }
      ];
    }

    const packages = await Package.find(query).sort({ rating: -1, price: 1 });
    res.json({ success: true, count: packages.length, packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single package details by packageId or MongoDB _id
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findOne({
      $or: [{ packageId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }]
    });

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new package (Admin)
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json({ success: true, package: newPackage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getPackages, getPackageById, createPackage };
