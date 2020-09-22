const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const slugify = require('slugify');

const AnvandareSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Förnamn är obliatoriskt'],
		},
		lastName: {
			type: String,
			required: [true, 'Efternamn är obliatoriskt'],
		},
		email: {
			type: String,
			required: [true, 'Email är obligatorisk'],
			unique: [true, 'Den email adressen är redan använd'],
			match: [
				/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/,
				'Använd ett giltigt email',
			],
		},
		// userName: {
		// 	type: {},
		// 	required: [
		// 		true,
		// 		'Läg till ett användarnman. Vi föreslår din emailadress',
		// 	],
		// 	default: this.email,
		// },
		role: {
			type: String,
			required: [true, 'Roll är obligatorisk'],
			enum: ['SYSTEM_ADMIN', 'ADMIN', 'USER'],
			default: 'USER',
		},
		password: {
			type: String,
			required: [true, 'Lösenord är obligatoriskt'],
			minlength: 8,
			select: false,
		},
		resetPassword: String,
		passwordExpires: Date,

		phone: {
			type: String,
			minlength: 12,
			// match: [
			// 	/ \+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,12}$ /,
			// 	'Använd ett giltigt mobilnummer som börjar med landskod +46...',
			// ],
			match: [
				/^[\+]{0,1}[1-9]{1}[0-9]{7,11}$/,
				'Använd ett giltigt mobilnummer som börjar med landskod +46...',
			],
		},
		appartmentNumber: {
			type: String,
			// required: [
			// 	true,
			// 	'Lägenhetsnummer är obligatorisk - står på överkanten av ytterdörren',
			// ],
		},
		anvandare: {
			type: mongoose.Schema.ObjectId,
			ref: 'Anvandare',
			required: true,
		},
	},
	{ timestamps: true }
);

//Encrypt password (bcryptjs library)
AnvandareSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

//Sign with JWT and return
AnvandareSchema.methods.getJWTToken = function () {
	return jwt.sign(
		{ id: this._id },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

//Match users password to hashed password
AnvandareSchema.methods.matchPassword = async function (
	userPassword
) {
	return await bcrypt.compare(userPassword, this.password);
};

//Generate and hash password token
AnvandareSchema.methods.resetPasswordToken = function () {
	//Geretate token
	const resetToken = crypto.randomBytes(20).toString('hex');

	//Hash token, set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set expire
	this.passwordExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model(
	'Anvandare',
	AnvandareSchema
);
