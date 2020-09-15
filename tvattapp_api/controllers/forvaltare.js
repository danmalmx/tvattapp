const ErrorResponse = require('../utilities/errorResponse');
const Forvaltare = require('../models/Forvaltare');

// BESKRIVNING:     Hämtar fastighetsförvaltare
// ROUTE:           GET /api/v1/forvaltare/
// TILLGÅNG:        `Visa alla fastighetsförvaltare'

exports.getForvaltare = async (req, res, next) => {
	try {
		const forvaltare = await Forvaltare.find();

		res.status(200).json({
			success: true,
			data: forvaltare,
		});
	} catch (error) {
		next(error);
	}
};

// BESKRIVNING:     Hämtar en fastighetsförvaltare
// ROUTE:           GET /api/v1/forvaltare/:id
// TILLGÅNG:        `Visa fastighetsförvaltare ${req.params.id}`

exports.getEnForvaltare = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};

// BESKRIVNING:     Skapa ny fastighetsförvaltare
// ROUTE:           POST /api/v1/forvaltare
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.createForvaltare = async (req, res, next) => {
	try {
		const forvaltare = await Forvaltare.create(req.body);

		res.status(201).json({
			success: true,
			data: forvaltare,
		});
	} catch (error) {
		next(error);
	}
};
// BESKRIVNING:     Uppdatera en fastighetsförvaltare
// ROUTE:           PUT /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.updateForvaltare = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};

// BESKRIVNING:     Tar bort en fastighetsförvaltare
// ROUTE:           DELETE /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.deleteForvaltare = async (req, res, next) => {
	try {
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
	} catch (error) {
		next(error);
	}
};
