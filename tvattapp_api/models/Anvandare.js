const mongoose = require('mongoose');
const slugify = require('slugify');

const AnvandareSchema = new mongoose.Schema({
	firstName: {
		type: String,
		trim: true,
		required: [true, 'Förnamn är obliatoriskt'],
	},
	lastName: {
		type: String,
		trim: true,
		required: [true, 'Efternamn är obliatoriskt'],
	},
	password: {
		type: String,
		required: [true, 'Lösenord är obligatoriskt'],
		minlength: 8,
		select: false,
	},
	resetPassword: String,
	passwordExpires: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	email: {
		type: String,
		trim: true,
		required: [true, 'Email är obligatorisk'],
		unique: true,
		match: [
			/ (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
			'Använd ett giltigt email',
		],
	},
	userName: {
		type: String,
		trim: true,
		default: this.email,
		required: true,
	},
	phone: {
		type: String,
		minlength: 12,
		match: [
			/ \+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$ /,
			'Använd ett giltigt mobilnummer som börjar med landskod +46...',
		],
	},
	role: {
		type: String,
		enum: ['SYSTEM_ADMIN', 'ADMIN', 'USER'],
		default: 'USER',
	},
	appartmentNumber: {
		type: String,
		required: [
			true,
			'Lägenhetsnummer är obligatorisk - står på överkanten av ytterdörren',
		],
	},
	foreningar: {
		type: mongoose.Schema.ObjectId,
		ref: 'Foreningar',
		required: true,
	},
});

module.exports = mongoose.model(
	'Anvandare',
	AnvandareSchema
);
