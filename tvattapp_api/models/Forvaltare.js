const mongoose = require('mongoose');

const ForvaltareSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Namn är obligatoriskt'],
		unique: true,
		trim: true,
		maxlength: [
			50,
			'Namnet kan inte överstiga 50 tecken',
		],
	},
	// condominios: {},
	logo: {
		type: String,
		required: [true, 'Logotyp är obligatorisk'],
		unique: true,
		default: 'no-logo.jpg',
	},
	url: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Använd en befintlig websida / URL med HTTP eller HTTPS',
		],
		unique: true,
		trim: true,
	},
	slug: String,

	// For Condominio later
	// location: {
	// 	//GeoJSON Point
	// 	type: {
	// 		type: String,
	// 		enum: ['Point'],
	// 		required: true,
	// 	},
	// 	coordinates: {
	// 		type: [Number],
	// 		required: true,
	// 		index: '2dsphere',
	// 	},
	// 	formattedAddress: String,
	// 	street: String,
	// 	city: String,
	// 	state: String,
	// 	country: String,
	// },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	'Forvaltare',
	ForvaltareSchema
);
