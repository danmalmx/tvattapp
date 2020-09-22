const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utilities/geocoder');
const Foreningar = require('../models/Foreningar');
const Forvaltare = require('../models/Forvaltare');

// BESKRIVNING:     Hämtar alla föreningar
// ROUTE 1:         GET /api/v1/foreningar/
// ROUTE 2:         GET /api/v1/forvaltare/:forvaltareId/foreningar
// TILLGÅNG:        Obegränsad

exports.getForeningar = asyncHandler(
	async (req, res, next) => {
		let query;

		if (req.params.forvaltareId) {
			query = Foreningar.find({
				forvaltare: req.params.forvaltareId,
			});
		} else {
			query = Foreningar.find().populate({
				path: 'forvaltare',
				select: 'name',
			});
		}

		const foreningar = await query;

		res.status(200).json({
			success: true,
			count: foreningar.length,
			data: foreningar,
		});
	}
);

exports.getForening = asyncHandler(
	async (req, res, next) => {
		const foreningar = await Foreningar.findById(
			req.params.id
		).populate({
			path: 'forvaltare',
			select: 'name',
		});

		if (!foreningar) {
			return next(
				new ErrorResponse(
					`Hitar ingen förening med id ${req.params.id}`,
					404
				)
			);
		}

		res.status(200).json({
			success: true,
			data: foreningar,
		});
	}
);

// BESKRIVNING:     Skapa en ny förening
// ROUTE:           POST /api/v1/forvaltare/:forvaltareId/foreningar
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN eller ADMIN)

exports.createForeningar = asyncHandler(
	async (req, res, next) => {
		//Add user to req.body
		req.body.anvandare = req.anvandare.id;

		req.body.forvaltare = req.params.forvaltareId;

		const forvaltare = await Forvaltare.findById(
			req.params.forvaltareId
		);

		if (!forvaltare) {
			return next(
				new ErrorResponse(
					`Hittar ingen förvaltare med id ${req.params.forvaltareId}`,
					404
				)
			);
		}

		// Make sure only SYSTEM_ADMIN can add förvaltare
		if (
			(forvaltare.anvandare.toString() !==
				req.anvandare.id &&
				req.anvandare.role !== 'SYSTEM_ADMIN') ||
			req.anvandare.role !== 'ADMIN'
		) {
			return next(
				new ErrorResponse(
					`Användare ${req.anvandare.id} har inte behörighet att lägga till en förening`,
					401
				)
			);
		}

		const foreningar = await Foreningar.create(req.body);

		res.status(200).json({
			success: true,
			data: foreningar,
		});
	}
);

// BESKRIVNING:     Uppdatera en förening
// ROUTE:           PUT /api/v1/foreningar/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN eller ADMIN)

exports.updateForeningar = asyncHandler(
	async (req, res, next) => {
		let foreningar = await Foreningar.findById(
			req.params.id
		);

		if (!foreningar) {
			return next(
				new ErrorResponse(
					`Hittar ingen förening med id ${req.params.id}`,
					404
				)
			);
		}

		foreningar = await Foreningar.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
				runValidators: true,
			}
		);

		// Make sure only SYSTEM_ADMIN can update a förvaltare

		if (
			(foreningar.anvandare.toString() !==
				req.anvandare.id &&
				req.anvandare.role !== 'SYSTEM_ADMIN') ||
			req.anvandare.role !== 'ADMIN'
		) {
			return next(
				new ErrorResponse(
					`Användare ${req.anvandare.id} har inte behörighet att uppdatera en förening`,
					401
				)
			);
		}

		res.status(200).json({
			success: true,
			data: foreningar,
		});
	}
);

// BESKRIVNING:     Ta bort en förening
// ROUTE:           DELETE /api/v1/foreningar/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN eller ADMIN)

exports.deleteForeningar = asyncHandler(
	async (req, res, next) => {
		const foreningar = await Foreningar.findById(
			req.params.id
		);

		if (!foreningar) {
			return next(
				new ErrorResponse(
					`Hittar ingen förening med id ${req.params.id}`,
					404
				)
			);
		}

		// Make sure only SYSTEM_ADMIN can delete a förvaltare

		if (
			(foreningar.anvandare.toString() !==
				req.anvandare.id &&
				req.anvandare.role !== 'SYSTEM_ADMIN') ||
			req.anvandare.role !== 'ADMIN'
		) {
			return next(
				new ErrorResponse(
					`Användare ${req.anvandare.id} har inte behörighet att ta bort en förening`,
					401
				)
			);
		}

		await foreningar.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	}
);

// BESKRIVNING:     Få fastighetsförvaltare inom en radius
// ROUTE:           DELETE /api/v1/foreningar/radius/zipcode/:distance
// TILLGÅNG:        Obegränsad

exports.getForeningInRadius = asyncHandler(
	async (req, res, next) => {
		const { zipcode, distance } = req.params;

		//Get lat/lng from geocoder
		const loc = await geocoder.geocode(zipcode);
		const lng = loc[0].longitude;
		const lat = loc[0].latitude;

		//Calculate radius - distance / Earth readius (6378 km)
		const radius = distance / 6378;

		const foreningar = await Foreningar.find({
			location: {
				$geoWithin: { $centerSphere: [[lng, lat], radius] },
			},
		});
		res.status(200).json({
			success: true,
			count: foreningar.length,
			data: foreningar,
		});
	}
);
