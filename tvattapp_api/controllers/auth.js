const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Anvandare = require('../models/Anvandare');

// BESKRIVNING:     Skapa användare
// ROUTE:           POST /api/v1/auth/registrera
// TILLGÅNG:        Obegränsat (TBD)

exports.registrera = asyncHandler(
	async (req, res, next) => {
		const {
			firstName,
			lastName,
			// userName,
			email,
			role,
			password,
		} = req.body;

		//Create User
		const anvandare = await Anvandare.create({
			firstName,
			lastName,
			// userName,
			email,
			role,
			password,
		});

		sendTokenResponse(anvandare, 200, res);
	}
);

// BESKRIVNING:     Logga in användare
// ROUTE:           POST /api/v1/auth/login
// TILLGÅNG:        Obegränsat (TBD)

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//Validate email and password
	if (!email || !password) {
		return next(
			new ErrorResponse(
				'Fel inloggning (email / lösenord)'
			),
			400
		);
	}

	//Check for user
	const anvandare = await Anvandare.findOne({
		email,
	}).select('+password');

	if (!anvandare) {
		return next(
			new ErrorResponse(
				'Fel inloggning (email / lösenord)'
			),
			401
		);
	}
	// Check if password matches
	const passwordIsMatch = await anvandare.matchPassword(
		password
	);

	if (!passwordIsMatch) {
		return next(
			new ErrorResponse(
				'Fel inloggning (email / lösenord)'
			),
			401
		);
	}

	sendTokenResponse(anvandare, 200, res);
});

// BESKRIVNING:     Se nuarande inloggade användare
// ROUTE:           POST /api/v1/auth/me
// TILLGÅNG:        Begränsat (måst vara inloggad)

exports.getMe = asyncHandler(async (req, res, next) => {
	const anvandare = await Anvandare.findById(
		req.anvandare.id
	);

	res.status(200).json({
		success: true,
		data: anvandare,
	});
});

// BESKRIVNING:     Glömt lösenord
// ROUTE:           POST /api/v1/auth/forgotpassword
// TILLGÅNG:        Begränsat (måst vara inloggad)

exports.forgotPassword = asyncHandler(
	async (req, res, next) => {
		const anvandare = await Anvandare.findOne({
			email: req.body.email,
		});

		if (!anvandare) {
			return next(
				new ErrorResponse(
					'Det finns ingen användare med det emailet',
					404
				)
			);
		}

		//Get token for reset
		const resetToken = anvandare.resetPasswordToken();

		console.log(resetToken);

		await anvandare.save({ validateBeforeSave: false });

		res.status(200).json({
			success: true,
			data: anvandare,
		});
	}
);

//Get token from model, crrate cookie, send response
const sendTokenResponse = (anvandare, statusCode, res) => {
	const token = anvandare.getJWTToken();

	const options = {
		expires: new Date(
			Date.now() +
				process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({
			success: true,
			token,
		});
};
