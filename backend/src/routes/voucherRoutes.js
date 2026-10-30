const express = require('express');
const router = express.Router();
const {
  getNextVoucherNumber,
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher
} = require('../controllers/voucherController');
const { validateVoucherInput } = require('../middleware/validator');

// Sequence route for generating next voucher number
router.get('/next-number', getNextVoucherNumber);

// Standard CRUD
router.route('/')
  .get(getVouchers)
  .post(validateVoucherInput, createVoucher);

router.route('/:id')
  .get(getVoucherById)
  .put(validateVoucherInput, updateVoucher)
  .delete(deleteVoucher);

module.exports = router;
