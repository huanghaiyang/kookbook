var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var TranslatorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	address: {
		country: String,
		province: String,
		city: String
	},
	memo: String,
	website: String,
	secName: String,
	email: String,
	sex: {
		type: Number,
		enum: [1, 0]
	},
	createDate: Date,
	books: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'book'
		}
	]
});
var TranslatorModel = db.model("translator", TranslatorSchema, 'translators');
module.exports.TranslatorModel = TranslatorModel;
module.exports.TranslatorSchema = TranslatorSchema;