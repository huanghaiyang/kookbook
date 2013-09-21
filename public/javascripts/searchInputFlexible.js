(function() {
	$.fn.searchInputFlexible = function(options) {
		var defaults = {
			flexWidth: 100,
			flexTime: 300,
			alertText: '请不要使用特殊字符进行查询，我们将会对其进行过滤!'
		};
		var $opts = $.extend({}, defaults, options);
		$(this).each(function(i, item) {
			var $item = $(item);
			var $count = 0;
			var $status = '';
			var $width = $item.width();
			$item.bind('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				if ($count === 0) {
					$count++;
					$item.animate({
						'width': $width + $opts.flexWidth + 'px'
					}, $opts.flexTime);
				} else {
					$count = 0;
					$item.animate({
						'width': $width + 'px'
					}, $opts.flexTime);
				}
			});
			$item.bind('keyup', function(e) {
				var $text = $item.val();
				if ($text !== '' && $text !== null) {
					var reg = new RegExp("[\\ ,\\。,\\`,\\~,\\!,\\@,\\#,\\$,\\%,\\^,\\+,\\*,\\&,\\\\,\\/,\\?,\\|,\\:,\\.,\\<,\\>,\\{,\\},\\(,\\),\\'',\\;,\\=,\"]", 'ig');
					var $matcher = $text.match(reg);
					if ($matcher && $matcher.length > 0) {
						$('.control-flex-tip-alert').css({
							'display': 'none'
						});
						$('.control-flex-tip-check').css({
							'display': 'none'
						});
						$('.control-flex-tip-error').css({
							'display': 'block'
						});
						$status = 'error';
						if ($('.control-flex-tip-c').css('display') === 'none')
							$('.control-flex-tip-c').fadeIn(100);
						var $tipText = "非法字符:";
						for (var k = 0; k < $matcher.length; k++) {
							$tipText += $matcher[k] + ' ';
						}
						$('.control-flex-tip-text').children('span').html($tipText);
					} else {
						$('.control-flex-tip-error').css({
							'display': 'none'
						});
						$('.control-flex-tip-alert').css({
							'display': 'none'
						});
						$('.control-flex-tip-check').css({
							'display': 'block'
						});
						$status = 'check';
						if ($('.control-flex-tip-c').css('display') === 'block')
							$('.control-flex-tip-c').fadeOut(100);
						$('.control-flex-tip-text').children('span').html('');
					}
				} else {
					$('.control-flex-tip-error').css({
						'display': 'none'
					});
					$('.control-flex-tip-alert').css({
						'display': 'block'
					});
					$('.control-flex-tip-check').css({
						'display': 'none'
					});
					$status = 'alert';
					$('.control-flex-tip-alert').mouseout();
				}
			});
			$(document).click(function() {
				if ($count === 1) {
					$count = 0;
					$item.animate({
						'width': $width + 'px'
					}, $opts.flexTime);
				}
			});
			$item.parent().children('.control-flex-tip').each(function(i, tip) {
				var $tipPersist = false;
				var $tip = $(tip);
				$tip.bind('mouseover', function() {
					if ($tip.hasClass('control-flex-tip-alert')) {
						$('.control-flex-tip-c').fadeIn(100);
						$('.control-flex-tip-text').children('span').html($opts.alertText);
					}
				});
				$tip.bind('mouseout', function() {
					if ($tip.hasClass('control-flex-tip-alert')) {
						if ($tipPersist === true)
							return;
						$('.control-flex-tip-c').fadeOut(100);
					}
				});
				$tip.bind('click', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					if ($status === 'error')
						return;
					if ($tipPersist === false) {
						$tipPersist = true;
						$('.control-flex-tip-c').fadeIn(100);
						$('.control-flex-tip-text').children('span').html($opts.alertText);
					} else {
						$('.control-flex-tip-c').fadeOut(100);
						$tipPersist = false;
					}
				});
			});
		});
	};
})(jQuery);