var PublicCompanyModel = require("../models/publicCompany").PublicCompanyModel;
var PublicCompany = function() {}
// 保存出版社信息
PublicCompany.prototype.publicCompanyAdd = function(publicCompanyin, callback) {
	var publicCompany = new PublicCompanyModel({
		name: publicCompanyin.name,
		address: {
			country: publicCompanyin.address.country,
			province: publicCompanyin.address.province,
			city: publicCompanyin.address.city,
			detail: publicCompanyin.address.detail
		},
		memo: publicCompanyin.memo,
		website: publicCompanyin.website,
		phone: publicCompanyin.phone,
		email: publicCompanyin.email,
		postcode: publicCompanyin.postcode,
		introduction: publicCompanyin.introduction,
		telephone: publicCompanyin.telephone,
		ename: publicCompanyin.ename
	});
	publicCompany.save(function(err, publicCompany_) {
		if (err)
			callback(err);
		else
			callback(err, publicCompany_);
	});
}

// 出版社信息列表
PublicCompany.prototype.listPublicCompanysAllByJson_bk = function(skip, limit, queryCondition, callback) {
	var t_count = 0;
	PublicCompanyModel.count({}, function(error, count) {
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
		var query = PublicCompanyModel.find(likeQuery);
		if (equalQuery) {
			for (var p in equalQuery) {
				if (equalQuery.hasOwnProperty(p)) {
					query = query.where(p).equals(equalQuery[p]);
				}
			}
		}
		query.skip(skip).limit(limit).sort({
			"createDate": -1
		}).select("name website email telephone phone ename");
		query.exec(function(err, publicCompanys) {
			if (err)
				return callback(err);
			else
				return callback(err, t_count, publicCompanys);
		});
	});
}
// 删除一个出版社信息
PublicCompany.prototype.deleteOnePublicCompany = function(id, callback) {
	PublicCompanyModel.findByIdAndRemove(id, function(err, publicCompany) {
		if (err)
			return callback(err);
		return callback(err, publicCompany);
	});
}
// 获取简单的出版社信息
PublicCompany.prototype.getPublicCompanySimple = function(callback) {
	var query = PublicCompanyModel.find({}, "name");
	var promise = query.exec();
	promise.addBack(function(err, publicCompanys) {
		if (err)
			return callback(err);
		else
			return callback(err, publicCompanys);
	});
}
module.exports.PublicCompanyDao = new PublicCompany();