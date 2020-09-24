const mongoose = require('mongoose');

const connectDB = async () => {
	const conct = await mongoose.connect(
		process.env.MONGO_DB,
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		}
	);
	console.log(
		`Mongo DB connected: ${conct.connection.host}`.cyan
			.underline.bold
	);
};

module.exports = connectDB;
