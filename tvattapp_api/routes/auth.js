const express = require('express');
const router = express.Router();

const { registrera } = require('../controllers/auth');

router.post('/registrera', registrera);

module.exports = router;
