var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var PublicCompanySchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	ename: String,
	address: {
		country: String,
		province: String,
		city: String,
		detail: String
	},
	memo: String,
	website: String,
	phone: String,
	email: String,
	// 备注
	memo: String,
	// 简介
	introduction: String,
	postcode: String,
	// 联系人
	linkman: [{
			name: String,
			phone: String,
			sex: Number
		}
	],
	telephone: String,
	// 添加到数据库的日期
	createDate: {
		type: Date,
		default: new Date
	},
	// 出版社成立日期
	foundDate: {
		type: Date,
		default: null
	}
});
var PublicCompanyModel = db.model('publiccompany', PublicCompanySchema, 'publiccompanys');
module.exports.PublicCompanySchema = PublicCompanySchema;
module.exports.PublicCompanyModel = PublicCompanyModel;