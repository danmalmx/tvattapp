const express = require('express');
const dotenv = require('dotenv');

// Route files 
const anvandare = require('./routes/anvandare');
const forvaltare = require('./routes/forvaltare');
const fastighet = require('./routes/fastighet');
const tvattstuga = require('./routes/tvattstuga');

//Load ENV
dotenv.config({path: './config/config.env'});

//Initialte express
const app = express();

//Mounting routes
app.use('/api/v1/forvaltare', forvaltare)

//Assign port - conditional on dev or prod
const PORT = process.env.PORT || 5000;

// Initialize server
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));