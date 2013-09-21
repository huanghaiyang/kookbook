(function() {
	$.fn.modalDialogReg = function(options) {
		var defaults = {};
		var $opts = $.extend({}, defaults, options);
		var $mask = $('.modal-reg-bg');
		var $main = $('.modal-reg-main-bg');
		var $height = $main.height();
		var $width = $main.width();
		var $top = $main.offset().top;
		var $left = $main.offset().left;
		$main.css({
			'top': ($(window).height() - $height) / 2 + 'px',
			'left': ($(window).width() - $width) / 2 + 'px'
		});
		$('.modal-reg-title-close').bind('click', function() {
			m.hide(300);
		});
		$('#modal-reg-cancel').bind('click', function() {
			m.hide(300);
		});
		var init_ = function() {};
		var ModalDialogReg_ = function() {};
		ModalDialogReg_.prototype.show = function() {
			$main.show(300);
			$mask.show(300);
		};
		ModalDialogReg_.prototype.hide = function() {
			$main.hide(300);
			$mask.hide(300);
		};
		var m = new ModalDialogReg_();
		m.hide();
		return m;
	};
})(jQuery);