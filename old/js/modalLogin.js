(function($){
	$.fn.modalLoginWindow = function(options){
		options = $.extend({
            windowClassName: "z_login_modal_window" , 
            width:"" , 
            height:"" , 
            renderId : "",
            topMargin : 0 ,
            logininfo : "用户名或密码不正确,请重新填写!"
        }, options);
		return this.each(function(){
			var elem = $(this) ; 
			var top = 0 ; 
			var left = 0 ;
			var width = options.width ? options.width : 270 ; 
			var height = options.height ? options.height : 160 ; 
			var renderElem = options.renderId ? $("#" + options.renderId) : null ; 
			if(renderElem)
				elem = renderElem ; 
			top = elem.offset().top + elem.height() + options.topMargin ; 
			if(elem.offset().left + width > $(document).width())
				left = elem.offset().left + elem.width() - width ;
			else
				left = elem.offset().left ;
			var modalWindow = $("<div class=\""+ options.windowClassName +"\"></div>") ; 
			$('body').append(modalWindow) ; 
			modalWindow.css({
				width:width , 
				height:height , 
				top : top , 
				left : left , 
				display:'none'
			}) ; 

			modalWindow.append('<form id="login">'
				+'<h1>登陆</h1>'
				+'<fieldset id="inputs">'
				+'<input id="username" type="text" placeholder="用户名" autofocus required>'
				+'<input id="password" type="password" placeholder="密码" required>'
				+'</fieldset>'
				+'<fieldset id="actions">'
				+'<input type="submit" id="submit" value="登陆">'
				+'<a href="">忘记密码?</a>'
				+'<a href="">注册</a>'
				+'</fieldset>'
				+'</form>') ; 
			var toggleClick = 0 ; 
			elem.bind("click" , function(event){
				if(toggleClick == 0)
					modalWindow.slideDown(100 , function(){
						toggleClick ++ ; 
					}) ; 
				else
					modalWindow.slideUp(100 , function(){
						toggleClick = 0 ; 
					}) ; 
			});
		}) ; 
	}

})(jQuery);