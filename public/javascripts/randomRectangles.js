(function($) {
	$.fn.randomRectangles = function(options) {
		var defaults = {
			designateColors: [],
			useDesignateColors: false,
			width: 150,
			height: 200,
			minHeight: 150,
			minWidth: 100,
			maxHeight: 200,
			maxWidth: 150,
			containsNumbers: 100,
			rectangleCls: 's',
			minZindex: 1,
			maxZindex: 100,
			zIndexidentical: false,
			zIndex: 1
		};
		var $opts = $.extend({}, defaults, options);
		var $t = $(this);
		var getRandomColor = function() {
			if ($opts.useDesignateColors === true)
				return Math.designateColors[Math.floor(Math.random() * $opts.designateColors.length)];
			else
				return '#' +
					(function(color) {
					return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
				})('');
		};
		var Size = function(width, height) {
			this.width = width ? width : null;
			this.height = height ? height : null;
		};
		var Point = function(top, left) {
			this.top = top ? top : null;
			this.left = left ? left : null;
		};
		var getInterval = function(begin, end) {
			if (begin === end)
				return begin;
			else
				return Math.floor(Math.random() * (end - begin)) + begin;
		};
		var getRandomSize = function(size) {
			return (function(size_) {
				if (!size_)
					size_ = new Size();
				if (!size_.width)
					size_.width = getInterval($opts.maxWidth, $opts.minWidth);
				if (!size_.height)
					size_.height = getInterval($opts.maxHeight, $opts.minHeight);
				return size_;
			})(size);
		};
		var getRandomShapePoint = function(top, left, width, height) {
			return new Point(getInterval(top + height, top), getInterval(left + width, left));
		};
		var getZindexForShape = function() {
			if ($opts.zIndexidentical === true)
				return $opts.zIndex;
			else
				return getInterval($opts.maxZindex, $opts.minZindex);
		};
		var UniqueIdFactory = function() {
			var i = 0;
			return {
				getId: function() {
					i++;
					return 'f_' + i;
				}
			};
		};
		var unique = new UniqueIdFactory();
		var Rectangle = function() {
			this.size = null;
			this.color = '';
			this.point = null;
		};
		Rectangle.newInstance = function() {
			var r = new Rectangle();
			r.size = getRandomSize();
			r.color = getRandomColor();
			r.point = getRandomShapePoint($top, $left, $width, $height);
			r.zIndex = getZindexForShape();
			return r;
		};
		Rectangle.getTemplate = function() {
			return '<div id="' + unique.getId() + '"style="height:$(size.height)px;width:$(size.width)px;position:absolute;top:$(point.top)px;left:$(point.left)px;background-color:$(color);z-index:$(zIndex);" class="' + $opts.rectangleCls + '"></div>';
		};
		Rectangle.newShape = function() {
			var instance = Rectangle.newInstance();
			var reg = /\$\(\w+\)|\$\(\w+\.\w+\)/ig;
			var template = Rectangle.getTemplate();
			var match = template.match(reg);
			for (var i = 0; i < match.length; i++) {
				var val = null;
				var att = match[i].replace('\$\(', '').replace('\)', '');
				if (att.indexOf('\.') !== -1) {
					var arr = att.split('\.');
					val = instance[arr[0]][arr[1]];
				} else
					val = instance[att];
				if (val)
					template = template.replace(match[i], val);
			};
			return $(template);
		};
		var $height = $t.height() - $opts.maxHeight;
		var $width = $t.width() - $opts.maxWidth;
		var $top = $t.offset().top;
		var $left = $t.offset().left;
		for (var i = 0; i < $opts.containsNumbers; i++) {
			$t.append(Rectangle.newShape());
		}
		var RandomRectangles = function() {};
		RandomRectangles.prototype.getStatus = function() {
			return 'complete';
		};
		var rec = new RandomRectangles();
		return rec;
	};
})(jQuery);