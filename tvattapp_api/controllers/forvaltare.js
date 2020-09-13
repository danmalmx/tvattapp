// BESKRIVNING:     Hämtar all fastighetsförvaltare 
// ROUTE:           GET /api/v1/forvaltare
// TILLGÅNG:        Obegränsad

exports.getForvaltare = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Visa alla fastighetsförvaltare'});
};

// BESKRIVNING:     Hämtar en fastighetsförvaltare 
// ROUTE:           GET /api/v1/forvaltare/:id
// TILLGÅNG:        `Visa fastighetsförvaltare ${req.params.id}`

exports.getEnForvaltare = (req, res, next) => {
    res.status(200).json({success: true, msg: `Visa fastighetsförvaltare ${req.params.id}`});
};

// BESKRIVNING:     Skapa ny fastighetsförvaltare 
// ROUTE:           POST /api/v1/forvaltare
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.createForvaltare = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Skapa en ny fastighetsförvaltare'});
};
// BESKRIVNING:     Uppdatera en fastighetsförvaltare 
// ROUTE:           PUT /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.updateForvaltare = (req, res, next) => {
    res.status(200).json({success: true, msg: `Uppdatera fastighetsförvaltare ${req.params.id}`});
};

// BESKRIVNING:     Tar bort en fastighetsförvaltare 
// ROUTE:           DELETE /api/v1/forvaltare/:id
// TILLGÅNG:        Begränsad (måste vara inloggad SYSTEM_ADMIN)

exports.deleteForvaltare = (req, res, next) => {
    res.status(200).json({success: true, msg: `Ta bort fastighetsförvaltare ${req.params.id}`});
};