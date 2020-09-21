const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utilities/errorResponse');
const Anvandare = require('../models/Anvandare');

//Protect route - requires login to be able to use
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
		console.log(`Token: ${token}`);
	} else if (req.cookies.token) {
		token = req.cookies.token;
	}

	//Check if token exists
	if (!token) {
		return next(
			new ErrorResponse(
				'Du saknar behörighet till denna route',
				401
			)
		);
	}
	try {
		//Verify toke
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET
		);
		console.log(`Decoded: ${decoded}`);

		req.anvandare = await Anvandare.findById(decoded.id);

		next();
	} catch (error) {
		return next(
			new ErrorResponse(
				'Du saknar behörighet till denna route',
				401
			)
		);
	}
});

//Grant access to different roles

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.anvandare.role)) {
			return next(
				new ErrorResponse(
					`Användre med rollen ${req.anvandare.role} har inte behörighet till denna route`,
					403
				)
			);
		}
		next();
	};
};
