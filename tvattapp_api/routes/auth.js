const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
	registrera,
	login,
	getMe,
} = require('../controllers/auth');

router.post('/registrera', registrera);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
