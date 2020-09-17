const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load ENV
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

// Route files
const foreningar = require('./routes/foreningar');
const forvaltare = require('./routes/forvaltare');
const auth = require('./routes/auth');
// const tvattstuga = require('./routes/tvattstuga');

//Initialte express
const app = express();

//Body parser
app.use(express.json());

//Middleware logging - using Morgan
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

//File uploader

app.use(fileupload());

// Set static (logotype) folder
app.use(express.static(path.join(__dirname, 'public')));

// USING ROUTES

// Förvaltare
app.use('/api/v1/forvaltare', forvaltare);
// Föreningar
app.use('/api/v1/foreningar', foreningar);
// Registrera användare
app.use('/api/v1/auth', auth);

//Infuse error handling middlewarr
app.use(errorHandler);

//Assign port - conditional on dev or prod
const PORT = process.env.PORT || 5000;

// Initialize server
const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
			.yellow.bold
	)
);

//Rejection handling
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err}`.red);
	//Close server
	server.close(() => process.exit(1));
});
