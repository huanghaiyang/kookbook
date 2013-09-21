(function() {
	$.fn.commonPageBar = function(options) {
		var defaults = {
			url: '',
			page: 1,
			key: '',
			pageSize: 10,
			count: 0,
			maxPage: 4
		};
		var $opts = $.extend({}, defaults, options);
		var num = Math.ceil($opts.count / $opts.pageSize);
		var $t = $(this);
		var CommonPageBar = function() {};
		CommonPageBar.redraw = function() {
			if ($opts.page > 1) {
				$t.append("<a class='pageP' data-page='" + ($opts.page - 1) + "'><前一页</a>");
			}
			if ($opts.page - $opts.maxPage > 1) {
				$t.append("<a class='pageP' data-page='" + ($opts.page - 5) + "'>┉</a>");
			}
			for (var i = $opts.page - $opts.maxPage; i < $opts.page; i++) {
				if (i <= 0)
					continue;
				if ($opts.page === i) {
					$t.append("<a class='pageSpanActive' data-page='" + i + "'>" + i + "</a>");
				} else {
					$t.append("<a class='pageSpan' data-page='" + i + "'>" + i + "</a>");
				}
			}
			for (var i = $opts.page; i <= $opts.page + $opts.maxPage; i++) {
				if (i > num)
					continue;
				if ($opts.page == i) {
					$t.append("<a class='pageSpanActive' data-page='" + i + "'>" + i + "</a>");
				} else {
					$t.append("<a class='pageSpan' data-page='" + i + "'>" + i + "</a>");
				}
			}
			if ($opts.page + $opts.maxPage < num) {
				$t.append("<a class='pageP' data-page='" + ($opts.page + 5) + "'>┉</a>");
			}
			if ($opts.page < num) {
				$t.append("<a class='pageB' data-page='" + ($opts.page + 1) + "'>后一页></a>");
			}
		};
		CommonPageBar.redraw();
		return CommonPageBar;
	};
})(jQuery);