var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;

function toLower(v) {
	return v.toLowerCase();
}
var UploadFileSchema = mongoose.Schema({
	url: String,
	// 使用场景
	useType: {
		type: String
	},
	name: String,
	memo: String,
	uploadDate: {
		type: Date,
		default: new Date()
	},
	// 是否正在被使用中
	isCurrentUsed: {
		type: Boolean,
		default: false
	},
	// 文件类型==扩展名
	type: {
		type: String,
		set: toLower
	},
	filename: String,
	// mime类型
	filetype: String,
	filesize: String,
	// 是否可以删除
	canRemove: {
		type: Boolean,
		default: true
	},
	// 是否可以移动
	canChangeFolder: {
		type: Boolean,
		default: true
	},
	// 是否可以重命名
	canRename: {
		type: Boolean,
		default: true
	},
	// 随机码
	randomNumber: {
		type: String,
		default: Math.random() + ''
	},
	book: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	}],
	user: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	// 是否裁剪
	isCut: {
		type: Boolean,
		default: false
	},
	// 头像裁剪
	cut: {
		height: {
			type: Number,
			default: 0
		},
		width: {
			type: Number,
			default: 0
		},
		top: {
			type: Number,
			default: 0
		},
		left: {
			type: Number,
			default: 0
		},
		oWidth: {
			type: Number,
			default: 0
		},
		oHeight: {
			type: Number,
			default: 0
		}
	}
});
var UploadFileModel = db.model("uploadfile", UploadFileSchema, "uploadfiles");
module.exports.UploadFileSchema = UploadFileSchema;
module.exports.UploadFileModel = UploadFileModel;