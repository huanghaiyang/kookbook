var crypto = require('crypto'),
	User = require('../controls/user.js'),
	Book = require('../controls/book.js');

var Author = require('../controls/author.js');
var AuthorDao = Author.AuthorDao;

var Translator = require('../controls/translator.js');
var TranslatorDao = Translator.TranslatorDao;

var BookCategray = require('../controls/bookCategray.js');
var BookCategrayDao = BookCategray.BookCategrayDao;

var Book = require('../controls/book.js');
var BookDao = Book.BookDao;

var UploadFile = require('../controls/uploadfile.js');
var UploadFileDao = UploadFile.UploadFileDao;

var PublicCompany = require('../controls/publicCompany.js');
var PublicCompanyDao = PublicCompany.PublicCompanyDao;

var TempAuthorDao = require('../controls/tempAuthor.js').TempAuthorDao;

var fs = require('fs');
var settings = require('../settings');
var EventProxy = require('eventproxy');
module.exports = function(app) {

	var checkForSessionTimeout = function(req, res, next) {
		// 获取sessionid
		var sessionID = req.cookies['express.sid'];
		sessionStore.load(sessionID, function(err, session) {
			// 用户过期但有请求
			if ((err || !session) && req.xhr) {
				res.status(500).json({
					error: 'Cantas session timeout'
				});
			} else if ((err || !session) && !req.xhr) {
				// 用户过期但没有请求
				req.session.redirectUrl = req.url;
				res.redirect('/login');
			} else {
				return next();
			}
		});
	};

	// Simple route middleware to ensure user is authenticated.
	// Use this route middleware on any resource that needs to be protected.  If
	// the request is authenticated (typically via a persistent login session),
	// the request will proceed.  Otherwise, the user will be redirected to the
	// login page.

	function ensureAuthenticated(req, res, next) {
		// 认证通过
		if (req.isAuthenticated()) {
			app.helpers({
				user: req.user
			});
			// If we have session.redirectUrl, use that,
			// otherwise, bypass redirect url
			if (req.session && req.session.redirectUrl) {
				var redirectUrl = req.session.redirectUrl;
				req.session.redirectUrl = null;
				return res.redirect(redirectUrl);
			}
			next();
		} else {
			if (req.xhr) {
				res.status(500).json({
					error: 'Cantas session timeout'
				});
			} else {
				req.session.redirectUrl = req.url;
				res.redirect('/login');
			}
		}
	}
	var getRequestMethod = function(req) {
		var path = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		return path;
	};
	app.get('/', function(req, res) {
		res.render('index', {
			title: 'KookBook整合阅读首页'
		});
	});
	app.get('/reg', function(req, res) {
		res.render('reg', {
			title: 'KookBook用户注册'
		});
	});
	app.get('/login', function(req, res) {
		res.render('login', {
			title: 'KookBook用户登录'
		});
	});
	app.post('/post', function(req, res) {});
	app.post('/login', function(req, res) {
		var username = req.body.username;
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest("base64");
		var ourl = req.body.ourl;
		User.get(username, function(err, user) {
			if (!user) {
				req.flash('error', "用户不存在!");
				return res.redirect("/login");
			}
			if (user.password != password) {
				req.flash('error', "用户密码输入错误!");
				return res.redirect("/login");
			}
			req.session.user = user;
			req.flash("success", "登录成功!");
			return res.redirect(ourl);
		});
	});
	app.post('/reg', function(req, res) {
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest("base64");
		var name = req.body.username;
		var email = req.body.email;
		var user = {
			name: name,
			password: password,
			email: email
		}
		User.get(name, function(err, u) {
			if (u)
				err = "用户名已经存在!";
			if (err) {
				req.flash('error', err);
				return res.redirect("/reg");
			}
			User.save(user, function(err) {
				if (err) {
					req.flash('error', err);
					return res.redirect("/reg");
				}
				req.session.user = user;
				req.flash("success", "注册成功!");
				return res.redirect("/");
			});
		});
	});
	app.get('/logout', function(req, res) {
		req.session.user = null;
		req.flash("success", "退出成功!");
		return res.redirect("/");
	});
	// 完善用户个人信息
	app.get("/userDetailInfo", function(req, res) {
		res.render("userDetailInfo", {
			title: "完善用户个人信息"
		});
	});
	// 上传用户图片
	app.get("/userUploadAvatars", function(req, res) {
		res.render("userUploadAvatars", {
			title: "上传用户图片"
		});
	});
	app.post('/userDetailInfo', function(req, res) {
		var userid = req.session.user._id;
		var userin = {
			name: req.body.name,
			website: req.body.website,
			instruction: req.body.instruction,
			sina: req.body.sina,
			tencent: req.body.tencent,
			sex: req.body.sex,
			signature: req.body.signature,
			email: req.body.email,
			httpAvatar: req.body.httpAvatar
		}
		User.update(userid, userin, function(err, user_) {
			if (err)
				return res.send({
					success: false
				});
			else {
				req.session.user = user_;
				return res.redirect("/userDetailInfo");
			}
		});
	});

	// 获取书籍分类信息（顶级分类）
	app.get("/categray/getAllUpSateCategrays", function(req, res) {
		BookCategrayDao.getAllUpSateCategrays(function(err, categraies) {
			if (err) {
				res.send({
					error: err
				});
				return;
			} else {
				if (!categraies) {
					res.send({});
					return;
				}
				var aus = [];
				for (var i = 0, len = categraies.length; i < len; i++) {
					var categray_ = categraies[i];
					var item = {
						name: categray_.name,
						ename: categray_.ename,
						id: categray_._id
					}
					aus.push(item);
				}
				res.json(aus);
			}
		});
	});
	// 获取推荐书籍
	app.get('/book/getRecommandedBooks', function(req, res) {
		BookDao.getRecommandedBooks(0, settings.indexPage.recommandedBookNumber, function(err, books) {
			if (err)
				res.send(err);
			else {
				if (books) {
					res.json(books);
				}
			}
		});
	});
	// 获取速递书籍
	app.get('/book/getNewBooks', function(req, res) {
		var start = 0;
		var page = req.body.page ? req.body.page : 1;
		start = (page - 1) * settings.indexPage.newBooksPreviewNumber;
		BookDao.getNewBooks(start, settings.indexPage.newBooksPreviewNumber, function(err, count, books) {
			if (err)
				res.send(err);
			else {
				var aus = {
					totalCount: count,
					items: [],
					page: page
				};
				if (books) {
					for (var i = 0; i < books.length; i++) {
						aus.items.push(books[i]);
					}
				}
				res.json(aus);
			}
		});
	});

	// 获取热门图书信息
	app.get('/book/getHotBooks', function(req, res) {
		BookDao.getHotBooks(0, settings.indexPage.hotBooksNumber, function(err, books) {
			if (err)
				res.send(err);
			else {
				if (books) {
					res.json(books);
				}
			}
		});
	});
	// 获取一个书籍的详细信息
	app.get('/book/:bookid', function(req, res) {
		var bookid = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		BookDao.getOneBookCompleteInfo(bookid, function(err, book) {
			if (err)
				return res.send(err);
			else {
				var book_ = book;
				res.locals.book = book_ ? book_ : null;
				return res.render('book', {
					title: '书籍信息',
					layout: 'bookInfoSimple book'
				});
			}
		});
	});
	// 给书籍设置星级评定
	app.post('/book/setIncStar', function(req, res) {
		var bookid = req.body.bookid;
		var star = req.body.star;
		var flag = req.body.insertOrUpdate;
		var userid = req.session.user._id;
		var content = req.body.content;
		// 原有的用户评价分数
		var oldStar = req.body.oldStar ? req.body.oldStar : 0;

		BookDao.setIncStar(bookid, userid, star, oldStar, function(err, book) {
			if (err) {
				return res.send({
					success: false
				});
			} else {
				// 更新用户关于书籍评价的信息
				if (flag == 'insert')
					User.setBookStar_insert(userid, bookid, content, star, function(err_, user_) {
						if (err_)
							return res.send({
								success: false
							});
						else
							return res.send({
								success: true
							});
					});
				else if (flag == 'update')
					User.setBookStar_update(userid, bookid, content, star, function(err_, user_) {
						if (err_)
							return res.send({
								success: false
							});
						else
							return res.send({
								success: true
							});
					});
			}
		});
	});
	// 设置用户的读书信息
	app.post('/user/setBooksReadInfo', function(req, res) {
		var bookid = req.body.bookid;
		var userid = req.session.user._id;
		var which = req.body.which;
		User.setBooksReadInfo(userid, bookid, which, function(err, user) {
			if (err) {
				return res.send({
					success: false
				});
			} else
				return res.send({
					success: true
				});
		});
	});
	// 获取用户的读书信息
	app.get('/user/getUserBooks', function(req, res) {
		var userid = req.session.user._id;
		User.getUserBooks(userid, function(err, user) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.json(user);
		});
	});
	// 删除用户关于一本书籍的收藏信息
	app.post('/user/deleteUserReads', function(req, res) {
		var userid = req.session.user._id;
		var bookid = req.body.bookid;
		User.deleteUserReads(userid, bookid, function(err, user) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.json(user);
		});
	});
	// 设置用关于书籍的标签信息
	app.post('/user/setUserBookTags', function(req, res) {
		var userid = req.session.user._id;
		var tags = req.body.tags;
		var bookid = req.body.bookid;
		User.setUserBookTags(userid, bookid, tags, function(err, user) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true
				});
		});
	});
	// 获取用户的标签信息
	app.get('/user/getUserBookTags', function(req, res) {
		if (req.session.user == null)
			return res.send({
				success: false
			});
		var userid = req.session.user._id;
		User.getUserBookTags(userid, function(err, user) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.json(user);
		});
	});
	// 删除已经存在的标签关系
	app.post('/user/deleteUserBooksTag', function(req, res) {
		var tags = req.body.tags;
		var userid = req.session.user._id;
		var bookid = req.body.bookid;
		User.deleteUserBooksTag(userid, bookid, tags, function(err, user) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true
				});
		});
	});
	// 查看书籍的所有评价
	app.get('/book/viewBookAppraises', function(req, res) {
		var bookid = req.query.bookid;
		var page = req.query.page ? req.query.page : 1;
		var pageSize = settings.bookPage.viewBookAppraisesPageSize;
		BookDao.viewBookAppraises(bookid, page, pageSize, function(err, books_) {
			if (err)
				return res.send({
					success: false
				});
			return res.json(books_);
		});
	});
	// 添加书籍评论
	app.post('/user/addBookAppraise', function(req, res) {
		var bookid = req.body.bookid;
		var appraiseTitle = req.body.appraiseTitle;
		var appraise = req.body.appraise;
		var userid = req.session.user._id;
		User.addBookAppraise(userid, bookid, appraise, appraiseTitle, function(err, user_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true
				});
		});
	});
	// 获取书籍的评论信息
	app.post('/book/getBookAppraise', function(req, res) {
		var bookid = req.body.bookid;
		BookDao.getBookAppraise(bookid, function(err, book_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.json(book_);
		});
	});
	// 上传头像
	app.post('/user/uploadAvatars', function(req, res) {
		var fileToUpload = req.files.fileToUpload;
		var file = {};
		file.filetype = fileToUpload.type;
		file.filesize = fileToUpload.size;
		var userid = req.session.user._id;
		var filename = String(Math.random()).substring(2) + '.' + fileToUpload.name.substring(fileToUpload.name.lastIndexOf('.') + 1);
		var target_path = './public/upload/user/images/avatar/' + filename;
		file.filepath = '/upload/user/images/avatar/';
		file.filename = filename;
		var tmp_path = fileToUpload.path;
		// 移动文件
		fs.rename(tmp_path, target_path, function(err) {
			User.uploadUserAvatars(userid, file, function(err_, r) {
				if (err_)
					return res.send({
						success: false
					});
				else
					return res.send({
						success: true,
						url: file.filepath,
						filename: filename,
						imgid: r
					});
			});
		});
	});
	// 设置用户头像的裁剪
	app.post('/user/setUserAvatarCut', function(req, res) {
		var imgid = req.body.imgid;
		var originalImg = req.body.originalImg;
		User.setUserAvatarCut(imgid, originalImg, function(err_, img) {
			if (err_)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true
				});
		});
	});
	// 获取用户的头像信息
	app.post('/user/getUserAvatar', function(req, res) {
		var userid = req.session.user._id;
		User.getUserAvatar(userid, function(err, user_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.json(user_);
		});
	});
	// 搜索书籍或者作者
	app.get('/server/searchBooks', function(req, res) {
		var searchName = req.query.searchName;
		// 单页条数
		var searchPageSize = settings.searchPageSize;
		if (searchName == null || searchName == '') {
			return res.render('searchBooksResult', {
				result: null,
				title: '图书查询结果',
				searchName: '',
				count: 0,
				searchPageSize: searchPageSize,
				page: 1
			});
		}
		var searchName_ = unescape(searchName);
		searchName_ = searchName_.replace(/^\s+|\s+$/g, '');
		// 页码
		var page = req.query.page ? Number(req.query.page) : 1;

		BookDao.searchBooks(searchName_, page, searchPageSize, function(err, count, books_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.render('searchBooksResult', {
					result: books_,
					title: '图书查询结果',
					searchName: searchName,
					count: count,
					searchPageSize: searchPageSize,
					page: page,
					layout: 'searchBooksOneResult searchBooksResult bookPage'
				});
		});
	});
	// 协作编辑导航页
	app.get('/cooperation/cooperateIndex', function(req, res) {
		if (req.session.user == null)
			return res.render('/login', {
				title: '登录'
			});
		else
			return res.render('cooperateIndex', {
				title: '共同协作,一起分享'
			});
	});
	// 协作编辑作者
	app.get('/cooperation/cooperateAuthors', function(req, res) {
		if (req.session.user == null)
			return res.render('notLogin', {
				title: '未登录状态'
			});
		else
			return res.render('cooperateAuthors', {
				title: '协作编辑作者信息',
				layout: 'cooperateAuthors cooperateSubmitOptions'
			});
	});

	app.get('/cooperation/cooperateAuthorsMainPage', function(req, res) {
		return res.render('cooperateAuthorsMainPage', {
			title: '用户编辑作者信息'
		});
	});
	// 编辑一个作者信息
	app.post('/cooperation/editOneAuthor', function(req, res) {
		var tempAuthor = {
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
			job: req.body.job,
			graduateSchool: req.body.graduateSchool,
			lastUpdateDate: new Date(),
			worth: req.body.worth,
			submitStatus: req.body.submitStatus ? req.body.submitStatus : 0,
			publicStatus: req.body.publicStatus ? req.body.publicStatus : 0,
			introduction: req.body.introduction
		};
		var user = req.session.user;
		if (user && user._id) {
			tempAuthor.editUser = user._id;
		}
		TempAuthorDao.addOrUpdateTempAuthorByUser(tempAuthor, function(err, tempAuthor_) {
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
	});

	// 获取用户编辑的作者简单信息
	app.get('/cooperation/getUserEditTempAuthors', function(req, res) {
		var userid = null;
		var user = req.session.user;
		if (user && user._id) {
			userid = user._id;
		}
		TempAuthorDao.getUserEditTempAuthors(userid, function(err, tempAuthors_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true,
					tempAuthors: tempAuthors_
				});
		});
	});
	// 获取用户板鞋的作者详细信息
	app.get('/cooperation/getUserEditTempAuthorsComplete', function(req, res) {
		var userid = null;
		var user = req.session.user;
		if (user && user._id) {
			userid = user._id;
		}
		TempAuthorDao.getUserEditTempAuthorsComplete(userid, function(err, tempAuthors_) {
			if (err)
				return res.send({
					success: false
				});
			else
				return res.send({
					success: true,
					tempAuthors: tempAuthors_
				});
		});
	});
	app.get('/cooperation/cooperateAuthorEdit/:tempAuthorId', function(req, res) {
		var tempAuthorId = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		TempAuthorDao.cooperateAuthorEdit(tempAuthorId, function(err, tempAuthor_) {
			if (err)
				res.render('cooperateAuthorEdit', {
					title: '编辑作者信息',
					success: 'false',
					layout: 'cooperateAuthorEdit cooperateSubmitOptions'
				});
			else
				res.render('cooperateAuthorEdit', {
					title: '编辑作者信息',
					success: 'true',
					tempAuthor: tempAuthor_,
					layout: 'cooperateAuthorEdit cooperateSubmitOptions'
				});
		});
	});
	app.get('/cooperation/cooperateAuthorPreview/:tempAuthorId', function(req, res) {
		var tempAuthorId = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		TempAuthorDao.cooperateAuthorEdit(tempAuthorId, function(err, tempAuthor_) {
			if (err)
				res.render('cooperateAuthorPreview', {
					title: '浏览作者信息',
					success: 'false',
					layout: 'cooperateAuthorPreview'
				});
			else
				res.render('cooperateAuthorPreview', {
					title: '浏览作者信息',
					success: 'true',
					tempAuthor: tempAuthor_,
					layout: 'cooperateAuthorPreview'
				});
		});
	});
	app.get('/cooperation/cooperateAuthorViewPublic/detail/:tempAuthorId', function(req, res) {
		var tempAuthorId = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		TempAuthorDao.cooperateAuthorEdit(tempAuthorId, function(err, tempAuthor_) {
			if (err)
				res.render('cooperateAuthorViewPublicInfos', {
					title: '浏览作者信息',
					success: 'false',
					layout: 'cooperateAuthorViewPublicInfos'
				});
			else
				res.render('cooperateAuthorViewPublicInfos', {
					title: '浏览作者信息',
					success: 'true',
					tempAuthor: tempAuthor_,
					layout: 'cooperateAuthorViewPublicInfos'
				});
		});
	});
	app.get('/cooperation/cooperateAuthorViewPublic/introduction/:tempAuthorId', function(req, res) {
		var tempAuthorId = req.originalUrl.substring(req.originalUrl.lastIndexOf('\/') + 1);
		TempAuthorDao.cooperateAuthorIntroduction(tempAuthorId, function(err, tempAuthor_) {
			if (err)
				res.render('cooperateAuthorViewPublic', {
					title: '浏览作者信息',
					success: 'false',
					layout: 'cooperateAuthorViewPublic'
				});
			else
				res.render('cooperateAuthorViewPublic', {
					title: '浏览作者信息',
					success: 'true',
					tempAuthor: tempAuthor_,
					layout: 'cooperateAuthorViewPublic'
				});
		});
	});
	app.get('/cooperation/cooperateCountNumberBoard', function(req, res) {
		res.render('cooperateCountNumberBoard', {
			title: '浏览编辑信息',
			layout: 'cooperateCountNumberBoard'
		});
	});
	app.get('/losePwd', function(req, res) {
		res.render('losePwd', {
			title: '密码找回',
			layout: 'losePwd'
		});
	});
	app.get('/losePwdReset', function(req, res) {
		res.render('losePwdReset', {
			title: '密码重置',
			layout: 'losePwdReset'
		});
	});
	app.get('/cooperation/:path', function(req, res) {
		var path = getRequestMethod(req);
		res.render(path, {
			title: '',
			layout: path
		});
	});
	app.get('/login/:path', function(req, res) {
		var path = getRequestMethod(req);
		res.render(path, {
			title: '',
			layout: path
		});
	});
	app.post('/search/:path', function(req, res) {
		var path = getRequestMethod(req);
		if (path === 'searchAuthornameSimple') {
			var searchName = req.body.searchName;
			AuthorDao.searchAuthornameSimple(searchName, function(err, authors_) {
				if (err)
					return res.json({
						'success': false
					});
				else
					return res.json({
						'success': true,
						'authors': authors_
					});
			});
		}
	});
	app.get('/sys/:path', function(req, res) {
		var path = getRequestMethod(req);
		res.render('sys/' + path, {
			title: '',
			layout: 'sys/' + path
		});
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
};