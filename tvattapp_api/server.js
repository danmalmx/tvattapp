const express = require('express');
const dotenv = require('dotenv');

//Load ENV

dotenv.config({path: './config/config.env'});

const app = express();

//ROUTES
app.get('/api/v1/forvaltare', (req, res) => {
    res.status(200).json({success: true, msg: 'Visa alla fastighetsförvaltare'});
});

app.get('/api/v1/forvaltare/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Visa fastighetsförvaltare ${req.params.id}`});
});

app.post('/api/v1/forvaltare', (req, res) => {
    res.status(200).json({success: true, msg: 'Läg till en ny fastighetsförvaltare'});
});

app.put('/api/v1/forvaltare/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Uppdatera fastighetsförvaltare ${req.params.id}`});
});

app.delete('/api/v1/forvaltare/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Ta bort fastighetsförvaltare ${req.params.id}`});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));