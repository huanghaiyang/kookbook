var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var PromotionDepartSchema = mongoose.Schema({
	name: String,
	ename: String,
	memo: String,
	beginDate: Date,
	endDate: Date
});
var PromotionDepartModel = db.model("promotiondepart", PromotionDepartSchema, 'promotiondeparts');
module.exports.PromotionDepartSchema = PromotionDepartSchema;
module.exports.PromotionDepartModel = PromotionDepartModel;