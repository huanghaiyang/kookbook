var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var BookCategraySchema = mongoose.Schema({
	name: String,
	parentCategray: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'bookcategray'
		}
	],
	memo: String,
	ename: String,
	createDate: {
		type: Date,
		default: new Date()
	},
	// 分类等级
	upstage: Number
});
var BookCategrayModel = db.model("bookcategray", BookCategraySchema, "bookcategrays");
module.exports.BookCategraySchema = BookCategraySchema;
module.exports.BookCategrayModel = BookCategrayModel;