var UserModel = require('../models/user').UserModel;
var UploadFileModel = require("../models/uploadfile").UploadFileModel;
var AppraiseModel = require("../models/appraise").AppraiseModel;
var BookModel = require("../models/book").BookModel;
var EventProxy = require('eventproxy');
var fs = require('fs');
var User = function() {}
User.prototype.save = function(userin, callback) {
	var user = new UserModel({
		name: userin.name,
		password: userin.password,
		email: userin.email
	});
	user.save(callback);
};
User.prototype.get = function(username, callback) {
	UserModel.findOne({
		"name": username
	}, "", function(err, user) {
		if (err)
			return callback(err);
		callback(err, user);
	});
};
// 设置用户的读书信息
User.prototype.setBooksReadInfo = function(userid, bookid, which, callback) {
	var u_ = {};
	if (which == 'already') {
		u_ = {
			$push: {
				alreadyReads: bookid
			},
			$pull: {
				nowReads: bookid,
				wantReads: bookid
			}
		}
	} else if (which == "want") {
		u_ = {
			$pull: {
				nowReads: bookid,
				alreadyReads: bookid
			},
			$push: {
				wantReads: bookid
			}
		}
	} else if (which == "now") {
		u_ = {
			$pull: {
				alreadyReads: bookid,
				wantReads: bookid
			},
			$push: {
				nowReads: bookid
			}
		}
	}
	UserModel.update({
		_id: userid
	}, u_, {
		safe: true,
		multi: true
	}, function(err, user_) {
		if (err)
			return callback(err);
		if (user_)
			return callback(err, user_);
	});
};
// 获取用户的读书信息
User.prototype.getUserBooks = function(userid, callback) {
	UserModel.findById(userid)
		.select('nowReads nowReads.name alreadyReads alreadyReads.name wantReads wantReads.name bookStar')
		.populate({
			path: 'nowReads',
			select: 'name',
			match: {},
			options: {}
		}).populate({
			path: 'alreadyReads',
			select: 'name',
			match: {},
			options: {}
		}).populate({
			path: 'wantReads',
			select: 'name',
			match: {},
			options: {}
		}).exec(function(err, book) {
			if (err)
				callback(err);
			else
				callback(err, book);
		});
}
// 更新用户的读书信息的评价
User.prototype.setBookStar_insert = function(userid, bookid, content, star, callback) {
	// 定位更新
	UserModel.update({
		_id: userid
	}, {
		$push: {
			bookStar: {
				bookid: bookid,
				star: star,
				markDate: new Date()
			}
		}
	}, {
		safe: true,
		multi: true
	}, function(err, user_) {
		if (err)
			return callback(err);
		if (user_)
			return callback(err, user_);
	});
};
// 更新用户的读书信息的评价
User.prototype.setBookStar_update = function(userid, bookid, content, star, callback) {
	// 定位更新
	UserModel.update({
		_id: userid,
		'bookStar.bookid': bookid
	}, {
		$set: {
			'bookStar.$.star': star,
			'bookStar.$.markDate': new Date()
		}
	}, {
		safe: true,
		multi: true
	}, function(err, user_) {
		if (err)
			return callback(err);
		if (user_)
			return callback(err, user_);
	});
};
// 删除用户关于一本书的收藏信息
User.prototype.deleteUserReads = function(userid, bookid, callback) {
	UserModel.update({
		_id: userid
	}, {
		$pull: {
			nowReads: bookid,
			alreadyReads: bookid,
			wantReads: bookid
		}
	}, {
		safe: true,
		multi: true
	}, function(err, user_) {
		if (err)
			return callback(err);
		if (user_)
			return callback(err, user_);
	});
}
// 设置书籍的标签信息
User.prototype.setUserBookTags = function(userid, bookid, tags, callback) {
	// 拆分标签字符串并重组
	var tags_ = [];
	var arr = tags.split(',');
	for (var i = 0; i < arr.length; i++) {
		tags_.push({
			name: arr[i],
			bookids: [bookid]
		});
	}
	// 更新标签信息
	UserModel.update({
		_id: userid
	}, {
		$pushAll: {
			tags: tags_
		}
	}, {
		safe: true,
		multi: true
	}, function(err, user_) {
		if (err)
			return callback(err);
		if (user_)
			return callback(err, user_);
	});
}
// 获取当前用户的标签信息
User.prototype.getUserBookTags = function(userid, callback) {
	UserModel.findById(userid).select('tags').exec(function(err, user) {
		if (err)
			callback(err);
		else
			callback(err, user);
	});
}
// 删除已经存在的标签与书籍的对应关系
User.prototype.deleteUserBooksTag = function(userid, bookid, tags_, callback) {
	var arr = tags_.split(',');
	UserModel.findById(userid, function(err, user_) {
		if (err)
			return callback(err);
		else {
			var tags = user_.tags;
			for (var i = 0; i < tags.length; i++) {
				for (var k = 0; k < arr.length; k++) {
					if (arr[k] == tags[i].name) {
						for (var j = 0; j < tags[i].bookids.length; j++) {
							if (tags[i].bookids[j] == bookid)
								tags[i].bookids.splice(j, 1);
						}
					}
				}
			}
			UserModel.update({
				_id: userid
			}, {
				tags: tags
			}, {
				safe: true,
				multi: true
			}, function(err_, _user_) {
				if (err_)
					return callback(err_);
				if (_user_)
					return callback(err_, _user_);
			});
		}
	});
}
// 添加作者关于书籍的评论
User.prototype.addBookAppraise = function(userid, bookid, appraiseContent, appraiseTitle, callback) {
	var proxy = EventProxy.create('user_relation_saved', 'book_relation_saved', function() {
		return callback(null, true);
	});
	// 查找评价是否存在
	AppraiseModel.find({
		book: bookid,
		user: userid
	}).exec(function(err___, appraise__) {
		if (err___)
			return proxy.fail(err___);
		if (appraise__) {
			// 存在评价，更新评价标题和内容
			AppraiseModel.update({
				_id: appraise__[0]._id
			}, {
				title: appraiseTitle,
				content: appraiseContent,
				appraiseDate: new Date()
			}, {
				safe: true,
				multi: true
			}, function(__err__, __appraise__) {
				if (__err__)
					return proxy.fail(__err__);
				if (__appraise__)
					return callback(__err__, __appraise__);
			});
		} else {
			// 建立评价对象
			var appraise = new AppraiseModel({
				title: appraiseTitle,
				content: appraiseContent,
				user: userid,
				book: bookid
			});
			// 保存评价
			appraise.save(function(err, appraise_) {
				if (err)
					return proxy.fail(callback);
				if (appraise_) {
					// 更新用户关联关系
					UserModel.findById(userid).select('appraises').exec(function(err__, user_) {
						if (err__)
							return proxy.fail(callback);
						if (user_) {
							var appraisesIds = user_.appraises;
							var flag = false;
							for (var i = 0; i < appraisesIds; i++) {
								if (appraisesIds[i] == appraise_._id) {
									// 触发关联关系保存成功
									proxy.emit('user_relation_saved');
									flag = true;
									break;
								}
							}
							if (flag == false) {
								UserModel.update({
									_id: userid
								}, {
									$push: {
										appraises: appraise_._id
									}
								}, {
									safe: true,
									multi: true
								}, function(err_, _user_) {
									if (err_)
										return proxy.fail(callback);
									if (_user_)
									// 触发关联关系保存成功
										proxy.emit('user_relation_saved');
								});
							}
						}
					});
					BookModel.findById(bookid).select('appraises').exec(function(err__, user_) {
						if (err__)
							return proxy.fail(callback);
						if (user_) {
							var appraisesIds = user_.appraises;
							var flag = false;
							for (var i = 0; i < appraisesIds; i++) {
								if (appraisesIds[i] == appraise_._id) {
									// 触发关联关系保存成功
									proxy.emit('book_relation_saved');
									flag = true;
									break;
								}
							}
							if (flag == false) {
								// 保存图书关联关系
								BookModel.update({
									_id: bookid
								}, {
									$push: {
										appraises: appraise_._id
									}
								}, {
									safe: true,
									multi: true
								}, function(err_, _user_) {
									if (err_)
										return proxy.fail(callback);
									if (_user_)
									// 触发关联关系保存成功
										proxy.emit('book_relation_saved');
								});
							}
						}
					});
				}
			});
		}
	});
}
// 更新用户的详细信息
User.prototype.update = function(userid, userin, callback) {
	UserModel.update({
		_id: userid
	}, userin, {
		safe: true,
		multi: true
	}, function(err_, _user_) {
		if (err_)
			return callback(err_);
		if (_user_) {
			UserModel.findById(userid, function(err, user) {
				if (err)
					return callback(err);
				return callback(err, user);
			});
		}
	})
};
// 上传头像
User.prototype.uploadUserAvatars = function(userid, file, callback) {
	var image = new UploadFileModel({
		name: file.filename,
		useType: 'useravatar',
		isCurrentUsed: true,
		uploadDate: new Date(),
		filename: file.filename,
		filetype: file.filetype,
		filesize: file.filesize,
		type: file.filename.substring(file.filename.lastIndexOf('.') + 1),
		url: file.filepath,
		user: [userid]
	});
	var saveImg = function() {
		image.save(function(e, img) {
			if (e)
				return callback(e);
			else
				UserModel.update({
					_id: userid
				}, {
					$set: {
						avatars: [img.id]
					}
				}, {
					safe: true,
					multi: true
				}, function(err, user_) {
					if (err)
						return callback(err);
					if (user_)
						return callback(err, img.id);
				});
		});
	};
	UploadFileModel.find({
		user: [userid]
	}).exec(function(err_, imgs) {
		for (var i = 0; i < imgs.length; i++) {
			var url = imgs[i].url;
			var filename = imgs[i].filename;
			imgs[i].remove(function(e_, img) {
				if (e_)
					return callback(e_);
				try {
					fs.unlinkSync('public/' + url + filename, function(_err_) {
						if (_err_) return callback(_err_);
					});
				} catch (s) {}
			});
		}
		saveImg();
	});
}
// 设置用户头像的裁剪
User.prototype.setUserAvatarCut = function(imgid, originalImg, callback) {
	UploadFileModel.update({
		_id: imgid
	}, {
		$set: {
			cut: originalImg,
			isCut: true
		}
	}, {
		safe: true,
		multi: true
	}, function(err, img_) {
		if (err)
			return callback(err);
		if (img_)
			return callback(err, img_);
	});
}
// 获取用户的头像信息
User.prototype.getUserAvatar = function(userid, callback) {
	UserModel.findById(userid)
		.select('avatars avatars.url avatars.filename avatars.isCut avatars.cut')
		.populate({
			path: 'avatars',
			select: 'url filename isCut cut',
			match: {},
			options: {}
		}).exec(function(err, user_) {
			if (err)
				return callback(err);
			else
				return callback(err, user_);
		});
}
module.exports = new User();