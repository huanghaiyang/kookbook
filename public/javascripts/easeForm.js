(function() {
	$.fn.easeForm = function(options) {
		var defaults = {};
		var $opts = $.extend({}, defaults, options);
		$(this).each(function() {
			var $t = $(this);
			$t.bind('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				var $info = $t.next('.ease-form-control-info');
				if ($info.css('display') === 'block')
					return;
				var $infot = $info.children('.ease-form-control-info-t');
				$info.css({
					'display': 'block',
					'height': "0px",
					'width': '0px'
				});
				$info.animate({
					'width': '390px',
					'height': '50px'
				}, 0, function() {
					$infot.animate({
						'opacity': '1'
					}, 400);
				});
			});
		});
		$('.ease-form-control-info-img').each(function() {
			$e = $(this);
			$e.click(function() {
				var $p = $(this).parent().parent();
				$p.slideUp(0, function() {
					$p.hide();
				});
			});
		});
	};
})(jQuery);