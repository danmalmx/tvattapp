const express = require('express');
const router = express.Router();

//ROUTES FÖR FÖRVALTARE
router.get('/', (req, res) => {
    res.status(200).json({success: true, msg: 'Visa alla fastighetsförvaltare'});
});

router.get('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Visa fastighetsförvaltare ${req.params.id}`});
});

router.post('/', (req, res) => {
    res.status(200).json({success: true, msg: 'Läg till en ny fastighetsförvaltare'});
});

router.put('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Uppdatera fastighetsförvaltare ${req.params.id}`});
});

router.delete('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Ta bort fastighetsförvaltare ${req.params.id}`});
});

module.exports = router;