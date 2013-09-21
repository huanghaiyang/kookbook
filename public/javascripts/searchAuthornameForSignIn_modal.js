(function() {
	$.fn.searchAuthornameModal = function(options) {
		var defaults = {};
		var $opts = $.extend({}, defaults, options);
		var bg = $('.modal-search-authorname-bg');
		var div = $('.search-authorname-div');
		var resetPosition = function() {
			var $height = div.height();
			if ($(window).height() - $height <= 50)
				return;
			var $width = div.width();
			div.css({
				'top': ($(window).height() - $height) / 2 + 'px',
				'left': ($(window).width() - $width) / 2 + 'px'
			});
		};
		resetPosition();
		var hideBg = function() {
			bg.hide();
		};
		var showBg = function() {
			bg.show();
		};
		var hideContainer = function() {
			div.hide();
		};
		var showContainer = function() {
			div.show();
		};
		$('.close-').click(function() {
			hideBg();
			hideContainer();
		});
		var searchAuthornameModal = function() {};
		searchAuthornameModal.hide = function() {
			hideBg();
			hideContainer();
		};
		searchAuthornameModal.show = function() {
			showBg();
			showContainer();
		};
		searchAuthornameModal.resetPosition = function() {
			resetPosition();
		};
		return searchAuthornameModal;
	};
})(jQuery);