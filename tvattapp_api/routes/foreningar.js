const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

// Importera routes och logik

const {
	getForeningar,
	getForening,
	createForeningar,
	updateForeningar,
	deleteForeningar,
	getForeningInRadius,
} = require('../controllers/foreningar');

// Tildela routes HTTP
router
	.route('/radius/:zipcode/:distance')
	.get(getForeningInRadius);

router
	.route('/')
	.get(getForeningar)
	.post(protect, createForeningar);

router
	.route('/:id')
	.get(getForening)
	.put(protect, updateForeningar)
	.delete(protect, deleteForeningar);

module.exports = router;
