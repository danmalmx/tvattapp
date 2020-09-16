const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Anvandare = require('../models/Anvandare');

// BESKRIVNING:     Registrera användare
// ROUTE:           GET /api/v1/auth/registrera
// TILLGÅNG:        `Visa alla fastighetsförvaltare'

exports.registrera = asyncHandler(
	async (req, res, next) => {
		res.status(200).json({
			success: true,
		});
	}
);
