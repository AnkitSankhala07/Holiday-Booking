const Booking = require('../models/Booking');

// @desc    Create a new holiday booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { packageId, packageTitle, travelerName, travelerEmail, travelerPhone, travelersCount, travelDate, totalAmount, specialRequests } = req.body;

    if (!packageId || !packageTitle || !travelerName || !travelerEmail || !travelerPhone || !travelDate || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      packageId,
      packageTitle,
      travelerName,
      travelerEmail,
      travelerPhone,
      travelersCount: travelersCount || 1,
      travelDate,
      totalAmount,
      specialRequests: specialRequests || '',
      status: 'pending'
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Ensure booking belongs to user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };
