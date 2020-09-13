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
	condominios: {},
	logo: {
		type: Object,
		required: [true, 'Logotyp är obligatorisk'],
		unique: true,
	},
	url: {
		type: String,
		match: [
			/https?:|\/\(www\.)?[a-zA-Z0-9@:%_\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-+()@:%_\+.~#?&//=]*)/,
			'Använd en befintlig websida / URL med HTTP eller HTTPS',
		],
		unique: true,
		trim: true,
	},
	slug: String,
});
