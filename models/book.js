var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var BookSectionSchema = require('./bookSection').BookSectionSchema;
// 书籍定义
var BookSchema = mongoose.Schema({
	name: String,
	ename: String,
	price: String,
	discount: {
		type: String,
		default: '10'
	},
	secDiscount: {
		type: String,
		default: '10'
	},
	bookVersion: {
		type: Number,
		default: 1
	},
	isStore: Boolean,
	publicDate: Date,
	forwardSaleDate: Date,
	appriaseState: Number,
	// 是否推荐
	isRecommanded: {
		type: Boolean,
		default: false
	},
	// 编辑推荐指数
	recommandedExponent: {
		type: Number,
		default: 0
	},
	// 编辑推荐日期
	recommandedDate: {
		type: Date,
		default: null
	},
	storeNumber: Number,
	ISBN: String,
	pageNumber: Number,
	// 装帧 0:平装 ，  1：精装 ， 2 ： 套装
	banding: Number,
	memo: String,
	createDate: {
		type: Date,
		default: new Date()
	},
	keyword: String,
	authors: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'author'
	}],
	translators: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'translator'
	}],
	publicCompany: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'publiccompany'
	}],
	bookCategray: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'bookcategray'
	}],
	promotion: Boolean,
	promotionDepart: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'promotiondepart'
	}],
	images: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'uploadfile'
	}],
	// 评论数量
	commentNumber: {
		type: Number,
		default: 0
	},
	// 是否是新书速递
	isNewBook: {
		type: Boolean,
		default: false
	},
	// 新书速递日期
	expressDate: {
		type: Date,
		default: null
	},
	// 精品好书
	isQuality: {
		type: Boolean,
		default: false
	},
	//月度精品好书
	isMonthQuality: {
		type: Boolean,
		default: false
	},
	// 那个年份/月份的精品好书 
	monthQualityDate: {
		type: String,
		default: ""
	},
	// 年度精品好书
	isYearQuality: {
		type: Boolean,
		default: false
	},
	// 那个年度的精品好书
	yearQuality: {
		type: String,
		default: ""
	},
	// 热门图书 , 按季度划分
	isHot: {
		type: Boolean,
		default: false
	},
	// 热门图书时间段
	hotDate: {
		type: Date,
		default: null
	},
	star: {
		one: {
			type: Number,
			default: 0
		},
		two: {
			type: Number,
			default: 0
		},
		three: {
			type: Number,
			default: 0
		},
		four: {
			type: Number,
			default: 0
		},
		five: {
			type: Number,
			default: 0
		}
	},
	// 参与与评价的用户
	appraisePersons: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	}],
	// 书籍章节信息
	bookSections: [{
		order: {
			type: Number,
			required: true
		},
		section: [BookSectionSchema]
	}], // 书籍评价
	appraises: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'appraise'
	}]
});
var BookModel = db.model("book", BookSchema, "books");
module.exports.BookModel = BookModel;
module.exports.BookSchema = BookSchema;