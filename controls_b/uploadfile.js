var UploadFileModel = require("../models/uploadfile").UploadFileModel;
var BookModel = require("../models/book").BookModel;
var fs = require('fs');
var UploadFile = function() {}
UploadFile.prototype.listUploadImgsAllByJson_bk = function(skip, limit, queryCondition, callback) {
	var t_count = 0;
	UploadFileModel.count({}, function(error, count) {
		if (error)
			return callback(error);
		else
			t_count = count;
		if (t_count == 0)
			return callback(error, t_count, null);
		var likeQuery = {};
		var equalQuery = {};
		if (queryCondition) {
			for (var p in queryCondition) {
				if (queryCondition.hasOwnProperty(p)) {
					var key = p.split("_")[0];
					var condition = p.split("_")[1];
					var value = queryCondition[p];
					if (condition == "equal") {
						if (value)
							equalQuery[key] = value;
					} else if (condition.toLowerCase() == "like") {
						if (value)
							likeQuery[key] = new RegExp(value, 'ig');
					}
				}
			}
		}
		var query = UploadFileModel.find(likeQuery);
		if (equalQuery) {
			for (var p in equalQuery) {
				if (equalQuery.hasOwnProperty(p)) {
					query = query.where(p).equals(equalQuery[p]);
				}
			}
		}
		query.skip(skip).limit(limit).sort("uploadDate").select("name url filename filetype isCurrentUsed useType");
		query.exec(function(err, imgs) {
			if (err)
				return callback(err);
			else
				return callback(err, t_count, imgs);
		});
	});
}
// 删除一本书籍的图片
UploadFile.prototype.deleteOneBookImg = function(id, callback) {
	UploadFileModel
		.findById(id)
		.populate({
		path: 'book'
	}).exec(function(err, img) {
		if (err) return callback(err);
		else {
			// 一张图片只能从属一本书籍
			var bookid = img.book[0];
			BookModel.update({
				_id: bookid
			}, {
				$pull: {
					images: id
				}
			}, {
				safe: true,
				multi: true
			}, function(err_, book_) {
				if (err_)
					return callback(err_);
				if (book_) {
					UploadFileModel.findByIdAndRemove(id, function(_err_, img_) {
						if (_err_)
							return callback(_err_);
						else {
							return callback(_err_, img_) ;
						}
					});
				}
			});
		}
	});
}
// 获取图片详细信息
UploadFile.prototype.getOneBookImgInfo = function(id, callback) {
	UploadFileModel
		.findById(id)
		.populate({
		path: 'book',
		select: 'name',
		options: {
			sort: {
				cteateeDate: -1
			}
		}
	}).sort({
		uploadDate: -1
	}).exec(function(err, book) {
		if (err) return callback(err);
		callback(err, book);
	});
}
module.exports.UploadFileDao = new UploadFile();