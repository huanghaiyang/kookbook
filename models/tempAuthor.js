var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var TempAuthorSchame = mongoose.Schema({
	chinesename: {
		type: String,
		required: true
	},
	englishname: {
		type: String,
		required: false,
		default: ''
	},
	address: {
		country: {
			type: String,
			default: ''
		},
		province: {
			type: String,
			default: ''
		},
		city: {
			type: String,
			default: ''
		}
	},
	pencilnames: [{
		type: String,
		default: ''
	}],
	sex: {
		type: Number,
		enum: [1, 0]
	},
	createDate: {
		type: Date,
		default: new Date()
	},
	lastUpdateDate: {
		type: Date,
		default: new Date()
	},
	introduction: {
		type: String,
		default: ''
	},
	race: {
		type: String,
		default: ''
	},
	address_birth: {
		type: String,
		default: ''
	},
	birthday: {
		type: Date,
		default: null
	},
	job: {
		type: String,
		default: ''
	},
	graduateSchool: {
		type: String,
		default: ''
	},
	// 荣誉奖项
	worth: [{
		type: String,
		default: ''
	}],
	// 编辑用户
	editUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	// 合作编辑用户
	cooperateUsers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	// 管理员
	editAdmins: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'admin'
	}],
	// 审核状态
	submitStatus: {
		type: Number,
		enum: [2, 1, 0]
	},
	// 公开状态 , 0表示未公开
	publicStatus: {
		type: Number,
		enum: [1, 0]
	}
});
var TempAuthorModel = db.model("tempauthor", TempAuthorSchame, "tempauthors");
module.exports.TempAuthorModel = TempAuthorModel;
module.exports.TempAuthorSchame = TempAuthorSchame;