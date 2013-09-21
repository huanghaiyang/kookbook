(function() {
	$.fn.modalDialogLogin = function(options) {
		var defaults = {};
		var $opts = $.extend({}, defaults, options);
		var $mask = $('.modal-login-bg');
		var $main = $('.modal-login-main-bg');
		var $height = $main.height();
		var $width = $main.width();
		var $top = $main.offset().top;
		var $left = $main.offset().left;
		$main.css({
			'top': ($(window).height() - $height) / 2 + 'px',
			'left': ($(window).width() - $width) / 2 + 'px'
		});
		$('.modal-login-title-close').bind('click',function(){
			m.hide(300);
		}) ; 
		$('#modal-login-cancel').bind('click',function(){
			m.hide(300);
		}) ; 
		var init_ = function() {};
		var ModalDialogLogin_ = function() {};
		ModalDialogLogin_.prototype.show = function() {
			$main.show(300);
			$mask.show(300);
		};
		ModalDialogLogin_.prototype.hide = function() {
			$main.hide(300);
			$mask.hide(300);
		};
		var m = new ModalDialogLogin_();
		m.hide();
		return m;
	};
})(jQuery);