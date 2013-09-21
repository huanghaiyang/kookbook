var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
// 书籍章节定义
var BookSectionSchema = mongoose.Schema({
	// 章节名称
	name: {
		type: String,
		default: '',
		required: true
	},
	secName: String,
	// 章节内容
	content: {
		type: String,
		default: ''
	},
	// 章节节选或者章节的目录
	instruction: {
		type: String,
		required: true,
		default: '...'
	}
});
var BookSectionModel = db.model("booksection", BookSectionSchema, "booksections");
module.exports.BookSectionModel = BookSectionModel;
module.exports.BookSectionSchema = BookSectionSchema;