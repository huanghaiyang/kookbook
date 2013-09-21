var BookCategrayModel = require("../models/bookCategray").BookCategrayModel;
var BookCategray = function() {}

// 获取书籍分类信息（顶级分类）
BookCategray.prototype.getAllUpSateCategrays = function(callback) {
	var query = BookCategrayModel.find({});
	query.where("upstage").equals(0);
	query.sort("createDate").select("name ename");
	query.exec(function(err, categraies) {
		if (err)
			return callback(err);
		else
			return callback(err, categraies);
	});
}
module.exports.BookCategrayDao = new BookCategray();