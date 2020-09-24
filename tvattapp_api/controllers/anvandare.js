const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Anvandare = require('../models/Anvandare');

// BESKRIVNING:     Se alla användare
// ROUTE:           GET /api/v1/auth/anvandare
// TILLGÅNG:        Begränsad (SYSTEM_ADMIN / ADMIN)

exports.getAnvandare = asyncHandler(
	async (req, res, next) => {
		res.status(200).json(res.advancedResults);
	}
);

// BESKRIVNING:     Se en användare
// ROUTE:           GET /api/v1/auth/anvandare/:id
// TILLGÅNG:        Begränsad (SYSTEM_ADMIN / ADMIN)

exports.getOneAnvandare = asyncHandler(
	async (req, res, next) => {
		const anvandare = await Anvandare.findById(
			req.params.id
		);

		res.status(200).json({
			success: true,
			data: anvandare,
		});
	}
);

// BESKRIVNING:     Skapa en användare
// ROUTE:           POST /api/v1/auth/anvandare
// TILLGÅNG:        Begränsad (SYSTEM_ADMIN / ADMIN)

exports.createAnvandare = asyncHandler(
	async (req, res, next) => {
		const anvandare = await Anvandare.create(req.body);

		res.status(201).json({
			success: true,
			data: anvandare,
		});
	}
);

// BESKRIVNING:     Uppdatera en användare
// ROUTE:           PUT /api/v1/auth/anvandare/:id
// TILLGÅNG:        Begränsad (SYSTEM_ADMIN / ADMIN)

exports.updateAnvandare = asyncHandler(
	async (req, res, next) => {
		const anvandare = await Anvandare.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		res.status(200).json({
			success: true,
			data: anvandare,
		});
	}
);

// BESKRIVNING:     Ta bort en användare
// ROUTE:           DELETE /api/v1/auth/anvandare/:id
// TILLGÅNG:        Begränsad (SYSTEM_ADMIN / ADMIN)

exports.deleteAnvandare = asyncHandler(
	async (req, res, next) => {
		await Anvandare.findByIdAndDelete(req.params.id);

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
