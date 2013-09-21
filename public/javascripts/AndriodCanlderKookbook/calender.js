(function($) {
	$.fn.AndriodCanlderKookbook = function(options) {
		var defaults = {
			currentYear: parseInt(new Date().getFullYear()) - 10,
			currentMonth: 12,
			currentDay: 31,
			yearGap: 7,
			monthGap: 7,
			dayGap: 7,
			containerDiv: null,
			containerCls: 'default-container',
			inputRenderMarginLeft: 10,
			inputRender: '',
			timeItemMarginPx: 2,
			timeItemCls: 'time-item',
			timeActiveCls: 'time-item-sel',
			timeControlCls: 'time-sel',
			insertMoreNumber: 10,
			formatStr: '-',
			timeNumberAutoComplete: true,
			activeTime: true,
			modal: true
		};
		var $opts = $.extend({}, defaults, options);
		var $ele = null;
		if ($opts.containerDiv == null || $opts.containerDiv == '' || $opts.containerDiv == undefined) {
			$ele = $('<div></div>');
			$ele.attr('class', $opts.containerCls);
		} else {
			if (typeof $opts.containerDiv === 'string')
				$ele = $('#' + $opts.containerDiv);
			else if (typeof $opts.containerDiv === 'object' && $opts.containerDiv instanceof HTMLElement)
				$ele = $($opts.containerDiv);
			if ($ele.attr('class') === '')
				$ele.attr('class', $opts.containerCls);
		}
		var $input = null;
		if ($opts.inputRender)
			$input = $('#' + $opts.inputRender);
		if ($input) {
			var $eleTop = $input.offset().top;
			var $eleLeft = $input.offset().left + $input.width() + parseInt($opts.inputRenderMarginLeft, 10);
			if ($ele) {
				$ele.css({
					'top': $eleTop + 'px',
					'left': $eleLeft + 'px'
				});
				$('body').append($ele);
			}
		}
		var Canlender = function() {};
		//判断是否是闰年
		var isLeapYear = function(iYear) {
			if (iYear % 4 == 0 && iYear % 100 != 0) {
				return true;
			} else {
				if (iYear % 400 == 0) {
					return true;
				} else {
					return false;
				}
			}
		}
		var applyTimeControls = function() {
			var $eleWidth = $ele.width();
			var $eleHeight = $ele.height();
			var $elePaddingTop = parseInt($ele.css('paddingTop').replace('px', ''), 10);
			var $elePaddingLeft = parseInt($ele.css('paddingLeft').replace('px', ''), 10);
			var $elePaddingRight = parseInt($ele.css('paddingRight').replace('px', ''), 10);
			var $elePaddingBottom = parseInt($ele.css('paddingBottom').replace('px', ''), 10);
			var $innerWidth = $eleWidth - $elePaddingRight - $elePaddingLeft;
			var $innerHeight = $eleHeight - $elePaddingBottom - $elePaddingTop;
			// each time-control's padding-left or padding-right is 10 px ,default controls number is 3 
			var $controlWidth = $innerWidth - parseInt($opts.timeItemMarginPx) * 2;
			var operateItems = function($chromeTimes) {
				var $loading = $chromeTimes.children('.loading');
				$loading.css({
					'display': 'block'
				});
				var $number = createMorePreOrNextTime($chromeTimes, 'up');
				scrollControlInnerUp($chromeTimes, $number + 1);
				$loading.css({
					'display': 'none'
				});
				return $number;
			}
			for (var i = 0; i < 3; i++) {
				var $control = $('<div></div>');
				$control.attr('class', $opts.timeControlCls);
				$control.css({
					'height': $innerHeight + 'px',
					'width': $controlWidth / 3 + 'px',
					'lineHeight': $innerHeight + 'px',
				});
				if (i < 2)
					$control.css({
						'marginRight': $opts.timeItemMarginPx + 'px'
					});
				else
					$control.css({
						'marginRight': '0px'
					});
				$control.bind('mousedown', function(e) {
					var $t = $(this);
					$t.css("cursor", "move");
					var $chromeTimes = $($t.children().get(0));
					var $period = getTimeWhenArry($($chromeTimes.children().get(0))).period;
					var y = e.pageY - parseInt($chromeTimes.css('top'));
					$(document).bind("mousemove", function(ev) {
						var $lessTop = (parseInt($chromeTimes.css('top')) - 20 >= 0);
						var $overBottom = $chromeTimes.height() + parseInt($chromeTimes.css('top')) < $chromeTimes.parent().height();
						if ($lessTop) {
							$(document).unbind("mousemove");
							var $f = operateItems($chromeTimes);
							if ($f === 0)
								$chromeTimes.stop().animate({
									'top': "0px"
								}, {
									queue: false,
									duration: 600,
									easing: 'easeOutBounce'
								});
							$(document).bind("mousemove");
						} else {
							if ($overBottom) {
								var $f = createMorePreOrNextTime($chromeTimes, 'down');
								if ($f > 0) {
									var _y = ev.pageY - y;
									$chromeTimes.css({
										'top': _y + "px"
									});
								} else {
									$chromeTimes.stop().animate({
										'top': parseInt($chromeTimes.css('top')) + $overBottom + "px"
									}, {
										queue: false,
										duration: 600,
										easing: 'easeOutBounce'
									});
									$(document).unbind("mousemove");
									$chromeTimes.stop().animate({
										'top': $chromeTimes.parent().height() - $chromeTimes.height() + "px"
									}, {
										queue: false,
										duration: 600,
										easing: 'easeOutBounce'
									});
								}
							} else {
								var _y = ev.pageY - y;
								$chromeTimes.css({
									'top': _y + "px"
								});
							}
						}
					});
					$(document).mouseup(function() {
						$t.css("cursor", "default");
						$(this).unbind("mousemove");
					})
				});
				$control.mousewheel(function(event, delta, deltaX, deltaY) {
					event.preventDefault();
					event.stopPropagation();
					var $t = $(this);
					var $chromeTimes = $($t.children().get(0));
					var $period = getTimeWhenArry($($chromeTimes.children().get(0))).period;
					if (delta > 0) {
						var $lessTop = (parseInt($chromeTimes.css('top')) - 20 >= 0);
						if ($lessTop) {
							var $f = operateItems($chromeTimes);
							if ($f === 0)
								$chromeTimes.stop().animate({
									'top': 0 + "px"
								}, {
									queue: false,
									duration: 600,
									easing: 'easeOutBounce'
								});
						} else {
							if ($period !== 'year' && $lessTop)
								return;
							$chromeTimes.css({
								'top': parseInt($chromeTimes.css('top')) + Math.abs(delta) * 10 + "px"
							});
						}

					} else if (delta < 0) {
						var $overBottom = $chromeTimes.height() + parseInt($chromeTimes.css('top')) < $chromeTimes.parent().height();
						if ($overBottom) {
							if ($period !== 'year' && checkInsertComplete($chromeTimes, $period))
								$chromeTimes.stop().animate({
									'top': $chromeTimes.parent().height() - $chromeTimes.height() + "px"
								}, {
									queue: false,
									duration: 600,
									easing: 'easeOutBounce'
								});
							else
								createMorePreOrNextTime($chromeTimes, 'down');
						} else {
							$chromeTimes.css({
								'top': parseInt($chromeTimes.css('top')) - Math.abs(delta) * 30 + "px"
							});
						}
					}
				});
				$ele.append($control);
				var timeType = '';
				if (i == 0)
					timeType = 'year';
				else if (i == 1)
					timeType = 'month';
				else if (i == 2)
					timeType = 'day';
				applyTimeItems($control, timeType);
				var $controlInner = $($control.children().get(0));
				createMorePreOrNextTime($controlInner, 'down');
				var $upNumber = createMorePreOrNextTime($controlInner, 'up');
				scrollControlInnerUp($controlInner, $upNumber + 1);
				if (timeType === 'month' || timeType === 'day') {
					if (parseInt($controlInner.css('top')) !== 0) {
						$controlInner.css({
							'top': '0px'
						});
					}
				}
				var $loading = $('<div class="loading">loading...</div>');
				$loading.css({
					'lineHeight': $control.height() + 'px'
				});
				$control.append($loading);
			}
		};
		var scrollControlInnerUp = function(controlInner, number) {
			number = number || $opts.insertMoreNumber;
			var $eachItemHeight = getTimeItemFactHeight($(controlInner.children().get(0)));
			var $totalRiseHeight = $eachItemHeight * number;
			controlInner.css({
				'top': -$totalRiseHeight + parseInt(controlInner.css('top')) + 'px'
			});
		}
		var getTimeItemFactHeight = function(item) {
			var $height = item.height();
			var $marginTop = parseInt(item.css('marginTop').replace('px', ''));
			var $marginBottom = parseInt(item.css('marginBottom').replace('px', ''));
			return $height + $marginBottom + $marginTop;
		}
		var insertBeforeTimeItem = function(item, timeType, p, seq) {
			if (timeType === 'month' || timeType === 'day') {
				if (seq < 1)
					return false;
			}
			item.attr('data-when', timeType + '_' + seq);
			item.text(seq);
			item.insertBefore(p);
			return true;
		};
		var checkMonth = function(m) {
			m = parseInt(m);
			if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12)
				return 'full';
			else if (m === 4 || m === 6 || m === 9 || m === 11)
				return 'less';
			else if (m === 2)
				return '2';
		};
		var checkInsertComplete = function($chromeTimes, $period) {
			var leapMonth = function(f) {
				if (Time.month) {
					if (checkMonth(Time.month) === 'full') {
						if ($length === 31)
							return true;
						else
							return false;
					} else if (checkMonth(Time.month) === 'less') {
						if ($length === 30)
							return true;
						else
							return false;
					} else if (checkMonth(Time.month) === '2') {
						if (f === true) {
							if ($length === 28)
								return true;
							else
								return false;
						}
					} else {
						if ($length === 29)
							return true;
						else
							return false;
					}
				} else {
					if ($length === 31)
						return true;
					else
						return false;
				}
			};
			var $length = $chromeTimes.children().length;
			if ($period === 'month') {
				if ($length === 12)
					return true;
				else
					return false;
			} else if ($period === 'day') {
				if (Time.year) {
					if (isLeapYear(Time.year)) {
						return leapMonth(true);
					} else {
						return leapMonth(false);
					}
				} else {
					if ($length === 31)
						return true;
					else
						return false;
				}
			}

		};
		var insertAfterTimeItem = function(item, timeType, n, seq) {
			if (timeType === 'month') {
				if (seq > 12)
					return false;
			}
			var $selectMonth = Time.monthItem;
			var $n = 31;
			if ($selectMonth) {
				var $o = getTimeWhenArry($selectMonth);
				if (checkMonth($o.time) === 'full')
					$n = 31;
				else if (checkMonth($o.time) === 'less')
					$n = 30;
				else if (checkMonth($o.time) === '2')
					if (Time.year && isLeapYear(Time.year) === true) {
						$n = 28;
					} else
						$n = 29;
			}
			if (timeType === 'day') {
				if (seq > $n)
					return false;
			}
			item.attr('data-when', timeType + '_' + seq);
			item.text(seq);
			item.insertAfter(n);
			return true;
		};
		var Time = {
			year: null,
			month: null,
			day: null,
			isExistAll: false,
			checkAllExsist: function() {
				if (this.year != null && typeof this.year === 'number' && this.month != null && typeof this.month === 'number' && this.day != null && typeof this.day === 'number') {
					this.isExistAll = true;
					return true;
				} else {
					this.isExistAll = false;
					return false;
				}
			},
			getFormattedTime: function() {
				var m = this.month;
				var d = this.day;
				if ($opts.timeNumberAutoComplete === true) {
					m = m < 10 ? '0' + m : m;
					d = d < 10 ? '0' + d : d;
				}
				return this.year + $opts.formatStr + m + $opts.formatStr + d;
			},
			yearItem: null,
			monthItem: null,
			dayItem: null
		};
		var getTimeWhenArry = function(item) {
			if (!item)
				return;
			var arry = item.attr('data-when').split('_');
			return {
				period: arry[0],
				time: parseInt(arry[1], 10)
			}
		};

		var applyTimeItems = function(control, timeType) {
			var $eachTime = $('<div></div>');
			var $eachWidth = control.width();
			$eachTime.css({
				'width': $eachWidth + 'px'
			});
			$eachTime.attr('class', $opts.timeItemCls);
			var $eachHeight;
			var $gap = 0;
			var $current = 0;
			if (timeType === 'year') {
				$gap = $opts.yearGap;
				$current = $opts.currentYear;
				Time.year = $opts.currentYear;
			} else if (timeType === 'month') {
				$gap = $opts.monthGap;
				$current = $opts.currentMonth;
				Time.month = $opts.currentMonth;
			} else if (timeType === 'day') {
				$gap = $opts.dayGap;
				$current = $opts.currentDay;
				Time.day = $opts.currentDay;
			}
			$eachTime.text($current);
			$eachTime.attr('data-when', timeType + '_' + $current);
			$eachHeight = (control.height() - $opts.timeItemMarginPx * ($gap - 1)) / $gap;
			$eachTime.css({
				'height': $eachHeight + 'px',
				'lineHeight': $eachHeight + 'px'
			});
			if (timeType === 'year') {
				Time.yearItem = $eachTime;
			} else if (timeType === 'month') {
				Time.monthItem = $eachTime;
			} else if (timeType === 'day') {
				Time.dayItem = $eachTime;
			}
			var changeDays = function() {
				var $dayCotrol = control.parent().children('div:last');
				var $dayChrome = $($dayCotrol.children().get(0));
				var $itemLength = getTimeWhenArry($($dayChrome.children('div:last'))).time;
				var $o = getTimeWhenArry(Time.monthItem);
				if (!$o)
					return;
				if (checkMonth($o.time) === 'full') {
					if ($itemLength < 31) {
						for (var i = $itemLength + 1; i <= 31; i++) {
							var $last = $dayChrome.children('div:last');
							var $i = $dayChrome.children('div:last').clone(true).removeClass($opts.timeActiveCls);
							insertAfterTimeItem($i, 'day', $last, i);
						}
					}
				} else if (checkMonth($o.time) === 'less') {
					if ($itemLength > 30) {
						for (var i = 0; i < $itemLength - 30; i++)
							$dayChrome.children('div:last').remove();
					}
				} else if (checkMonth($o.time) === '2') {
					if (Time.year && isLeapYear(Time.year)) {
						if ($itemLength >= 29) {
							for (var i = 0; i < $itemLength - 28; i++)
								$dayChrome.children('div:last').remove();
						}
					} else {
						if ($itemLength === 28) {
							var $last = $dayChrome.children('div:last');
							var $i = $dayChrome.children('div:last').clone(true).removeClass($opts.timeActiveCls);
							insertAfterTimeItem($i, 'day', $last, 29);
						} else if ($itemLength > 29) {
							for (var i = 0; i < $itemLength - 29; i++)
								$dayChrome.children('div:last').remove();
						}
					}
				}
			};
			$eachTime.bind('click', function(event) {
				$t = $(this);
				var $o = getTimeWhenArry($t);
				if ($o.period === 'year') {
					Time.year = $o.time;
					if (Time.yearItem)
						Time.yearItem.removeClass($opts.timeActiveCls);
					$t.addClass($opts.timeActiveCls);
					Time.yearItem = $t;
					changeDays();
				} else if ($o.period === 'month') {
					Time.month = $o.time;
					if (Time.monthItem)
						Time.monthItem.removeClass($opts.timeActiveCls);
					$t.addClass($opts.timeActiveCls);
					Time.monthItem = $t;
					changeDays();
				} else if ($o.period === 'day') {
					Time.day = $o.time;
					if (Time.dayItem)
						Time.dayItem.removeClass($opts.timeActiveCls);
					$t.addClass($opts.timeActiveCls);
					Time.dayItem = $t;
				}
				if (Time.checkAllExsist() === true)
					$input.val(Time.getFormattedTime());
			});
			var $chromeTimes = $('<div class="time-float"></div>');
			$chromeTimes.append($eachTime);
			control.append($chromeTimes);
			var $pre = $eachTime;
			var $next = $eachTime;
			for (var i = $current - 1; i >= $current - ($gap - 1) / 2; i--) {
				var $t = $eachTime.clone(true);
				insertBeforeTimeItem($t, timeType, $pre, i);
				$pre = $t;
			}
			for (var i = $current + 1; i <= $current + ($gap - 1) / 2; i++) {
				var $t = $eachTime.clone(true);
				insertAfterTimeItem($t, timeType, $next, i);
				$next = $t;
			}
			if ($opts.activeTime === true)
				$eachTime.addClass($opts.timeActiveCls);
		};

		var createMorePreOrNextTime = function(p, upOrDown) {
			var $current = 0;
			var timeType = getTimeWhenArry($(p.children().get(0))).period;
			if (timeType === 'year')
				$current = $opts.currentYear;
			else if (timeType === 'month')
				$current = $opts.currentMonth;
			else if (timeType === 'day')
				$current = $opts.currentDay;
			if (upOrDown === 'up') {
				var $pre = $(p.children().get(0));
				for (var i = 1; i <= $opts.insertMoreNumber; i++) {
					var $t = $pre.clone(true);
					if (insertBeforeTimeItem($t, timeType, $pre, getTimeWhenArry($pre).time - 1) === false)
						return i - 1;
					else
						$pre = $t;
				}
			}
			if (upOrDown === 'down') {
				var $next = $(p.children().get(p.children().length - 1));
				for (var i = 1; i <= $opts.insertMoreNumber; i++) {
					var $t = $next.clone(true);
					if (insertAfterTimeItem($t, timeType, $next, getTimeWhenArry($next).time + 1) === false)
						return i - 1;
					else
						$next = $t;
				}
			}
		};

		var setShow = function() {
			$ele.css({
				'display': 'block'
			});
			clickTimes = 1;
		};

		var setHide = function() {
			$ele.css({
				'display': 'none'
			});
			clickTimes = 0;
		};
		var clickTimes = 0;
		$input.bind('click', function(event) {
			if (clickTimes === 0) {
				setShow();
			} else {
				setHide();
			}
		});
		Canlender.prototype.show = function() {
			setShow();
		};
		Canlender.prototype.hide = function() {
			setHide();
		};
		Canlender.prototype.init = function() {
			if ($ele) {
				$ele.css({
					'display': 'none'
				});
				applyTimeControls();
			}

		};
		var $aCanlender = new Canlender();
		$aCanlender.init();
		return $aCanlender;
	}
})(jQuery);