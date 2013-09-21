var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;

function inspector(val, schematype) {
	if (schematype.options.required) {
		return schematype.path + ' is required';
	} else {
		return val;
	}
}

function dob(val) {
	if (!val) return val;
	return val.getFullYear() + "/" + (val.getMonth() + 1) + "/" + val.getDate() + " " + val.getHours() + ":" + val.getMinutes() + ":" + val.getSeconds();
}

var CommentSchame = mongoose.Schame({
	createDate: {
		type: Date,
		default: new Date(),
		get: dob
	},
	useful: {
		type: Number,
		default: 0
	},
	unuseful: {
		type: Number,
		default: 0
	},
	book: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'book'
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	reComment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'comment'
	},
	tile: {
		type: String,
		required: true,
		set: inspector
	},
	content: {
		type: String,
		required: true,
		set: inspector
	},
	// 评论是否已关闭
	canBeClosed: {
		type: Boolean,
		default: false
	},
	// 评论是否已屏蔽
	canBeRefused: {
		type: Boolean,
		default: false
	},
	// 是否可以被回复
	canBeRecomment: {
		type: Boolean,
		default: true
	}
});
CommentSchame.pre('save', function(next) {
	if (!this.title)
		console.log("name must be required");
	if (!this.content)
		console.log("name must be required");
	next();
})

var CommentModel = db.model("comment", CommentSchame, "comments");
module.exports.CommentModel = CommentModel;
module.exports.CommentSchame = CommentSchame;