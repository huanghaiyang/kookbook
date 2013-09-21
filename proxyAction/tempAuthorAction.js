var TempAuthorModel = require('../models/tempAuthor').TempAuthorModel;

var TempAuthorAction = function() {}
TempAuthorAction.prototype.addOrUpdateTempAuthorByUser = function(req, res) {
	var tempAuthor = new TempAuthorModel({
		chinesename: req.body.chinesename,
		englishname: req.body.englishname,
		address: {
			country: req.body.country,
			province: req.body.province,
			city: req.body.city
		},
		sex: req.body.sex ? Number(req.body.sex) : -1,
		pencilnames: req.body.pencilnames,
		address_birth: req.body.address_birth,
		race: req.body.race,
		birthday: req.body.birthday,
		job: req.body.graduateSchool,
		graduateSchool: req.body.graduateSchool,
		lastUpdateDate: new Date(),
		worth: req.body.worth,
		submitStatus: req.body.submitStatus ? req.body.submitStatus : 0,
		publicStatus: req.body.publicStatus ? req.body.publicStatus : 0
	});
	var user = req.session.user;
	if (user && user._id) {
		tempAuthor.editUser = user._id;
	}
	tempAuthor.save(function(err, tempAuthor_) {
		if (err)
			res.send({
				success: false
			});
		else
			res.send({
				success: true,
				tempAuthorId: tempAuthor_._id
			});
	});
}
module.exports.TempAuthorAction = new TempAuthorAction();