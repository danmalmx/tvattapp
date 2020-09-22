const ErrorResponse = require('../utilities/errorResponse');
const asyncHandler = require('../middleware/async');
const Anvandare = require('../models/Anvandare');
const sendEmail = require('../utilities/sendEmai');
const crypto = require('crypto');

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

// BESKRIVNING:     Uppdatera användardetaljer
// ROUTE:           PUT /api/v1/auth/updatedetails
// TILLGÅNG:        Begränsat (måst vara inloggad)

exports.updateDetails = asyncHandler(
	async (req, res, next) => {
		const fieldsToUpdate = {
			email: req.body.email,
			firstName: req.body.firstName,
		};

		const anvandare = await Anvandare.findByIdAndUpdate(
			req.anvandare.id,
			fieldsToUpdate,
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

// BESKRIVNING:     Uppdatera lösenord
// ROUTE:           PUT /api/v1/auth/updatepassword
// TILLGÅNG:        Begränsat (måst vara inloggad)

exports.uppdatePassword = asyncHandler(
	async (req, res, next) => {
		const anvandare = await Anvandare.findById(
			req.anvandare.id
		).select('+password');

		//Check current password
		if (
			!(await anvandare.matchPassword(
				req.body.currentPassword
			))
		) {
			return next(
				new ErrorResponse('Lösenordet är inkorrekt', 401)
			);
		}
		anvandare.password = req.body.newPassword;

		await anvandare.save();

		sendTokenResponse(anvandare, 200, res);

		res.status(200).json({
			success: true,
			data: anvandare,
		});
	}
);
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

		await anvandare.save({ validateBeforeSave: false });

		//Create reset URL
		const resetUrl = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/auth/resetpassword/${resetToken}`;

		const message = `Du får detta email på grund av att du (eller någon annan) har begärt att återställa lösenordet. Var vänlig och gör en PUT förfrågning till: \n\n ${resetUrl}`;

		try {
			await sendEmail({
				email: anvandare.email,
				subject: 'Token för att återställ lösenord',
				message,
			});

			res.status(200).json({
				success: true,
				data: 'Email skickat',
			});
		} catch (error) {
			anvandare.resetPassword = undefined;
			anvandare.passwordExpires = undefined;

			await anvandare.save({ validateBeforeSave: false });

			return next(
				new ErrorResponse('Kunde inte skicka email', 500)
			);
		}

		res.status(200).json({
			success: true,
			data: anvandare,
		});
	}
);

// BESKRIVNING:     Återställ lösenord
// ROUTE:           PUT /api/v1/auth/resetpassword/:resettoken
// TILLGÅNG:        Obegränsad

exports.resetPassword = asyncHandler(
	async (req, res, next) => {
		//Get hashed token
		const resetPassword = crypto
			.createHash('sha256')
			.update(req.params.resettoken)
			.digest('hex');

		console.log(req.params.resettoken);

		const anvandare = await Anvandare.findOne({
			resetPassword: resetPassword,
			passwordExpires: { $gt: Date.now() },
		});

		console.log(`Användare: ${anvandare}`);

		if (!anvandare) {
			return next(new ErrorResponse('Ogiltig token', 400));
		}

		//Set new password
		anvandare.password = req.body.password;
		anvandare.resetPassword = undefined;
		anvandare.passwordExpires = undefined;

		await anvandare.save();

		sendTokenResponse(anvandare, 200, res);
	}
);

//Get token from model, create cookie, send response
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
