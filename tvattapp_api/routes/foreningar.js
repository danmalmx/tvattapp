const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	protect,
	authorize,
} = require('../middleware/auth');

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
	.post(
		protect,
		authorize('SYSTEM_ADMIN', 'ADMIN'),
		createForeningar
	);

router
	.route('/:id')
	.get(getForening)
	.put(
		protect,
		authorize('SYSTEM_ADMIN', 'ADMIN'),
		updateForeningar
	)
	.delete(
		protect,
		authorize('SYSTEM_ADMIN', 'ADMIN'),
		deleteForeningar
	);

module.exports = router;
