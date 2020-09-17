const e = require('express');
const ErrorResponse = require('../utilities/errorResponse');

const errorHandler = (err, req, res, next) => {
	console.log(req);
	let error = { ...err };

	error.message = err.message;

	//Developer console log
	console.log(err);

	//Monngoose ObjectId error
	console.log(err.name);

	if (err.name === 'CastError') {
		const message = `Hittade ingen förvaltare med id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}

	//Mongoose duplicate error
	if (err.code === 11000) {
		console.log(err);
		const message = `Det finns redan ett inlägg med ${
			err.keyValue.logo
				? `logotypen: ${err.keyValue.logo}`
				: err.keyValue.name
				? `namnet: ${err.keyValue.name}`
				: err.keyValue.website
				? `websidan: ${err.keyValue.website}`
				: err.keyValue.email
				? `emailen: ${err.keyValue.email}`
				: ''
		}`;
		error = new ErrorResponse(message, 400);
	}

	//Mongoose validation erro
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map(
			(val) => val.message
		);
		error = new ErrorResponse(message, 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Serverfel',
	});
};

module.exports = errorHandler;
