const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Forvaltare = require('../models/Forvaltare');

// BESKRIVNING:     Hämtar fastighetsförvaltare
// ROUTE:           GET /api/v1/forvaltare/
// TILLGÅNG:        `Visa alla fastighetsförvaltare'

exports.getForvaltare = asyncHandler(
	async (req, res, next) => {
		// let query;

		// let queryStr = JSON.stringify(req.query);

		// query = Forvaltare.find(JSON.params(queryStr));

		const forvaltare = await Forvaltare.find().populate({
			path: 'foreningar',
			select: 'name',
		});

		res.status(200).json({
			success: true,
			data: forvaltare,
		});
	}
);

// BESKRIVNING:     Hämtar en fastighetsförvaltare
// ROUTE:           GET /api/v1/forvaltare/:id
// TILLGÅNG:        `Visa fastighetsförvaltare ${req.params.id}`

exports.getEnForvaltare = asyncHandler(
	async (req, res, next) => {
		const forvaltare = await Forvaltare.findById(
			req.params.id
		);

		if (!forvaltare) {
			return next(
				new ErrorResponse(
					`Hittade ingen förvaltare med id ${req.params.id}`,
					404
				)
			);
		}

		res.status(200).json({
			success: true,
			data: forvaltare,
		});
	}
);

// BESKRIVNING:     Skapa ny fastighetsförvaltare
// ROUTE:           POST /api/v1/forvaltare
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.createForvaltare = asyncHandler(
	async (req, res, next) => {
		const forvaltare = await Forvaltare.create(req.body);

		res.status(201).json({
			success: true,
			data: forvaltare,
		});
	}
);
// BESKRIVNING:     Uppdatera en fastighetsförvaltare
// ROUTE:           PUT /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.updateForvaltare = asyncHandler(
	async (req, res, next) => {
		const forvaltare = await Forvaltare.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);
		if (!forvaltare) {
			return next(
				new ErrorResponse(
					`Hittade ingen förvaltare med id ${req.params.id}`,
					404
				)
			);
		}

		res.status(200).json({
			success: true,
			data: forvaltare,
		});
	}
);

// BESKRIVNING:     Tar bort en fastighetsförvaltare
// ROUTE:           DELETE /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.deleteForvaltare = asyncHandler(
	async (req, res, next) => {
		const forvaltare = await Forvaltare.findByIdAndDelete(
			req.params.id
		);
		if (!forvaltare) {
			return next(
				new ErrorResponse(
					`Hittade ingen förvaltare med id ${req.params.id}`,
					404
				)
			);
		}
		res.status(200).json({
			success: true,
			data: {},
		});
	}
);
