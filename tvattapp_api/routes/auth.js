const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
	registrera,
	login,
	getMe,
	forgotPassword,
} = require('../controllers/auth');

router.post('/registrera', registrera);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
