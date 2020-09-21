const express = require('express');
const router = express.Router();
const {
	protect,
	authorize,
} = require('../middleware/auth');

// Importera routes och logik
const {
	getForvaltare,
	getEnForvaltare,
	createForvaltare,
	updateForvaltare,
	deleteForvaltare,
	forvaltareLogoUpload,
} = require('../controllers/forvaltare');

//Include other resource routers
const foreningRouter = require('./foreningar');

//Re-route to other resource routers
router.use('/:forvaltareId/foreningar', foreningRouter);

// Tildela routes HTTP

router
	.route('/')
	.get(getForvaltare)
	.post(
		protect,
		authorize('SYSTEM_ADMIN'),
		createForvaltare
	);

router
	.route('/:id')
	.get(getEnForvaltare)
	.put(protect, authorize('SYSTEM_ADMIN'), updateForvaltare)
	.delete(
		protect,
		authorize('SYSTEM_ADMIN'),
		deleteForvaltare
	);

router
	.route('/:id/photo')
	.put(
		protect,
		authorize('SYSTEM_ADMIN'),
		forvaltareLogoUpload
	);

module.exports = router;
