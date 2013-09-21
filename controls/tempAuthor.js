var TempAuthorModel = require('../models/tempAuthor').TempAuthorModel;
var TempAuthor = function() {}
TempAuthor.prototype.addOrUpdateTempAuthorByUser = function(tempAuthorIn, callback) {
	var tempAuthor = new TempAuthorModel({
		chinesename: tempAuthorIn.chinesename,
		englishname: tempAuthorIn.englishname,
		address: {
			country: tempAuthorIn.address.country,
			province: tempAuthorIn.address.province,
			city: tempAuthorIn.address.city
		},
		sex: tempAuthorIn.sex ? Number(tempAuthorIn.sex) : -1,
		pencilnames: tempAuthorIn.pencilnames,
		address_birth: tempAuthorIn.address_birth,
		race: tempAuthorIn.race,
		birthday: tempAuthorIn.birthday,
		job: tempAuthorIn.job,
		graduateSchool: tempAuthorIn.graduateSchool,
		lastUpdateDate: new Date(),
		worth: tempAuthorIn.worth,
		submitStatus: tempAuthorIn.submitStatus ? tempAuthorIn.submitStatus : 0,
		publicStatus: tempAuthorIn.publicStatus ? tempAuthorIn.publicStatus : 0,
		editUser: tempAuthorIn.editUser,
		introduction: tempAuthorIn.introduction
	});
	tempAuthor.save(function(err, tempAuthor_) {
		return callback(err, tempAuthor_);
	});
};
TempAuthor.prototype.getUserEditTempAuthors = function(userid, callback) {
	TempAuthorModel.find({
		editUser: userid
	}).select('publicStatus submitStatus').exec(function(err, tempAuthors_) {
		return callback(err, tempAuthors_);
	});
}
TempAuthor.prototype.getUserEditTempAuthorsComplete = function(userid, callback) {
	TempAuthorModel.find({
		editUser: userid
	}).select('publicStatus submitStatus chinesename englishname pencilnames createDate lastUpdateDate')
		.sort({
			'createDate': 'asc',
			'lastUpdateDate': 'asc'
		}).exec(function(err, tempAuthors_) {
			return callback(err, tempAuthors_);
		});
}
TempAuthor.prototype.cooperateAuthorEdit = function(tempAuthorId, callback) {
	TempAuthorModel.findById(tempAuthorId).exec(function(err, tempAuthor_) {
		return callback(err, tempAuthor_);
	});
};
TempAuthor.prototype.cooperateAuthorIntroduction = function(tempAuthorId, callback) {
	TempAuthorModel.findById(tempAuthorId).select('introduction chinesename').exec(function(err, tempAuthor_) {
		return callback(err, tempAuthor_);
	});
}
module.exports.TempAuthorDao = new TempAuthor();