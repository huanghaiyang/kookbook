(function() {
	$.fn.countNumberBoard = function(options) {
		var defaults = {
			delimeter: ','
		};
		var $opts = $.extend({}, defaults, options);
		$(this).each(function(i, item) {
			var $item = $(item);
			var $number = $item.attr('data-board-number');
			if (!$number)
				return;
			$number = String($number).split('').reverse();
			for (var i = 0; i < $number.length; i++) {
				var $ltBoard = $('<div class="lt-board"></div>');
				$ltBoard.html($number[i]);
				if (i % 3 === 0 && i !== 0)
					$item.append('<div class="lt-de">' + $opts.delimeter + '</div>');
				$item.append($ltBoard);
			}
		});
	};
})(jQuery);