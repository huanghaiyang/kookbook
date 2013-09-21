$.ajax({
	type: 'get',
	url: "/cooperation/getUserEditTempAuthorsComplete",
	datatype: "json",
	timeout: 6000,
	success: function(result, state, req) {
		if (result.success == true) {
			var tempAuthors = result.tempAuthors;
			for (var i = 0; i < tempAuthors.length; i++) {
				var t = tempAuthors[i];
				if (t.submitStatus == 1) {
					var $oneNav = createOneNav(t, false);
					appendOneNav('author-submitedBox', $oneNav);
				} else if (t.submitStatus == 2) {
					var $oneNav = createOneNav(t, false);
					appendOneNav('author-usedBox', $oneNav);
				} else if (t.submitStatus == 0) {
					var $oneNav = createOneNav(t, true);
					appendOneNav('author-unSubmitBox', $oneNav);
				}
				if (t.publcStatus == 0) {
					var $oneNav = createOneNav(t, true);
					appendOneNav('author-unPublicBox', $oneNav);
				} else if (t.publcStatus == 1) {
					var $oneNav = createOneNav(t, true);
					appendOneNav('author-publicBox', $oneNav);
				}
			}
			collapseAll();
		}
	},
	falture: function(result, state, req) {
		console.log('操作失败!');
	}
});
var appendOneNav = function(id, oneNav) {
	if ($('#' + id).children('.navs').length === 0) {
		$('#' + id).append($('<div class="navs"></div>'));
	}
	$('#' + id).children('.navs').append(oneNav);
}
var createOneNav = function(t, editable) {
	var $oneNav = $('<div class="one-nav"></div>');
	var $oneNaviii = $('<div class="nav-i nav-iii"></div>');
	var $oneNavSpan = $('<span class="one-nav-title-text"></span>');
	var $intro = $('<a class="a-m" title="简式预览" href="/cooperation/cooperateAuthorViewPublic/introduction/' + t._id + '"><i class="icon-eye-open icon-blue-dark"></i></a>');
	var $pre = $('<a class="a-m" title="列表式预览" href="/cooperation/cooperateAuthorPreview/' + t._id + '"><i class="icon-list icon-blue-dark"></i></a>');
	var $eid = $('<a class="a-m" href="/cooperation/cooperateAuthorEdit/' + t._id + '" title="编辑"><i class="icon-edit icon-blue-dark"></i></a>');
	$oneNavSpan.append($('<span>' + t.chinesename + '</span>'));
	$oneNavSpan.append($intro);
	$oneNavSpan.append($pre);
	if (editable === true)
		$oneNavSpan.append($eid);
	$oneNaviii.append($oneNavSpan);
	$oneNav.append($oneNaviii);
	return $oneNav;
};
var collapseAll = function() {
	$('#author-submitedBox').children('.navs').css({
		'display': 'none'
	});
	$('#author-usedBox').children('.navs').css({
		'display': 'none'
	});
	$('#author-unSubmitBox').children('.navs').css({
		'display': 'none'
	});
	$('#author-unPublicBox').children('.navs').css({
		'display': 'none'
	});
	$('#author-publicBox').children('.navs').css({
		'display': 'none'
	});
};