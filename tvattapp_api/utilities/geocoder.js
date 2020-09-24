const nodeGeocoder = require('node-geocoder');

const mapOptions = {
	provider: process.env.GECODER_PROVIDER,
	httpAdapter: 'https',
	apiKey: process.env.GEOCODER_API_KEY,
	formatter: null,
};

const geocoder = nodeGeocoder(mapOptions);

module.exports = geocoder;
