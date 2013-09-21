var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var AuthorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	pinyin: {
		stype: String,
		default: ''
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
	createDate: {
		type: Date,
		default: new Date()
	},
	books: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	}],
	introduction: String
});
var AuthorModel = db.model("author", AuthorSchema, "authors");
module.exports.AuthorModel = AuthorModel;
module.exports.AuthorSchema = AuthorSchema;