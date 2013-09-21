var addEvent = function(el, evt, fn, bubble) {
	if ("addEventListener" in el) {
		// BBOS6 doesn't support handleEvent, catch and polyfill
		try {
			el.addEventListener(evt, fn, bubble);
		} catch (e) {
			if (typeof fn === "object" && fn.handleEvent) {
				el.addEventListener(evt, function(e) {
					// Bind fn as this and set first arg as event object
					fn.handleEvent.call(fn, e);
				}, bubble);
			} else {
				throw e;
			}
		}
	} else if ("attachEvent" in el) {
		// check if the callback is an object and contains handleEvent
		if (typeof fn === "object" && fn.handleEvent) {
			el.attachEvent("on" + evt, function() {
				// Bind fn as this
				fn.handleEvent.call(fn);
			});
		} else {
			el.attachEvent("on" + evt, fn);
		}
	}
}
addEvent(document.getElementById('want_btn'), 'click', setBookReadInfo, false);
addEvent(document.getElementById('now_btn'), 'click', setBookReadInfo, false);
addEvent(document.getElementById('already_btn'), 'click', setBookReadInfo, false);

function setBookReadInfo(e) {
	var evt = e || window.event;
	var t = evt.srcElement || evt.target;
	var bookid = document.getElementById('bookid').value;
	$.ajax({
		type: 'post',
		data: {
			bookid: bookid,
			which: t.getAttribute('sts')
		},
		url: "/user/setBooksReadInfo",
		datatype: "json",
		timeout: 6000,
		success: function(result, state, req) {
			window.location.reload();
		},
		falture: function(result, state, req) {
			console.log('操作失败!');
		}
	});
}
var getChildren = function(e) {
	if (e.children.length < 1) {
		throw new Error("The Nav container has no containing elements");
	}
	// Store all children in array
	var children = [];
	// Loop through children and store in array if child != TextNode
	for (var i = 0; i < e.children.length; i++) {
		if (e.children[i].nodeType === 1) {
			children.push(e.children[i]);
		}
	}
	return children;
}
var SetStarRate = (function(win, doc) {
	var win = win;
	var doc = doc;
	// 获取子元素

	function SetStarRate(el, options) {
		ele = el;
		if (!el)
			return;
		if (el.tagName.toLowerCase() === 'ul') {
			var children = getChildren(el);
			for (var i = 0; i < children.length; i++) {
				var li = children[i];
				var cs = getChildren(li);
				for (var j = 0; j < cs.length; j++) {
					var img = cs[j];
					if (img) {
						addEvent(img, 'mouseover', setFullStar, false);
						addEvent(img, 'mouseout', setEmptyStar, false);
						addEvent(img, 'click', setIncStar, false);
					}
				}
			}
		}
	}

	function setIncStar(e) {
		var evt = e || window.event;
		var img = evt.srcElement || evt.target;
		var rateNumber = img.getAttribute('data-rate-number');
		var bookid = document.getElementById('bookid').value;
		document.getElementById('loading_img_status').style.display = "inline-block";
		$.ajax({
			type: 'post',
			data: {
				bookid: bookid,
				star: parseInt(rateNumber) + 1,
				insertOrUpdate: document.getElementById('insertOrUpdate').value,
				oldStar: document.getElementById('book_ul_star').getAttribute('initStar') ? parseInt(document.getElementById('book_ul_star').getAttribute('initStar')) + 1 : 0
			},
			url: "/book/setIncStar",
			datatype: "json",
			timeout: 6000,
			success: function(result, state, req) {
				if (result.success = true) {
					setTimeout(function() {
						document.getElementById('loading_img_status').style.display = "none";
					}, 100);
					document.getElementById('star_text').innerHTML = img.title + '!';
					var book_ul_star = document.getElementById('book_ul_star').setAttribute('initStar', rateNumber);
					document.getElementById('insertOrUpdate').value = 'update';
				}
			},
			falture: function(result, state, req) {
				console.log('操作失败!');
			}
		});
	}

	function setFullStar(e) {
		var evt = e || window.event;
		var img = evt.srcElement || evt.target;
		var rateNumber = parseInt(img.getAttribute('data-rate-number'));

		for (var j = 0; j <= rateNumber; j++) {
			var img_ = img.parentNode.parentNode.children[j].children[0];
			if (img_)
				img_.src = imgs.rating_full;
		}
		for (var j = rateNumber + 1; j < img.parentNode.parentNode.children.length; j++) {
			var img_ = img.parentNode.parentNode.children[j].children[0];
			if (img_)
				img_.src = imgs.rating_empty;
		}
		document.getElementById('star_text').innerHTML = img.title;
	}

	function setEmptyStar(e) {
		var evt = e || window.event;
		var img = evt.srcElement || evt.target;
		for (var j = 0; j <= img.parentNode.parentNode.children.length; j++) {
			if (img.parentNode.parentNode.children[j]) {
				var img_ = img.parentNode.parentNode.children[j].children[0];
				if (img_)
					img_.src = imgs.rating_empty;
			}
		}
		setStarInit(parseInt(img.parentNode.parentNode.getAttribute('initStar')) + 1);
	}
	var _instance;
	var ele;

	function rn(el, options) {
		if (!_instance) {
			_instance = new SetStarRate(el, options);
		}
		return _instance;
	}
	return rn;
})(window, document);
new SetStarRate(document.getElementById("book_ul_star"));
$('#fav_book_a').fancybox({
	'opacity': true,
	'overlayShow': false,
	'autoScale': false,
	'transitionIn': 'fade',
	'transitionOut': 'fade',
	'centerOnScroll': true,
	'showCloseButton': false,
	'titlePosition': 'inside',
	'padding': '0px',
	'changeSpeed': 100
});
$('#fav_book_a_del').fancybox({
	'opacity': true,
	'overlayShow': false,
	'autoScale': false,
	'transitionIn': 'fade',
	'transitionOut': 'fade',
	'centerOnScroll': true,
	'showCloseButton': false,
	'titlePosition': 'inside',
	'padding': '0px',
	'changeSpeed': 100
});
$('#call_success_trigger').fancybox({
	'opacity': true,
	'overlayShow': false,
	'autoScale': false,
	'transitionIn': 'fade',
	'transitionOut': 'fade',
	'centerOnScroll': true,
	'showCloseButton': false,
	'titlePosition': 'inside',
	'padding': '0px',
	'changeSpeed': 100
});
$('#addBookAppraises_a').fancybox({
	'opacity': true,
	'overlayShow': false,
	'autoScale': false,
	'transitionIn': 'fade',
	'transitionOut': 'fade',
	'showCloseButton': false,
	'centerOnScroll': true,
	'titlePosition': 'inside',
	'padding': '0px',
	'changeSpeed': 100
});
if (document.getElementById('submit_btn'))
	addEvent(document.getElementById('submit_btn'), 'click', submitTag, false);
if (document.getElementById('cancel_btn'))
	addEvent(document.getElementById('cancel_btn'), 'click', cancelFancyBox, false);
if (document.getElementById('cancel_btn_'))
	addEvent(document.getElementById('cancel_btn_'), 'click', cancelFancyBox, false);
if (document.getElementById('delete_btn'))
	addEvent(document.getElementById('delete_btn'), 'click', deleteTags, false);
if (document.getElementById('cancel_Appraise'))
	addEvent(document.getElementById('cancel_Appraise'), 'click', cancelFancyBox, false);
if (document.getElementById('okAppraise'))
	addEvent(document.getElementById('okAppraise'), 'click', addBookAppraise, false);
// 提交标签信息

function submitTag() {
	var tagName = document.getElementById('tag_name');
	var bookid = document.getElementById('bookid').value;
	$.ajax({
		type: 'post',
		data: {
			bookid: bookid,
			tags: tagName.value
		},
		url: "/user/setUserBookTags",
		datatype: "json",
		timeout: 6000,
		success: function(result, state, req) {
			$('#call_success_trigger').click();
			setTimeout(function() {
				window.location.reload()
			}, 1000);
		},
		falture: function(result, state, req) {
			console.log('操作失败!');
		}
	});
}
// 为图书添加评价信息

function addBookAppraise() {
	var bookid = document.getElementById('bookid').value;
	$.ajax({
		type: 'post',
		data: {
			bookid: bookid,
			appraiseTitle: document.getElementById('appraiseTitle').value,
			appraise: document.getElementById('appraise').value
		},
		url: "/user/addBookAppraise",
		datatype: "json",
		timeout: 6000,
		success: function(result, state, req) {
			$('#call_success_trigger').click();
			setTimeout(function() {
				window.location.reload()
			}, 1000);
		},
		falture: function(result, state, req) {
			console.log('操作失败!');
		}
	});
}
// 关闭fancybox

function cancelFancyBox() {
	$.fancybox.close();
}

$.ajax({
	type: 'get',
	data: {},
	url: "/user/getUserBookTags",
	datatype: "json",
	timeout: 6000,
	success: function(result, state, req) {
		if (!result)
			return;
		if (result.success == false)
			return;
		var tags = result.tags;
		if (!tags)
			return;
		for (var i = 0; i < tags.length; i++) {
			var tag = tags[i];
			var bookids_ = tag.bookids;
			for (var j = 0; j < bookids_.length; j++) {
				var bookid_ = bookids_[j];
				if (bookid_ == document.getElementById('bookid').value) {
					var span = document.createElement('span');
					span.innerHTML = tag.name;
					span.className = "tag_one";
					document.getElementById('tag_me').appendChild(span);
					var del_tag = document.createElement('span');
					del_tag.innerHTML = tag.name;
					del_tag.setAttribute('tag-name', tag.name);
					del_tag.className = 'del_span_cls';
					del_tag.setAttribute('del-status', false);
					document.getElementById('delete_tag_c').appendChild(del_tag);
					addEvent(del_tag, 'click', setDelTag, false);
				}
			}
		}
	},
	falture: function(result, state, req) {
		console.log('操作失败!');
	}
});

$.ajax({
	type: 'post',
	data: {
		bookid: document.getElementById('bookid').value
	},
	url: "/book/getBookAppraise",
	datatype: "json",
	timeout: 6000,
	success: function(result, state, req) {
		if (result.success == false) {} else {
			var appraisePersons = result.appraisePersons;
			for (var i = 0; i < appraisePersons.length; i++) {
				var person = appraisePersons[i];
				createAppraiseRow(person);
			}
		}
	},
	falture: function(result, state, req) {
		console.log('操作失败!');
	}
});

function createAppraiseRow(person) {
	var name = person.name;
	var id = person._id;
	var star = person.star;
	var title = person.bookStar[0].title;
	var content = person.bookStar[0].content;
	var star = person.bookStar[0].star;

	var div_c = $('<div style="margin-top:10px;display:inline-block;width:100%;"></div>');
	var img_div = $('<div style="float:left;width:60;margin-right:10px;"></div>');
	div_c.append(img_div);
	var img = $('<img height=60 width=60 src="' + person.httpAvatar + '">');
	img_div.append(img);
	var user_div = $('<div style="float:right;width:92%;display:inline-block;"></div>');
	div_c.append(user_div);
	var user_div_title = $('<div style="width:100%;height:30px;background-color:#E6E3E2;line-height:30px;"></div>');
	user_div.append(user_div_title);
	var title_span = $('<span style="width:100%;font-size:14px;color:#3377aa;">' + title + '</span>');
	user_div_title.append(title_span);
	var user_name_span = $('<div style="width:100%"></div>');
	user_div.append(user_name_span);
	var user_name_a = $('<a href="/user/' + id + '">' + name + '</a>');
	user_name_span.append(user_name_a);
	if (person.signature) {
		var signature_span = $('<span style="margin-left:4px;fong-size:10px;">(' + person.signature + ')</span>');
		user_name_span.append(signature_span);
	}
	var content_div = $('<div style="width:100%;">' + content + '</div>');
	user_div.append(content_div);
	$('#appraiseMore').append(div_c);

}
// 设置标签的删除状态

function setDelTag(e) {
	var evt = e || window.event;
	var span = evt.srcElement || evt.target;
	if (span.getAttribute('del-status') == 'false') {
		span.className = "del_span_cls_";
		span.setAttribute('del-status', true);
	} else {
		span.className = "del_span_cls";
		span.setAttribute('del-status', false);
	}
}
// 删除已经存在的标签关系

function deleteTags() {
	var bookid = document.getElementById('bookid').value;
	var children = getChildren(document.getElementById('delete_tag_c'));
	var tags = "";
	for (var i = 0; i < children.length; i++) {
		if (children[i].tagName.toLowerCase() == 'span') {
			if (children[i].getAttribute('del-status') == 'true')
				tags += ',' + children[i].getAttribute('tag-name');
		}
	}
	$.ajax({
		type: 'post',
		data: {
			tags: tags,
			bookid: bookid
		},
		url: "/user/deleteUserBooksTag",
		datatype: "json",
		timeout: 6000,
		success: function(result, state, req) {
			if (result.success == true) {
				$('#call_success_trigger').click();
				setTimeout(function() {
					window.location.reload()
				}, 1000);
			}
		},
		falture: function(result, state, req) {
			console.log('操作失败!');
		}
	});
}