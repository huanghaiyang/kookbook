var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
// 书籍评价回复（文字内容）
var ReplySchame = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	replyDate: {
		type: Date,
		default: new Date()
	},
	// 评论
	appraise: {
		type: ObjectId,
		ref: 'book'
	},
	// 用户
	user: {
		type: ObjectId,
		ref: 'user'
	}，
	// 对于书籍评论的回复信息
	replys: [{
		type: ObjectId,
		ref: 'reply'
	}],
	// 有用
	good: {
		type: Number,
		default: 0
	},
	// 没用
	notGood: {
		type: Number,
		default: 0
	}
});

var ReplyModel = db.model("reply", ReplySchame, "replys");
module.exports.ReplyModel = ReplyModel;
module.exports.ReplySchame = ReplySchame;