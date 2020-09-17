const express = require('express');
const router = express.Router();

const {
	registrera,
	login,
} = require('../controllers/auth');

router.post('/registrera', registrera);
router.post('/login', login);

module.exports = router;
