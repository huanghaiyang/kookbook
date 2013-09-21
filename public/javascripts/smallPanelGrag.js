(function($) {
	'use strict';
	$.fn.smallPanelGrag = function(options) {
		var defaults = {
			verticalMoved: true,
			horizontallyMoved: true,
			shorten: 0.01
		};
		var $t = $(this);
		var $opts = $.extend({}, defaults, options);

		var Point = function(x, y) {
			this.x = x ? x : null;
			this.y = y ? y : null;
		};
		var ObjectPanel = function(leftTop, rightTop, leftBottom, rightBottom) {
			this.leftTop = leftTop ? leftTop : null;
			this.rightTop = rightTop ? rightTop : null;
			this.leftBottom = leftBottom ? leftBottom : null;
			this.rightBottom = rightBottom ? rightBottom : null;
			this.panelIndex = null;
		};
		ObjectPanel.createObjectPanel = function(ele) {
			var o = new ObjectPanel();
			o.leftTop = new Point(ele.offset().left, ele.offset().top);
			o.leftBottom = new Point(ele.offset().left, ele.offset().top + ele.height());
			o.rightTop = new Point(ele.offset().left + ele.width(), ele.offset().top);
			o.rightBottom = new Point(ele.offset().left + ele.width(), ele.offset().top + ele.height());
			o.panelIndex = ele.attr('id');
			return o;
		};
		var Collision = function() {
			this.objectPanels = new Array();
		};
		Collision.prototype.addOneObjectPanel = function(ele) {
			this.objectPanels.push(ObjectPanel.createObjectPanel(ele));
		};
		Collision.prototype.removeOneObjectPanel = function(index) {
			for (var i = 0; i < this.objectPanels.length; i++) {
				if (this.objectPanels[i].panelIndex === index)
					this.objectPanels.splice(i, 1);
			}
		};
		Collision.checkCollision = function(p1, p2) {
			var area = {
				leftTop: p1.leftTop,
				rightTop: p1.rightTop,
				leftBottom: p1.leftBottom,
				rightBottom: p1.rightBottom
			};
			if (Collision.isPointInArea(p2.leftTop, area) || Collision.isPointInArea(p2.rightTop, area) || Collision.isPointInArea(p2.leftBottom, area) || Collision.isPointInArea(p2.rightBottom, area)) {
				return true;
			} else
				return false;
		};
		Collision.isPointInArea = function(point, area) {
			if (point.x >= area.leftTop.x && point.x <= area.rightTop.x && point.y >= area.leftTop.y && point.y <= area.leftBottom.y)
				return true;
			else
				return false;
		};
		var collision = new Collision();
		var index = 0;
		$t.each(function(index, item) {
			item = $(item);

			item.attr('data-panel-index', index);
			item.attr('id', 'panel_' + index);
			index++;
			collision.addOneObjectPanel(item);

			var $ptop = item.parent().offset().top;
			var $pleft = item.parent().offset().left;

			item.bind('mousedown', function(ev) {
				if (!item.attr('data-ghost')) {
					var $height = item.height();
					var $width = item.width();
					var $top = item.offset().top;
					var $left = item.offset().left;

					var $occupied = $('<div></div>');
					$occupied.attr('class', 'occupied-item');
					$occupied.attr('id', 'tempPanel');
					$occupied.css({
						'height': $height + 'px',
						'width': $width + 'px',
						'top': $top - $ptop + 'px',
						'left': $left - $pleft + 'px',
						'position': 'absolute'
					});
					$occupied.insertBefore(item);
					collision.addOneObjectPanel($occupied);
					$occupied.addClass('item-active');

					var shortened = $width * $opts.shorten;
					item.addClass('ghost-panel-shadow');
					item.css({
						'width': $width - shortened + 'px',
						'border': '1px dashed #e4e4e4',
						'top': $top - item.parent().offset().top + 'px'
					});
					item.animate({
						'left': $left + shortened / 2 - $pleft + 'px'
					}, 100);
					collision.removeOneObjectPanel(item.attr('id'));
					item.attr('data-ghost', true);
					item.removeAttr('id');
				}
				var moveSteps = 0;
				setCursor($(document), 'pointer');
				var ofY = ev.pageY - $top;
				var ofX = ev.pageX - $left;
				$(document).bind('mousemove', function(evDoc) {
					moveSteps++;
					setCursor(item, 'move');
					var y_ = evDoc.pageY;
					var x_ = evDoc.pageX;
					if ($opts.horizontallyMoved === true)
						item.css({
							'left': x_ - ofX - $pleft + 'px'
						});
					if ($opts.verticalMoved === true)
						item.css({
							'top': y_ - ofY - $ptop + 'px'
						});
					var $num = 0;
					if (moveSteps >= 5) {
						for (var i = 0; i < collision.objectPanels.length; i++) {
							if (Collision.checkCollision(collision.objectPanels[i], ObjectPanel.createObjectPanel(item))) {
								$('#' + collision.objectPanels[i].panelIndex).css({
									'border': ''
								});
								$('#' + collision.objectPanels[i].panelIndex).addClass('item-active');
								$num++;
							}
						}
						for (var i = 0; i < collision.objectPanels.length; i++) {
							if (!Collision.checkCollision(collision.objectPanels[i], ObjectPanel.createObjectPanel(item))) {
								$('#' + collision.objectPanels[i].panelIndex).removeClass('item-active');
							}
						}
						moveSteps = 0;
					}
					if ($num === 0) {
						if ($('.item-active').length === 0) {
							$('#tempPanel').addClass('item-active');
						}
					}
				});
			});
			item.mouseup(function(ev) {
				$(document).unbind('mousemove');
				var flag = false;
				for (var i = 0; i < collision.objectPanels.length; i++) {
					var $item = $('#' + collision.objectPanels[i].panelIndex);
					if ($item.hasClass('item-active')) {
						flag = true;
						var $height = $item.height();
						var $width = $item.width();
						var $top = $item.offset().top;
						var $left = $item.offset().left;

						item.animate({
							'top': $top - $ptop + 'px',
							'left': $left - $pleft + 'px',
							'width': $width + 'px'
						}, 100, function() {
							item.removeClass('ghost-panel-shadow');
							item.attr('id', 'panel_' + item.attr('data-panel-index'));
							item.removeAttr('data-ghost');
							collision.addOneObjectPanel(item);
							setCursor(item, 'default');
						});

						var $occupied = $('.occupied-item');
						var $otop = $occupied.offset().top;
						var $oleft = $occupied.offset().left;

						if ($item.attr('id') === 'tempPanel')
							$item.remove();
						else
							$item.animate({
								'top': $otop - $ptop + 'px',
								'left': $oleft - $pleft + 'px'
							}, 100, function() {
								$occupied.remove();
								for (var i = 0; i < collision.objectPanels.length; i++) {
									if (collision.objectPanels[i].panelIndex === $item.attr('id')) {
										collision.objectPanels[i] = ObjectPanel.createObjectPanel($item);
									}
								}
							});
						break;
					}
				}
				for (var i = 0; i < $('.item-active').length; i = 0)
					$($('.item-active')[i]).removeClass('item-active');
			});
		});
		var setCursor = function(i, c) {
			i.css({
				'cursor': c
			});
		};
	};
})(jQuery);