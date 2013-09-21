var PromotionDepartModel = require('../models/promotionDepart').PromotionDepartModel ; 
var Promotion = function(){}
Promotion.prototype.save = function(promotionin , callback){
	var promotion = new PromotionDepartModel({
		name : promotionin.name , 
		ename : promotionin.ename ,
		memo : promotionin.memo ,
		beginDate : promotionin.beginDate ,
		endDate : promotionin.endDate
	}) ; 
	promotion.save(callback) ;
};
module.exports.PromotionDao = new Promotion() ; 