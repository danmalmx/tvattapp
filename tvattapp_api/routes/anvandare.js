const express = require('express');
const router = express.Router({ mergeParams: true });
const Anvandare = require('../models/Anvandare');
const Forvaltare = require('../models/Forvaltare');
const advancedResults = require('../middleware/advancedResults');

const {
	protect,
	authorize,
} = require('../middleware/auth');

router.use(protect);
router.use(authorize('SYSTEM_ADMIN', 'ADMIN'));

// Importera routes och logik

const {
	getAnvandare,
	getOneAnvandare,
	createAnvandare,
	updateAnvandare,
	deleteAnvandare,
} = require('../controllers/anvandare');

// Tildela routes HTTP

router
	.route('/')
	.get(advancedResults(Anvandare), getAnvandare)
	.post(createAnvandare);

router
	.route('/:id')
	.get(getOneAnvandare)
	.put(updateAnvandare)
	.delete(deleteAnvandare);

module.exports = router;
