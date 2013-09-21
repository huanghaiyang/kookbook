(function() {
	$.fn.nvaMenu = function(options) {
		var defaults = {
			arrowRotate: true
		};
		var $opts = $.extend({}, defaults, options);
		$(this).each(function(i, nav) {
			var $nav = $(nav);
			$nav.children('.navs').css({
				'display': 'none'
			});
			var $item = $nav.children('.nav-i');
			var $more = $item.children('.one-nav-title-more');
			var $t = null;
			$item.bind('mouseover', function(ev) {
				if ($opts.arrowRotate === false)
					return;
				if ($nav.attr('data-expanded') === 'true')
					return;
				$item.addClass('nav-active');
				var r = 0;
				$t = setInterval(function() {
					$more.css({
						'transform': ' rotate(' + parseInt(r + 90) + 'deg)'
					});
					r += 90;
				}, 200);
			});
			$item.bind('mouseout', function(ev) {
				if ($opts.arrowRotate === false)
					return;
				if ($nav.attr('data-expanded') === 'true')
					return;
				$item.removeClass('nav-active');
				if ($t !== null)
					clearInterval($t);
				$more.css({
					'transform': ' rotate(0deg)'
				});
			});
			$item.bind('click', function(ev) {
				if ($nav.attr('data-expanded') === 'true') {
					$nav.attr('data-expanded', false);
					if ($t !== null)
						clearInterval($t);
					$more.css({
						'transform': ' rotate(0deg)'
					});
					$nav.children('.navs').css({
						'display': 'none'
					});
					$item.removeClass('nav-active');
				} else {
					$nav.attr('data-expanded', true);
					if ($t !== null)
						clearInterval($t);
					$more.css({
						'transform': ' rotate(90deg)'
					});
					$nav.children('.navs').css({
						'display': ''
					});
					$item.addClass('nav-active');
				}
			});
		});
	};
})(jQuery);