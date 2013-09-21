var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	sex: {
		type: Number,
		enum: [1, 0]
	},
	website: String,
	// http头像地址
	httpAvatar: String,
	// 上传头像
	avatars: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'uploadfile'
	}],
	// 签名
	signature: String,
	// 个人简介
	instruction: {
		type: String,
		default: ''
	},
	sina: {
		type: String,
		default: ''
	},
	tencent: {
		type: String,
		default: ''
	},
	// 住址
	address: {
		country: {
			type: String
		},
		city: {
			type: String
		}
	},
	// 在读
	nowReads: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	}],
	// 已读
	alreadyReads: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	}],
	// 想读
	wantReads: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	}],
	// 评价过的书籍关系字典
	bookStar: [{
		bookid: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'book'
		},
		star: {
			type: Number,
			default: 0
		}
	}],
	// 书籍标签
	tags: [{
		name: String,
		memo: String,
		bookids: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'book'
		}]
	}],
	// 书籍评价
	appraises: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'appraise'
	}]
});
var UserModel = db.model("user", UserSchema, 'users');
module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;