var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
// 书籍评价（文字内容）
var AppraiseSchame = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	appraiseDate: {
		type: Date,
		default: new Date()
	},
	// 书籍
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	},
	// 用户
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	// 对于书籍评论的回复信息
	replys: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'reply'
	}]
});

var AppraiseModel = db.model("appraise", AppraiseSchame, "appraises");
module.exports.AppraiseModel = AppraiseModel;
module.exports.AppraiseSchema = AppraiseSchame;