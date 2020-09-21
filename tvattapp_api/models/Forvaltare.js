const mongoose = require('mongoose');
const slugify = require('slugify');

const ForvaltareSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: [
				50,
				'Namnet kan inte överstiga 50 tecken',
			],
			trim: true,
			unique: true,
			required: [true, 'Namn är obligatoriskt'],
		},
		slug: String,
		logo: {
			type: String,
			unique: true,
			required: [true, 'Logotyp är obligatorisk'],
		},
		website: {
			type: String,
			match: [
				/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
				'Använd en befintlig websida / URL med HTTP eller HTTPS',
			],
			unique: true,
			trim: true,
			required: [true, 'Websida är obligatorisk'],
		},
		anvandare: {
			type: mongoose.Schema.ObjectId,
			ref: 'Anvandare',
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Reverse populate with virtuals
ForvaltareSchema.virtual('foreningar', {
	ref: 'Foreningar',
	localField: '_id',
	foreignField: 'forvaltare',
	justOne: false,
});
//Create slug for Förvaltare
ForvaltareSchema.pre('save', function (next) {
	this.slug = slugify(this.name, {
		lower: true,
		replacement: '_',
	});
	next();
});

module.exports = mongoose.model(
	'Forvaltare',
	ForvaltareSchema
);
