function fileSelected() {
	var fileToUpload = document.getElementById('fileToUpload');
	if (fileToUpload.files.length > 1)
		return;
	var file = fileToUpload.files[0];
	if (file) {
		var fileSize = 0;
		if (file.size > 1024 * 1024)
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		else
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';

		document.getElementById('fileName').innerHTML = '名称: ' + file.name;
		document.getElementById('fileSize').innerHTML = '大小: ' + fileSize;
		if (filetypes[file.type.toLowerCase()]) {
			document.getElementById('fileType').style.color = 'green';
			document.getElementById('uploadBtn').style.display = 'block';
			document.getElementById('progressNumber').innerHTML = "";
		} else {
			document.getElementById('fileType').style.color = 'red';
			document.getElementById('uploadBtn').style.display = 'none';
		}
		document.getElementById('fileType').innerHTML = '类型: ' + file.type;
	}
}

// 允许上传的文件类型
var filetypes = {
	'image/jpeg': true,
	'image/gif': true,
	'image/png': true
};

function uploadFile() {
	var fd = new FormData();
	var file = document.getElementById('fileToUpload').files[0];
	// 文件类型不正确不能够提交
	if (!filetypes[file.type.toLowerCase()])
		return;
	fd.append("fileToUpload", file);
	var xhr = new XMLHttpRequest();
	xhr.upload.addEventListener("progress", uploadProgress, false);
	xhr.addEventListener("load", uploadComplete, false);
	xhr.addEventListener("error", uploadFailed, false);
	xhr.addEventListener("abort", uploadCanceled, false);
	xhr.open("POST", "/user/uploadAvatars");
	xhr.send(fd);
}

function uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	} else {
		document.getElementById('progressNumber').innerHTML = 'unable to compute';
	}
}

function uploadComplete(evt) {
	/* This event is raised when the server send back a response */
	var response = JSON.parse(evt.target.responseText);
	if (response.success == true) {
		document.getElementById('uploadBtn').style.display = 'none';
		document.getElementById('previewDiv').style.display = 'block';
		document.getElementById('imgid').value = response.imgid;
		var img = document.getElementById('previewImg');
		img.src = response.url + response.filename;
		if ($('#floatOverlay').length > 0)
			$('#floatOverlay').remove();
		var i = new Image();
		i.src = response.url + response.filename;
		var checkImg = setTimeout(function() {
			if (i.complete == true) {
				var width = i.width;
				var w_ = 0;
				if (width > 400)
					w_ = 400;
				else
					w_ = width;
				img.style.width = w_ + 'px';
				var height = i.height;
				if (width && height)
					document.getElementById('imgSize').innerHTML = width + 'x' + height;
				else
					document.getElementById('imgSize').innerHTML = '';
				var w = 0;
				if (img.clientWidth >= img.clientHeight)
					w = img.clientHeight;
				else
					w = img.clientWidth;
				// 移除mouseover事件
				$('#previewImg').unbind("mouseover");

				// 裁剪按钮绑定单击事件
				$('#cutBtn').bind('click', function() {
					var originalImg = {
						width: i.width <= i.height ? i.width : i.height,
						height: i.width <= i.height ? i.width : i.height,
						top: Math.floor(i.width >= i.height ? 0 : (i.height / $('#floatOverlay').height()) * ($('#floatOverlay').offset().top - $('#previewImg').offset().top)),
						left: Math.floor(i.width >= i.height ? (i.width / $('#floatOverlay').width()) * ($('#floatOverlay').offset().left - $('#previewImg').offset().left) : 0),
						oWidth: i.width,
						oHeight: i.height
					}
					$.ajax({
						type: 'post',
						data: {
							imgid: document.getElementById('imgid').value,
							originalImg: originalImg
						},
						url: "/user/setUserAvatarCut",
						datatype: "json",
						timeout: 6000,
						success: function(result, state, req) {
							if (result.success == false) {
								$('#msg').css({
									display: 'block',
									color: 'red'
								});
								$('#msg').html('<span color="red">服务器发生错误，请稍后重试!</span>');
							} else if (result.success == true) {
								$('#previewDiv').css({
									display: 'none'
								});
								$('#msg').css({
									display: 'block',
									color: 'green'
								});
								$('#msg').html('<span color="green">头像裁剪成功!</span>');
								if ($('#floatOverlay').length > 0)
									$('#floatOverlay').remove();
								getUserAvatar();
							}

						},
						falture: function(result, state, req) {
							console.log('操作失败!');
						}
					});
				});
				// 添加mouseover事件
				$('#previewImg').bind('mouseover', function() {
					if ($('#floatOverlay').length > 0)
						return;
					var overlay = $('<div></div>');
					overlay.attr('id', 'floatOverlay');
					overlay.css({
						width: w - 1,
						height: w - 1,
						position: 'absolute',
						top: $('#previewImg').offset().top,
						left: $('#previewImg').offset().left,
						border: '1px dashed #000000',
						backgroundColor: 'gray',
						opacity: '.5'
					});
					$('body').append(overlay);

					overlay.mousedown(function(e) //e鼠标事件  
						{
							$(this).css("cursor", "move"); //改变鼠标指针的形状  

							var offset = $(this).offset(); //DIV在页面的位置  
							var x = e.pageX - offset.left; //获得鼠标指针离DIV元素左边界的距离  
							var y = e.pageY - offset.top; //获得鼠标指针离DIV元素上边界的距离  
							$(document).bind("mousemove", function(ev) //绑定鼠标的移动事件，因为光标在DIV元素外面也要有效果，所以要用doucment的事件，而不用DIV元素的事件  
								{
									overlay.stop(); //加上这个之后  

									var _x = ev.pageX - x; //获得X轴方向移动的值  
									var _y = ev.pageY - y; //获得Y轴方向移动的值  
									var previewImg = $('#previewImg');
									// 控制鼠标的位置
									if (ev.pageX < previewImg.offset().left)
										return;
									if (ev.pageX > previewImg.offset().left + previewImg.width())
										return;
									if (ev.pageY < previewImg.offset().top)
										return;
									if (ev.pageY > previewImg.offset().top + previewImg.height())
										return;
									// 控制遮罩的位置
									if (overlay.offset().left < previewImg.offset().left) {
										overlay.css({
											left: previewImg.offset().left
										});
										return;
									}
									if (overlay.offset().left + overlay.width() > previewImg.offset().left + previewImg.width()) {
										overlay.css({
											left: previewImg.offset().left + previewImg.width() - overlay.width()
										});
										return;
									}
									if (overlay.offset().top < previewImg.offset().top) {
										overlay.css({
											top: previewImg.offset().top
										});
										return;
									}
									if (overlay.offset().top + overlay.height() > previewImg.offset().top + previewImg.height()) {
										overlay.css({
											top: previewImg.offset().top + previewImg.height() - overlay.height()
										});
										return;
									}
									// 移动遮罩
									if (previewImg.width() >= previewImg.height())
										overlay.animate({
											left: _x + "px"
										}, 10);
									else
										overlay.animate({
											top: _y + "px"
										}, 10);
								});
							$(document).mouseup(function() {
								overlay.css("cursor", "default");
								$(this).unbind("mousemove");
								var previewImg = $('#previewImg');
								// 重定位遮罩
								if (overlay.offset().left + overlay.width() > previewImg.offset().left + previewImg.width())
									overlay.css({
										left: previewImg.offset().left + previewImg.width() - overlay.width() - 1
									});
								if (overlay.offset().left < previewImg.offset().left)
									overlay.css({
										left: previewImg.offset().left
									});
								if (overlay.offset().top + overlay.height() > previewImg.offset().top + previewImg.height())
									overlay.css({
										top: previewImg.offset().top + previewImg.height() - overlay.height()
									});
								if (overlay.offset().top < previewImg.offset().top)
									overlay.css({
										top: previewImg.offset().top
									});
							})
						});
				});
				clearTimeout(checkImg);
			}
		}, 200);
	}
}

function uploadFailed(evt) {
	alert("上传过程中发生未知错误!");
}

function uploadCanceled(evt) {
	alert("上传文件已取消!");
}

var getUserAvatar = function() {
	$.ajax({
		type: 'post',
		data: {},
		url: "/user/getUserAvatar",
		datatype: "json",
		timeout: 6000,
		success: function(result, state, req) {
			if (result.success == false) {} else {
				var avatar = result.avatars[0];
				if (avatar) {
					$('#previewUserAvatar').attr('src', avatar.url + avatar.filename);
					if (avatar.cut.oWidth >= avatar.cut.oHeight)
						$('#previewUserAvatar').css({
							'left': -(100 / avatar.cut.oWidth * avatar.cut.left),
							'height': '100%',
							'width': '',
							'top': '0'
						});
					else
						$('#previewUserAvatar').css({
							'top': -(100 / avatar.cut.oHeight * avatar.cut.top),
							'width': '100%',
							'height:': '',
							'left': '0'
						});
				}
			}
		},
		falture: function(result, state, req) {
			console.log('操作失败!');
		}
	});
};
getUserAvatar();