var AuthorModel = require('../models/author').AuthorModel;
var Author = function() {}
Author.prototype.save = function(authorin, callback) {
	var author = new AuthorModel({
		name: authorin.name,
		address: {
			country: authorin.address.country,
			province: authorin.address.province,
			city: authorin.address.city
		},
		memo: authorin.memo,
		website: authorin.website,
		secName: authorin.secName,
		email: authorin.email,
		sex: authorin.sex,
		createDate: new Date(),
		introduction: authorin.introduction
	});
	author.save(callback);
}
Author.prototype.get = function(name, callback) {
	AuthorModel.findOne({
		"name": name
	}, "", function(err, author) {
		if (err)
			return callback(err);
		if (!author) {
			return callback(author);
		}
		return callback(err, author);
	});
}
Author.prototype.listAuthorAllByJson_bk = function(skip, limit, queryCondition, callback) {
	var t_count = 0;
	AuthorModel.count({}, function(error, count) {
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
		var query = AuthorModel.find(likeQuery);
		if (equalQuery) {
			for (var p in equalQuery) {
				if (equalQuery.hasOwnProperty(p)) {
					query = query.where(p).equals(equalQuery[p]);
				}
			}
		}
		query.skip(skip).limit(limit).sort("createDate").select("name secName email website sex _id");
		query.exec(function(err, authors) {
			if (err)
				return callback(err);
			else
				return callback(err, t_count, authors);
		});
	});
}
Author.prototype.getOneAuthorInfo = function(id, callback) {
	AuthorModel.findById(id, function(err, author) {
		if (err)
			return callback(err);
		return callback(err, author);
	});
}
// 根据id删除一个作者信息并返回
Author.prototype.deleteOneAuthor = function(id, callback) {
	AuthorModel.findByIdAndRemove(id, function(err, author) {
		if (err)
			return callback(err);
		return callback(err, author);
	});
}
// 根据id更新一个作者的信息
Author.prototype.updateOneAuthorInfo = function(id, authorin, callback) {
	AuthorModel.findByIdAndUpdate(id, authorin, {
		new: true,
		upsert: false
	}, function(err, author) {
		if (err)
			return callback(err);
		return callback(err, author);
	});
}
// 用于下拉选择作者
Author.prototype.getAuthorsSimple = function(callback) {
	var query = AuthorModel.find({}, "name");
	var promise = query.exec();
	promise.addBack(function(err, authors) {
		if (err)
			return callback(err);
		else
			return callback(err, authors);
	});
}
module.exports.AuthorDao = new Author();