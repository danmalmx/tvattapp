const mongoose = require('mongoose');

const ForvaltareSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Namn är obligatoriskt'],
		maxlength: [
			50,
			'Namnet kan inte överstiga 50 tecken',
		],
		trim: true,
		unique: [true, 'Namnet finns redan'],
	},
	logo: {
		type: String,
		default: 'no logo.jpg',
	},
	website: {
		type: String,
		match: [
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
			'Använd en befintlig websida / URL med HTTP eller HTTPS',
		],
		unique: [true, 'Webadressen finns redan'],
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model(
	'Forvaltare',
	ForvaltareSchema
);

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
