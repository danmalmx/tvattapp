const express = require('express');
const router = express.Router({ mergeParams: true });

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

router.route('/').get(getForeningar).post(createForeningar);

router
	.route('/:id')
	.get(getForening)
	.put(updateForeningar)
	.delete(deleteForeningar);

module.exports = router;
