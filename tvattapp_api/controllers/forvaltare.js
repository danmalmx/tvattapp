const path = require('path');
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

// BESKRIVNING:     Lägga till en logotyp för en fastighetsförvaltare
// ROUTE:           PUT /api/v1/forvaltare/:id/photo
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.forvaltareLogoUpload = asyncHandler(
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
		if (!req.files) {
			return next(
				new ErrorResponse(
					`Lägg till en logotyp för fastighetsförvaltaren`,
					400
				)
			);
		}

		const file = req.files.file;
		console.log(file);
		//Check that image is a logo

		if (!file.mimetype.startsWith('image')) {
			return next(
				new ErrorResponse(`Ladda upp en logotypfil`, 400)
			);
		}

		//Check size of te file
		if (file.size > process.env.MAX_FILE_UPLOAD) {
			return next(
				new ErrorResponse(
					`Filen kan vara max ${
						process.env.MAX_FILE_UPLOAD / 1000000
					} MB. Den nuvarande är ${file.size / 1000000} MB`,
					400
				)
			);
		}
		//Custom file name
		file.name = `logo_${forvaltare._id}${
			path.parse(file.name).ext
		}`;

		file.mv(
			`${process.env.FILE_UPLOAD_PATH}/${file.name}`,
			async (err) => {
				if (err) {
					console.log(err);
					return next(
						new ErrorResponse(
							`Problem med filuppladdning`,
							500
						)
					);
				}
				await Forvaltare.findByIdAndUpdate(req.params.id, {
					photo: file.name,
				});

				res.status(200).json({
					success: true,
					data: file.name,
				});
			}
		);
	}
);
