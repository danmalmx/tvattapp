const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Route files
// const anvandare = require('./routes/anvandare');
// const fastighet = require('./routes/fastighet');
const forvaltare = require('./routes/forvaltare');
// const tvattstuga = require('./routes/tvattstuga');

//Load ENV
dotenv.config({ path: './config/config.env' });

//Initialte express
const app = express();

//Middleware logging - using Morgan
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//Mounting routes
app.use('/api/v1/forvaltare', forvaltare);

//Assign port - conditional on dev or prod
const PORT = process.env.PORT || 5000;

// Initialize server
app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
);
