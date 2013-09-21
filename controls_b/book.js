var BookModel = require("../models/book").BookModel;
var UploadFileModel = require("../models/uploadfile").UploadFileModel;
var Book = function() {}
Book.prototype.save = function(bookin, callback) {
	var book = new BookModel({
		name: bookin.name,
		ename: bookin.ename,
		memo: bookin.memo,
		createDate: new Date(),
		publicDate: bookin.publicDate,
		forwardSaleDate: bookin.forwardSaleDate,
		discount: bookin.discount ? bookin.discount : '10',
		secDiscount: bookin.secDiscount ? bookin.secDiscount : '10',
		price: bookin.price,
		bookVersion: bookin.bookVersion ? bookin.bookVersion : '1',
		isStore: bookin.isStore ? bookin.isStore : true,
		storeNumber: bookin.storeNumber,
		ISBN: bookin.ISBN,
		pageNumber: bookin.pageNumber,
		promotion: bookin.promotion ? promotion.promotion : false,
		keyword: bookin.keyword,
		// 装帧
		banding: bookin.banding
	});
	// 保存书籍分类关联信息
	if (bookin.bookCategray.id) {
		book.bookCategray = [bookin.bookCategray.id];
	}
	// 保存作者关联信息
	if (bookin.authors.ids) {
		book.authors = bookin.authors.ids;
	}
	// 保存出版社关联信息
	if (bookin.publicCompanys.ids) {
		book.publicCompany = bookin.publicCompanys.ids;
	}
	book.save(callback);
};

Book.prototype.listBooksAllByJson_bk = function(skip, limit, queryCondition, callback) {
	var t_count = 0;
	BookModel.count({}, function(error, count) {
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
		var query = BookModel.find(likeQuery);
		if (equalQuery) {
			for (var p in equalQuery) {
				if (equalQuery.hasOwnProperty(p)) {
					query = query.where(p).equals(equalQuery[p]);
				}
			}
		}
		query.skip(skip).limit(limit).sort({
			"createDate": -1
		}).select("name ename price bookVersion isStore storeNumber ISBN isNewBook isRecommanded isHot");
		query.exec(function(err, books) {
			if (err)
				return callback(err);
			else
				return callback(err, t_count, books);
		});
	});
}
// 删除一个图书
Book.prototype.deleteOneBook = function(id, callback) {
	BookModel.findByIdAndRemove(id, function(err, book) {
		if (err)
			return callback(err);
		return callback(err, book);
	});
}
// 获取一个书籍信息
Book.prototype.getOneBookInfo = function(id, callback) {
	BookModel
		.findById(id)
		.populate({
			path: 'bookCategray',
			select: 'name'
		}).populate({
			path: 'authors',
			select: 'name'
		}).populate({
			path: 'publicCompany',
			select: 'name'
		}).exec(function(err, book) {
			if (err) return callback(err);
			callback(err, book);
		});
};
Book.prototype.updateOneBookInfo = function(id, bookin, callback) {
	var book = {
		name: bookin.name,
		ename: bookin.ename,
		memo: bookin.memo,
		createDate: new Date(),
		publicDate: bookin.publicDate,
		forwardSaleDate: bookin.forwardSaleDate,
		discount: bookin.discount ? bookin.discount : '10',
		secDiscount: bookin.secDiscount ? bookin.secDiscount : '10',
		price: bookin.price,
		bookVersion: bookin.bookVersion ? bookin.bookVersion : '1',
		isStore: bookin.isStore ? bookin.isStore : true,
		storeNumber: bookin.storeNumber,
		ISBN: bookin.ISBN,
		pageNumber: bookin.pageNumber,
		promotion: bookin.promotion ? promotion.promotion : false,
		keyword: bookin.keyword,
		banding: bookin.banding ? bookin.banding : 0
	};
	// 保存书籍分类关联信息
	if (bookin.bookCategray.id) {
		book.bookCategray = [bookin.bookCategray.id];
	}
	// 保存作者关联信息
	if (bookin.authors.ids) {
		book.authors = bookin.authors.ids;
	}
	// 保存出版社关联信息
	if (bookin.publicCompanys.ids) {
		book.publicCompany = bookin.publicCompanys.ids;
	}
	BookModel.findByIdAndUpdate(id, book, {
		new: true,
		upsert: false
	}, function(err, book_) {
		if (err)
			return callback(err);
		return callback(err, book_);
	});
};
// 上传对应图书的图片信息
Book.prototype.uploadBookImage = function(bookid, attributes, callback) {
	var image = new UploadFileModel({
		name: attributes.name,
		memo: attributes.memo,
		useType: attributes.type,
		isCurrentUsed: attributes.isCurrentUsed ? attributes.isCurrentUsed : true,
		uploadDate: new Date(),
		filename: escape(attributes.file.filename),
		filetype: attributes.file.filetype,
		filesize: attributes.file.filesize,
		filepath: attributes.file.filepath,
		type: attributes.file.filename.substring(attributes.file.filename.lastIndexOf('.') + 1),
		url: attributes.file.filepath,
		book: [bookid]
	});
	image.save(function(e, img) {
		if (e)
			return callback(e);
		else
			BookModel.update({
				_id: bookid
			}, {
				$push: {
					images: img.id
				}
			}, {
				safe: true,
				multi: true
			}, function(err, book_) {
				if (err)
					return callback(err);
				if (book_)
					return callback(err, book_);
			});
	});
}
// 获取书籍以及图片信息
Book.prototype.getOneBookImages = function(bookid, callback) {
	BookModel
		.findById(bookid)
		.populate({
			path: 'images',
			select: 'name url',
			options: {
				sort: {
					cteateeDate: -1
				}
			}
		}).exec(function(err, book) {
			if (err) return callback(err);
			callback(err, book);
		});
}
// 設置書籍為新书速递
Book.prototype.setBookExpress = function(bookid, flag, expressDate_, callback) {
	// flag为true表示新书速递被取消
	var u = {};
	if (flag == "false") {
		u.isNewBook = false;
		u.expressDate = null
	} else if (flag = true) {
		u.isNewBook = true;
		u.expressDate = (expressDate_ != null) ? expressDate_ : (new Date());
	}
	BookModel.update({
		_id: bookid
	}, u, {
		safe: true,
		multi: true
	}, function(err, book_) {
		if (err)
			return callback(err);
		if (book_)
			return callback(err, book_);
	});
}
// 获取图书速递信息
Book.prototype.getBookExpressInfo = function(id, callback) {
	BookModel
		.findById(id).select('isNewBook expressDate').exec(function(err, book) {
			if (err) return callback(err);
			callback(err, book);
		});
};
// 获取图书推荐信息
Book.prototype.getBookRecommandedInfo = function(id, callback) {
	BookModel
		.findById(id).select('isRecommanded recommandedDate').exec(function(err, book) {
			if (err) return callback(err);
			callback(err, book);
		});
};
// 设置编辑推荐状态
Book.prototype.setBookRecommanded = function(bookid, flag, recommandedDate_, callback) {
	// flag为true表示推荐被取消
	var u = {};
	if (flag == "false") {
		u.isRecommanded = false;
		u.recommandedDate = null
	} else if (flag = true) {
		u.isRecommanded = true;
		u.recommandedDate = (recommandedDate_ != null) ? recommandedDate_ : (new Date());
	}
	BookModel.update({
		_id: bookid
	}, u, {
		safe: true,
		multi: true
	}, function(err, book_) {
		if (err)
			return callback(err);
		if (book_)
			return callback(err, book_);
	});
}
// 获取热门图书信息
Book.prototype.getBookHotInfo = function(id, callback) {
	BookModel
		.findById(id).select('isHot hotDate').exec(function(err, book) {
			if (err) return callback(err);
			callback(err, book);
		});
};
// 设置热门图书状态
Book.prototype.setBookHot = function(bookid, flag, hotDate_, callback) {
	// flag为true表示非热门图书
	var u = {};
	if (flag == "false") {
		u.isHot = false;
		u.hotDate = null
	} else if (flag = true) {
		u.isHot = true;
		u.hotDate = (hotDate_ != null) ? hotDate_ : (new Date());
	}
	BookModel.update({
		_id: bookid
	}, u, {
		safe: true,
		multi: true
	}, function(err, book_) {
		if (err)
			return callback(err);
		if (book_)
			return callback(err, book_);
	});
}
// 添加章节信息(单)
Book.prototype.addSection = function(bookid, section, callback) {
	// 查找出书籍的章节信息
	BookModel.findById(bookid, function(err, book) {
		if (err)
			return callback(err);
		else {
			var bookSections = book.bookSections;
			var maxOrder = 0;
			// 取出章节最大编排号码
			for (var i = 0; i < bookSections.length; i++) {
				if (bookSections[i].order > maxOrder)
					maxOrder = bookSections[i].order;
			}
			maxOrder++;
			// 插入章节操作
			BookModel.update({
				_id: bookid
			}, {
				$push: {
					bookSections: {
						order: maxOrder,
						section: [section]
					}
				}
			}, {
				safe: true,
				multi: true
			}, function(err, book_) {
				if (err)
					return callback(err);
				return callback(err, book_);
			})
		}
	});
}
// 获取书籍的所有章节信息
Book.prototype.listAllBookSections = function(bookid, callback) {
	BookModel.findById(bookid).select('bookSections').exec(function(err, book_) {
		if (err)
			return callback(err);
		return callback(err, book_);
	});
}
// 删除一本书的章节信息
Book.prototype.deleteOneBookSection = function(bookid, sectionid, callback) {
	// 复杂数组要先查找数组信息
	BookModel.findById(bookid).select('bookSections').exec(function(err, book_) {
		if (err)
			return callback(err);
		var bookSections = book_.bookSections;
		// 从数组中进行删除元素
		for (var i = 0; i < bookSections.length; i++) {
			if (bookSections[i].order == sectionid) {
				bookSections.splice(i, 1);
				break;
			}
		}
		// 更细书籍信息
		BookModel.update({
			_id: bookid
		}, {
			bookSections: bookSections
		}, {
			safe: true,
			multi: true
		}, function(err_, _book_) {
			if (err_)
				return callback(err_);
			return callback(err_, _book_);
		});
	});
}
module.exports.BookDao = new Book();