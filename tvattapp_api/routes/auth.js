const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
	registrera,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updateDetails,
	uppdatePassword,
} = require('../controllers/auth');

router.post('/registrera', registrera);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, uppdatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
