var crypto = require('crypto'),

	Book = require('../controls_b/book.js'),

	Admin = require('../controls_b/admin.js');

var Author = require('../controls_b/author.js');

var AuthorDao = Author.AuthorDao;

var settings = require('../settings_b');

var Translator = require('../controls_b/translator.js');

var TranslatorDao = Translator.TranslatorDao;

var BookCategray = require('../controls_b/bookCategray.js');

var BookCategrayDao = BookCategray.BookCategrayDao;

var Book = require('../controls_b/book.js');
var BookDao = Book.BookDao;

var UploadFile = require('../controls_b/uploadfile.js');
var UploadFileDao = UploadFile.UploadFileDao;

var PublicCompany = require('../controls_b/publicCompany.js');
var PublicCompanyDao = PublicCompany.PublicCompanyDao;

var fs = require('fs');
module.exports = function(app)

{

	////////////////////////后台系统///////////////////////////////////

	app.get("/support", function(req, res) {

		if (req.session.admin == null)

			return res.redirect("/support/adminLogin");

		else

			return res.redirect("/support/index");

	});

	app.get("/support/index", function(req, res) {

		res.render("support/index", {
			title: "后台管理系统"
		});

	});

	app.get('/support/adminLogout', function(req, res) {

		req.session.admin = null;

		res.send({
			success: "true"
		});

		return;

	});

	app.get("/support/adminLogin", function(req, res) {

		res.render("support/adminLogin", {
			title: "后台管理系统"
		});

	});

	app.post('/support/adminLogin', function(req, res) {

		var adminname = req.body.adminname;

		var md5 = crypto.createHash('md5');

		var password = md5.update(req.body.password).digest("base64");

		Admin.get(adminname, function(err, admin) {

			if (!admin)

			{

				res.send({
					error: "管理员不存在"
				});

				return;

			}

			if (admin.password != password)

			{

				res.send({
					error: "管理员密码输入错误"
				});

				return;

			}

			req.session.admin = admin;

			res.send({
				success: "true"
			});

			return;

		});

	});

	app.get('/support/adminReg', function() {
		res.render('support/adminReg', {
			title: '管理员注册'
		});
	});

	app.post('/support/adminReg', function(req, res) {

		var md5 = crypto.createHash('md5');

		var password = md5.update(req.body.password).digest("base64");

		var name = req.body.adminname;

		var admin = {

			name: name,

			password: password

		}

		Admin.get(name, function(err, u) {

			if (u)

				err = "管理员已经存在!";

			if (err)

			{

				req.flash('error', err);

				return res.redirect("/support/adminReg");

			}

			Admin.save(admin, function(err) {

				if (err)

				{

					req.flash('error', err);

					return res.redirect("/support/adminReg");

				}

				req.flash("success", "添加成功!");

				return res.redirect("/support");

			});

		});

	});

	///////////////////////////图书作者////////////////////////////////

	app.get("/support/authorAdd", function(req, res) {

		res.render("support/authorAdd", {
			title: "图书作者添加操作"
		});

	});

	app.post("/support/authorAdd", function(req, res) {

		var name = req.body.name;

		var secName = req.body.secName;

		var country = req.body.country;

		var province = req.body.province;

		var city = req.body.city;

		var email = req.body.email;

		var website = req.body.website;

		var memo = req.body.memo;

		var sex = req.body.sex;

		var introduction = req.body.introduction;

		var author = {

			name: name,

			secName: secName,

			address: {

				country: country,

				province: province,

				city: city

			},

			email: email,

			website: website,

			memo: memo,

			sex: sex,
			introduction: introduction

		};

		AuthorDao.get(name, function(err, author_) {

			if (author_)

			{

				res.send({
					error: err
				});

				return;

			} else

				AuthorDao.save(author, function(err) {

					if (err)

					{

						res.send({
							'error': err
						});

						return;

					}

					res.send({
						"success": "true!"
					});

					return;

				});

		});

	});

	app.get("/support/listAuthorAllByJson_bk", function(req, res) {
		var start;
		var limit;
		var page;
		var name_like;
		var sex_equal;
		var secName_like;
		if (req.query) {
			//start = req.query["start"] || 0 ; 
			limit = req.query["limit"] || 10;
			page = req.query["page"] || 1;
			name_like = req.query["name_like"] || null;
			sex_equal = req.query["sex_equal"] || null;
			secName_like = req.query["secName_like"] || null;
		}
		var queryCondition = {
			name_like: name_like,
			sex_equal: sex_equal,
			secName_like: secName_like
		}
		start = (page - 1) * limit;
		AuthorDao.listAuthorAllByJson_bk(start, limit, queryCondition, function(err, count, authors) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				if (!authors) {
					res.send({
						totalCount: 0,
						items: [],
						page: page
					});
					return;
				}
				var aus = {
					totalCount: count,
					items: [],
					page: page
				};
				for (var i = 0, len = authors.length; i < len; i++) {
					var author_ = authors[i];
					var item = {
						name: author_.name,
						secName: author_.secName,
						website: author_.website,
						email: author_.email,
						sex: author_.sex,
						id: author_._id
					}

					aus.items.push(item);
				}
				res.json(aus);
			}
		});
	});
	app.post("/support/getOneAuthorInfo", function(req, res) {

		var id = req.body["id"];

		if (id)

		{

			AuthorDao.getOneAuthorInfo(id, function(err, author) {

				if (err)

				{

					res.send({
						'error': err
					});

					return;

				}

				if (author)

				{

					res.json({
						item: author
					});

				} else

					res.json({
						'error': {
							message: "无法匹配到到响应的数据!"
						}
					});

			});

		}

	});

	// 根据id删除一个作者信息

	app.post("/support/deleteOneAuthor", function(req, res) {

		var id = req.body["id"];

		if (id)

		{

			AuthorDao.deleteOneAuthor(id, function(err, author) {

				if (err)

				{

					res.send({
						error: err
					});

					return;

				} else

					res.send({
						success: "true"
					});

			});

		}

	});

	// 更新作者的信息

	app.post("/support/updateOneAuthorInfo", function(req, res) {

		var name = req.body.name;

		var secName = req.body.secName;

		var country = req.body.country;

		var province = req.body.province;

		var city = req.body.city;

		var email = req.body.email;

		var website = req.body.website;

		var memo = req.body.memo;

		var sex = req.body.sex;
		var introduction = req.body.introduction;

		var author = {

			name: name,

			secName: secName,

			address: {

				country: country,

				province: province,

				city: city

			},

			email: email,

			website: website,

			memo: memo,

			sex: sex,
			introduction: introduction

		};

		var id = req.body.id;

		if (id)

		{

			AuthorDao.updateOneAuthorInfo(id, author, function(err, author) {

				if (err)

				{

					res.send({
						error: err
					});

					return;

				} else

				{

					res.send({
						success: "true"
					});

				}

			});

		}

	});

	app.get("/support/getAuthorsSimple", function(req, res) {
		AuthorDao.getAuthorsSimple(function(err, authors) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				if (!authors) {
					res.send({});
					return;
				}
				var aus = [];
				for (var i = 0, len = authors.length; i < len; i++) {
					var author_ = authors[i];
					var item = {
						name: author_.name,
						id: author_._id
					}
					aus.push(item);
				}
				res.json(aus);
			}
		});
	});
	////////////////////////////////图书译者////////////////////////////

	app.get("/support/translatorAdd", function(req, res) {

		res.render("support/translatorAdd", {
			title: "图书译者添加操作"
		});

	});

	app.post("/support/translatorAdd", function(req, res) {

		var name = req.body.name;

		var secName = req.body.secName;

		var country = req.body.country;

		var province = req.body.province;

		var city = req.body.city;

		var email = req.body.email;

		var website = req.body.website;

		var memo = req.body.memo;

		var translator = {

			name: name,

			secName: secName,

			address: {

				country: country,

				province: province,

				city: city

			},

			email: email,

			website: website,

			memo: memo

		};

		TranslatorDao.get(name, function(err, translator_) {

			if (translator_)

			{

				res.send({
					error: "译者已经存在"
				});

				return;

			} else

				TranslatorDao.save(translator, function(err) {

					if (err)

					{

						res.send({
							'error': err
						});

						return;

					}

					res.send({
						"success": "添加成功!"
					});

					return;

				});

		});

	});

	////////////////////////////书籍分类信息/////////////////////////////////////

	app.get("/support/bookCategrayAdd", function(req, res) {

		res.render("support/bookCategrayAdd", {
			title: "图书分类信息添加操作"
		});

	});

	app.post("/support/bookCategrayAdd", function(req, res) {

		var name = req.body.name;

		var memo = req.body.memo;

		var ename = req.body.ename;

		var bookCategray = {

			name: name,

			ename: ename,

			memo: memo,

			parentCategray: {

				id: req.body.pid

			}

		};

		BookCategrayDao.get(name, function(err, bookCategray_) {

			if (bookCategray_)

			{

				res.send({
					error: "图书分类已经存在"
				});

				return;

			} else

				BookCategrayDao.save(bookCategray, function(err) {

					if (err)

					{

						res.send({
							'error': err
						});

						return;

					}

					res.send({
						"success": "添加成功!"
					});

					return;

				});

		});

	});

	app.get("/support/getCategraySimple", function(req, res) {

		BookCategrayDao.getCategraySimple(function(err, categraies) {

			if (err)

			{

				res.send({
					error: err
				});

				return;

			} else

			{

				if (!categraies)

				{

					res.send({});

					return;

				}

				var aus = [];

				for (var i = 0, len = categraies.length; i < len; i++)

				{

					var categray_ = categraies[i];

					var item = {

						name: categray_.name,

						id: categray_._id

					}

					aus.push(item);

				}

				res.json(aus);

			}

		});

	});

	app.get("/support/listCategraiesAllByJson_bk", function(req, res) {

		var start;

		var limit;

		var page;

		var name_like;

		var ename_like;

		if (req.query) {

			//start = req.query["start"] || 0 ; 

			limit = req.query["limit"] || 10;

			page = req.query["page"] || 1;

			name_like = req.query["name_like"] || null;

			ename_like = req.query["ename_like"] || null;

		}

		var queryCondition = {

			name_like: name_like,

			ename_like: ename_like

		}

		start = (page - 1) * limit;

		BookCategrayDao.listCategraiesAllByJson_bk(start, limit, queryCondition, function(err, count, categraies) {

			if (err)

			{

				res.send({
					error: err
				});

				return;

			} else {

				if (!categraies)

				{

					res.send({
						totalCount: 0,
						items: [],
						page: page
					});

					return;

				}

				var aus = {
					totalCount: count,
					items: [],
					page: page
				};

				for (var i = 0, len = categraies.length; i < len; i++)

				{

					var categray_ = categraies[i];

					var item = {

						name: categray_.name,

						ename: categray_.ename,

						id: categray_._id

					}

					aus.items.push(item);

				}

				res.json(aus);

			}

		});

	});

	app.post("/support/getOneCatagrayInfo", function(req, res) {

		var id = req.body["id"];

		if (id)

		{

			BookCategrayDao.getOneCatagrayInfo(id, function(err, categray) {

				if (err)

				{

					res.send({
						'error': err
					});

					return;

				}

				if (categray)

				{

					res.json({
						item: categray
					});

				} else

					res.json({
						'error': {
							message: "无法匹配到到响应的数据!"
						}
					});

			});

		}

	});

	app.post("/support/deleteOneCatagray", function(req, res) {

		var id = req.body["id"];

		if (id)

		{

			BookCategrayDao.deleteOneCatagray(id, function(err, categray) {

				if (err)

				{

					res.send({
						error: err
					});

					return;

				} else

					res.send({
						success: "true"
					});

			});

		}

	});


	// 图书列表
	app.get("/support/listBooksAllByJson_bk", function(req, res) {
		var start;
		var limit;
		var page;
		var name_like;
		var ename_like;
		var isRecommanded_equal;
		var isNewBook_equal;
		var isHot_equal;
		var isStore_equal;
		if (req.query) {
			//start = req.query["start"] || 0 ; 
			limit = req.query["limit"] || 10;
			page = req.query["page"] || 1;
			name_like = req.query["name_like"] || null;
			ename_like = req.query["ename_like"] || null;
			isRecommanded_equal = req.query["isRecommanded_equal"] || null;
			isNewBook_equal = req.query["isNewBook_equal"] || null;
			isHot_equal = req.query['isHot_equal'] || null;
			isStore_equal = req.query['isStore_equal'] || null;
		}
		var queryCondition = {
			name_like: name_like,
			ename_like: ename_like,
			isRecommanded_equal: isRecommanded_equal,
			isNewBook_equal: isNewBook_equal,
			isHot_equal: isHot_equal,
			isStore_equal: isStore_equal
		}
		start = (page - 1) * limit;
		BookDao.listBooksAllByJson_bk(start, limit, queryCondition, function(err, count, books) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				if (!books) {
					res.send({
						totalCount: 0,
						items: [],
						page: page
					});
					return;
				}
				var aus = {
					totalCount: count,
					items: [],
					page: page
				};
				for (var i = 0, len = books.length; i < len; i++)

				{
					var book_ = books[i];
					var item = {
						name: book_.name,
						ename: book_.ename,
						id: book_._id,
						price: book_.price,
						bookVersion: book_.bookVersion,
						isStore: book_.isStore,
						storeNumber: book_.storeNumber,
						ISBN: book_.ISBN,
						isNewBook: book_.isNewBook,
						isRecommanded: book_.isRecommanded,
						isHot: book_.isHot
					}
					aus.items.push(item);
				}
				res.json(aus);
			}
		});
	});

	app.post('/support/bookAdd', function(req, res) {
		var name = req.body.name;
		var ename = req.body.ename;
		var price = req.body.price;
		var discount = req.body.discount;
		var secDiscount = req.body.secDiscount;
		var bookVersion = req.body.bookVersion;
		var isStore = req.body.isStore;
		var storeNumber = req.body.storeNumber;
		var ISBN = req.body.ISBN;
		var pageNumber = req.body.pageNumber;
		var keyword = req.body.keyword;
		var publicDate = req.body.publicDate;
		var forwardSaleDate = req.body.forwardSaleDate;
		var memo = req.body.memo;
		var banding = req.body.banding;
		var book = {
			name: name,
			ename: ename,
			price: price,
			discount: discount,
			secDiscount: secDiscount,
			bookVersion: bookVersion,
			isStore: isStore,
			storeNumber: storeNumber,
			ISBN: ISBN,
			pageNumber: pageNumber,
			keyword: keyword,
			forwardSaleDate: forwardSaleDate,
			publicDate: publicDate,
			memo: memo,
			bookCategray: {
				id: req.body.cid
			},
			authors: {
				ids: req.body.aid
			},
			publicCompanys: {
				ids: req.body.comid
			},
			banding: banding
		}
		BookDao.save(book, function(err, book_) {
			if (err) {
				res.send({
					'error': err
				});
				return;
			}
			res.send({
				"success": "添加成功!"
			});
			return;
		});
	});
	// 删除一个书籍信息
	app.post('/support/deleteOneBook', function(req, res) {
		var id = req.body["id"];
		if (id) {
			BookDao.deleteOneBook(id, function(err, book) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else
					res.send({
						success: "true"
					});
			});
		}
	});
	app.post('/support/getOneBookInfo', function(req, res) {
		var id = req.body["id"];
		if (id) {
			BookDao.getOneBookInfo(id, function(err, book) {
				if (err) {
					res.send({
						error: err
					});
					return;
				}
				if (book)
					res.json({
						item: book
					});
				else
					res.json({
						'error': {
							message: "无法匹配到到响应的数据!"
						}
					});
			});
		}
	});
	// 更新书籍信息
	app.post('/support/updateOneBookInfo', function(req, res) {
		var name = req.body.name;
		var ename = req.body.ename;
		var price = req.body.price;
		var discount = req.body.discount;
		var secDiscount = req.body.secDiscount;
		var bookVersion = req.body.bookVersion;
		var isStore = req.body.isStore;
		var storeNumber = req.body.storeNumber;
		var ISBN = req.body.ISBN;
		var pageNumber = req.body.pageNumber;
		var keyword = req.body.keyword;
		var publicDate = req.body.publicDate;
		var forwardSaleDate = req.body.forwardSaleDate;
		var memo = req.body.memo;
		var banding = req.body.banding;
		var book = {
			name: name,
			ename: ename,
			price: price,
			discount: discount,
			secDiscount: secDiscount,
			bookVersion: bookVersion,
			isStore: isStore,
			storeNumber: storeNumber,
			ISBN: ISBN,
			pageNumber: pageNumber,
			keyword: keyword,
			forwardSaleDate: forwardSaleDate,
			publicDate: publicDate,
			memo: memo,
			bookCategray: {
				id: req.body.cid
			},
			authors: {
				ids: req.body.aid
			},
			publicCompanys: {
				ids: req.body.comid
			},
			banding: banding
		}
		var id = req.body.id;
		if (id) {
			BookDao.updateOneBookInfo(id, book, function(err, book) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else {
					res.send({
						success: "true"
					});
				}
			});
		}
	});
	app.post('/support/uploadBookImage', function(req, res) {
		var name = req.body.name;
		var memo = req.body.memo;
		var type = req.body.type;
		var isCurrentUsed = req.body.isCurrentUsed;
		var attributes = {
			name: name,
			memo: memo,
			type: type,
			isCurrentUsed: isCurrentUsed
		}
		if (req.files.filepath) {
			attributes.file = {};
			var file = req.files.filepath;
			attributes.file.filename = file.name;
			attributes.file.filetype = file.type;
			attributes.file.filesize = file.size;
			attributes.file.filepath = settings.bookimgfolder;
		}
		if (req.body.bookid) {
			BookDao.uploadBookImage(req.body.bookid, attributes, function(err, book) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else {
					var target_path = './public/' + settings.bookimgfolder + req.files.filepath.name;
					var tmp_path = req.files.filepath.path;
					// 移动文件
					fs.rename(tmp_path, target_path, function(err) {
						if (err)
							res.send({
								success: false
							});
						// 删除临时文件夹文件, 
						fs.unlink(tmp_path, function(err1) {
							if (err1)
								res.send({
									success: false
								});
							else
								res.send({
									success: true
								});
						});
					});

				}
			});
		}
	});
	app.post('/support/upload', function(req, res) {
		// 指定文件上传后的目录 - 示例为"images"目录。 
		var target_path = './public/' + req.files.filepath.name;
		// 移动文件
		fs.rename(tmp_path, target_path, function(err) {
			if (err) throw err;
			// 删除临时文件夹文件, 
			fs.unlink(tmp_path, function() {
				if (err) throw err;
				res.send('File uploaded to: ' + target_path + ' - ' + req.files.filepath.size + ' bytes');
			});
		});
	});
	app.post('/support/getOneBookImages', function(req, res) {
		if (req.body.id) {
			BookDao.getOneBookImages(req.body.id, function(err, book) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else
					res.json(book);
			});
		} else
			res.json({
				'error': {
					message: "id不存在!"
				}
			});
	});

	// 书籍就图片管理
	app.get('/support/listUploadImgsAllByJson_bk', function(req, res) {
		var start;

		var limit;

		var page;

		if (req.query) {

			//start = req.query["start"] || 0 ; 

			limit = req.query["limit"] || 10;

			page = req.query["page"] || 1;
		}

		var queryCondition = {

		}

		start = (page - 1) * limit;

		UploadFileDao.listUploadImgsAllByJson_bk(start, limit, queryCondition, function(err, count, imgs) {

			if (err)

			{

				res.send({
					error: err
				});

				return;

			} else {

				if (!imgs)

				{

					res.send({
						totalCount: 0,
						items: [],
						page: page
					});

					return;

				}

				var aus = {
					totalCount: count,
					items: [],
					page: page
				};

				for (var i = 0, len = imgs.length; i < len; i++)

				{

					var img_ = imgs[i];

					var item = {

						name: img_.name,

						url: img_.url,

						id: img_._id,

						isCurrentUsed: img_.isCurrentUsed,

						filetype: img_.filetype,

						filename: img_.filename,

						useType: img_.useType
					}

					aus.items.push(item);

				}

				res.json(aus);

			}

		});
	});
	app.post("/support/deleteOneBookImg", function(req, res) {
		var id = req.body["id"];
		if (id) {
			UploadFileDao.deleteOneBookImg(id, function(err, img) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else
					fs.unlink('./support' + img.url + unescape(img.filename), function(e_) {
						if (e_) {
							res.send({
								error: e_
							});
							return;
						} else
							res.send({
								success: "true"
							});
					});
			});
		}
	});
	// 获取一张书籍图片的详细信息
	app.post('/support/getOneBookImgInfo', function(req, res) {
		var id = req.body.id;
		UploadFileDao.getOneBookImgInfo(id, function(err, img) {
			if (err) {
				res.send({
					error: err
				});
				return;
			}
			if (img)
				res.json({
					item: img
				});
			else
				res.json({
					'error': {
						message: "无法匹配到到响应的数据!"
					}
				});
		});
	});
	// 设置书籍的新书速递状态
	app.post('/support/setBookExpress', function(req, res) {
		var id = req.body.id;
		var expressDate = req.body.expressDate ? req.body.expressDate : null;
		var isNewBook = req.body.isNewBook;
		BookDao.setBookExpress(id, isNewBook, expressDate, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				res.send({
					success: "true"
				});
			}
		});
	});
	// 获取书籍速递信息
	app.post('/support/getBookExpressInfo', function(req, res) {
		var id = req.body["id"];
		BookDao.getBookExpressInfo(id, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			}
			if (book)
				res.json({
					item: book
				});
			else
				res.json({
					'error': {
						message: "无法匹配到到响应的数据!"
					}
				});
		});
	});
	// 获取书籍推荐信息
	app.post('/support/getBookRecommandedInfo', function(req, res) {
		var id = req.body["id"];
		BookDao.getBookRecommandedInfo(id, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			}
			if (book)
				res.json({
					item: book
				});
			else
				res.json({
					'error': {
						message: "无法匹配到到响应的数据!"
					}
				});
		});
	});
	// 设置书籍的新书速递状态
	app.post('/support/setBookRecommanded', function(req, res) {
		var id = req.body.id;
		var recommandedDate = req.body.recommandedDate ? req.body.recommandedDate : null;
		var isRecommanded = req.body.isRecommanded;
		BookDao.setBookRecommanded(id, isRecommanded, recommandedDate, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				res.send({
					success: "true"
				});
			}
		});
	});
	// 获取热门书籍信息
	app.post('/support/getBookHotInfo', function(req, res) {
		var id = req.body["id"];
		BookDao.getBookHotInfo(id, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			}
			if (book)
				res.json({
					item: book
				});
			else
				res.json({
					'error': {
						message: "无法匹配到到响应的数据!"
					}
				});
		});
	});
	// 设置书籍的新书速递状态
	app.post('/support/setBookHot', function(req, res) {
		var id = req.body.id;
		var hotDate = req.body.hotDate ? req.body.hotDate : null;
		var isHot = req.body.isHot;
		BookDao.setBookHot(id, isHot, hotDate, function(err, book) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				res.send({
					success: "true"
				});
			}
		});
	});
	// 出版社信息列表
	app.get("/support/listPublicCompanysAllByJson_bk", function(req, res) {
		var start;
		var limit;
		var page;
		var name_like;
		if (req.query) {
			//start = req.query["start"] || 0 ; 
			limit = req.query["limit"] || 10;
			page = req.query["page"] || 1;
			name_like = req.query["name_like"] || null;
		}
		var queryCondition = {
			name_like: name_like,
		}
		start = (page - 1) * limit;
		PublicCompanyDao.listPublicCompanysAllByJson_bk(start, limit, queryCondition, function(err, count, publicCompanys) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				if (!publicCompanys) {
					res.send({
						totalCount: 0,
						items: [],
						page: page
					});
					return;
				}
				var aus = {
					totalCount: count,
					items: [],
					page: page
				};
				for (var i = 0, len = publicCompanys.length; i < len; i++)

				{
					var publicCompany_ = publicCompanys[i];
					var item = {
						name: publicCompany_.name,
						id: publicCompany_._id,
						website: publicCompany_.website,
						email: publicCompany_.email,
						telephone: publicCompany_.telephone,
						phone: publicCompany_.phone,
						ename: publicCompany_.ename,
						introduction: publicCompany_.introduction
					}
					aus.items.push(item);
				}
				res.json(aus);
			}
		});
	});
	// 删除一个出版社信息
	app.post('/support/deleteOnePublicCompany', function(req, res) {
		var id = req.body["id"];
		if (id) {
			PublicCompanyDao.deleteOnePublicCompany(id, function(err, publicCompany) {
				if (err) {
					res.send({
						error: err
					});
					return;
				} else
					res.send({
						success: "true"
					});
			});
		}
	});
	// 添加一个出版社信息
	app.post('/support/publicCompanyAdd', function(req, res) {
		var publicCompany = {
			name: req.body.name,
			ename: req.body.ename,
			email: req.body.email,
			website: req.body.website,
			phone: req.body.phone,
			telephone: req.body.telephone,
			introduction: req.body.introduction,
			memo: req.body.memo,
			foundDate: req.body.foundDate,
			postcode: req.body.postcode,
			address: {
				detail: req.body.detail,
				country: req.body.country,
				city: req.body.city,
				province: req.body.province
			}
		}
		// 保存操作
		PublicCompanyDao.publicCompanyAdd(publicCompany, function(err, publicCompany_) {
			if (err) {
				return res.send({
					'error': err
				});
			}
			return res.send({
				"success": "添加成功!"
			});
		});
	});
	// 获取简单的出版社信息
	app.get("/support/getPublicCompanySimple", function(req, res) {

		PublicCompanyDao.getPublicCompanySimple(function(err, publicCompanys) {

			if (err)

			{

				res.send({
					error: err
				});

				return;

			} else

			{

				if (!publicCompanys)

				{

					res.send({});

					return;

				}

				var aus = [];

				for (var i = 0, len = publicCompanys.length; i < len; i++)

				{

					var publicCompany_ = publicCompanys[i];

					var item = {

						name: publicCompany_.name,

						id: publicCompany_._id

					}

					aus.push(item);

				}

				res.json(aus);

			}

		});

	});
	// 添加书籍章节信息
	app.post('/support/book/addSection', function(req, res) {
		var bookid = req.body.bookid;
		var section_name = req.body.name;
		var section_secName = req.body.secName;
		var section_content = req.body.content;
		var section_instruction = req.body.instruction;
		var section = {
			name: section_name,
			secName: section_secName,
			content: escape(section_content),
			instruction: escape(section_instruction)
		}
		// 保存操作
		BookDao.addSection(bookid, section, function(err, book_) {
			if (err) {
				return res.send({
					'error': err
				});
			}
			return res.send({
				"success": "添加成功!"
			});
		});
	});
	// 图书章节列表
	app.get('/support/book/listAllBookSections', function(req, res) {
		var bookid = req.query.bookid;
		BookDao.listAllBookSections(bookid, function(err, book_) {
			var aus = {
				totalCount: 0,
				items: [],
				page: 1
			};
			if (err)
				return res.send({
					'error': err
				});
			if (!book_) {
				return aus;
			}
			aus.totalCount = book_.bookSections.length;
			for (var i = 0, len = book_.bookSections.length; i < len; i++) {
				var section_ = book_.bookSections[i];
				var item = {
					name: section_.section[0].name,
					secName: section_.section[0].secName,
					content: section_.section[0].content,
					instruction: section_.section[0].instruction,
					order: section_.order
				}
				aus.items.push(item);
			}
			res.json(aus);
		});
	});
	// 删除一本书的章节信息
	app.post('/support/book/deleteOneBookSection', function(req, res) {
		var bookid = req.body.bookid;
		var sectionid = req.body.sectionid;
		BookDao.deleteOneBookSection(bookid, sectionid, function(err, book_) {
			if (err) {
				return res.send({
					error: err
				});
			} else
				return res.send({
					success: "true"
				});
		});
	});
};