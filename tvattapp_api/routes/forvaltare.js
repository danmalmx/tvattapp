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

//Include other resource routers
const foreningRouter = require('./foreningar');

//Re-route to other resource routers
router.use('/:forvaltareId/foreningar', foreningRouter);

// Tildela routes HTTP

router.route('/').get(getForvaltare).post(createForvaltare);

router
	.route('/:id')
	.get(getEnForvaltare)
	.put(updateForvaltare)
	.delete(deleteForvaltare);

module.exports = router;
