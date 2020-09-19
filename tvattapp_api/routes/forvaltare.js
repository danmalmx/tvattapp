const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

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
	.post(protect, createForvaltare);

router
	.route('/:id')
	.get(getEnForvaltare)
	.put(protect, updateForvaltare)
	.delete(protect, deleteForvaltare);

router
	.route('/:id/photo')
	.put(protect, forvaltareLogoUpload);

module.exports = router;
