const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utilities/geocoder');

const ForeningarSchema = new mongoose.Schema(
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
		streetName: {
			type: String,
			trim: true,
			required: [true, 'Gatuadress är obligatorisk'],
			unique: true,
		},
		streetNumber: {
			type: String,
			trim: true,
			required: [true, 'Gatunummer är obligatorisk'],
			unique: true,
		},
		zipcode: {
			type: String,
			trim: true,
			required: [true, 'Postnummer är obligatorisk'],
			unique: true,
		},
		city: {
			type: String,
			trim: true,
			required: [true, 'Stad är obligatorisk'],
			unique: true,
		},
		country: {
			type: String,
			trim: true,
			required: [true, 'Land är obligatorisk'],
			default: 'Sverige',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		location: {
			//GeoJSON Point
			type: {
				type: String,
				enum: ['Point'],
			},
			coordinates: {
				type: [Number],
				index: '2dsphere',
			},
			formattedAddress: String,
			streetName: String,
			streetNumber: Number,
			city: String,
			country: String,
			countryCode: String,
			zipcode: String,
		},
		forvaltare: {
			type: mongoose.Schema.ObjectId,
			ref: 'Forvaltare',
			required: true,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Reverse populate with virtuals
ForeningarSchema.virtual('forvaltar', {
	ref: 'Forvaltare',
	localField: '_id',
	foreignField: 'foreningar',
	justOne: false,
});

//Location field through Geocoder
ForeningarSchema.pre('save', async function (next) {
	const loc = await geocoder.geocode(this.address);
	this.location = {
		type: 'Point',
		coordinates: [loc[0].longitude, loc[0].latitude],
		formattedAddress: loc[0].formattedAddress,
		streetName: loc[0].streetName,
		streetNumber: loc[0].streetNumber,
		city: loc[0].city,
		country: loc[0].country,
		countryCode: loc[0].countryCode,
		zipcode: loc[0].zipcode,
	};

	// Don't save address to database
	this.address = undefined;

	next();
});

//Create slug for Förvaltare
ForeningarSchema.pre('save', function (next) {
	this.slug = slugify(this.name, {
		lower: true,
		replacement: '_',
	});
	next();
});

module.exports = mongoose.model(
	'Foreningar',
	ForeningarSchema
);
