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

		//Create JWT
		const token = anvandare.getJWTToken();

		res.status(200).json({ success: true, token });
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

	//Create JWT
	const token = anvandare.getJWTToken();

	res.status(200).json({ success: true, token });
});
