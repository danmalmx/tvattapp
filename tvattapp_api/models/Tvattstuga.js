const mongoose = require('mongoose');
const slugify = require('slugify');

const TvattSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'Föreningsnamn är obligatorisk'],
			unique: true,
		},
		address: {
			type: String,
			required: [
				true,
				'Fullständig address är obligatorisk',
			],
		},
		forening: {
			type: mongoose.Schema.ObjectId,
			ref: 'Forening',
			required: true,
		},
		anvandare: {
			type: mongoose.Schema.ObjectId,
			ref: 'Anvandare',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	{ timestamps: true }
);

// Reverse populate with virtuals
ForeningarSchema.virtual('forvaltar', {
	ref: 'Forvaltare',
	localField: '_id',
	foreignField: 'foreningar',
	justOne: false,
});

//Create slug for Tvättstuga
TvattSchema.pre('save', function (next) {
	this.slug = slugify(this.name, {
		lower: true,
		replacement: '_',
	});
	next();
});

module.exports = mongoose.model('Tvattstuga', TvattSchema);
