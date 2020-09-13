const express = require('express');
const router = express.Router();

// Importera routes och logik
const {
	getForvaltare,
	getEnForvaltare,
	createForvaltare,
	updateForvaltare,
	deleteForvaltare,
} = require('../controllers/forvaltare');

// Tildela routes HTTP
router
	.route('/')
	.get(getForvaltare)
	.post(createForvaltare);

router
	.route('/:id')
	.get(getEnForvaltare)
	.put(updateForvaltare)
	.delete(deleteForvaltare);

module.exports = router;
