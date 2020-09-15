const errorHandler = (err, req, res, next) => {
	//Developer console log
	console.log(err.stack.red);

	res.status(err.statusCode || 500).json({
		success: false,
		error: err.message || 'Fel på servern',
	});
};

module.exports = errorHandler;
