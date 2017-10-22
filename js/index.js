;(function() {
	"use strict"
	var submit = (function() {
		var _submit;
		$("form").submit(function() {
			if (_submit)
				_submit();
		});
		return function(e) {
			_submit = e;
		}
	})();
	var cancel = (function() {
		var _cancel;
		var startX, startY;
		$("body").on("touchstart", function(e) {
		    startX = e.originalEvent.changedTouches[0].pageX;
		    startY = e.originalEvent.changedTouches[0].pageY;
		});
		$("body").on("touchend", function(e) {
		    var moveEndX = e.originalEvent.changedTouches[0].pageX;
		    var moveEndY = e.originalEvent.changedTouches[0].pageY;
		    var X = moveEndX - startX;
		    var Y = moveEndY - startY;
		    if ( Math.abs(X) > Math.abs(Y) && X > 50 ) {
		        if (_cancel)
					_cancel();
		    }
		});
		return function(e) {
			_cancel = e;
		}
	})();

	var _fly = function(iscancel) {
		if (iscancel) {
			var fly = $(".card-fly").css("transition-property", "none")
				.css("visibility", "").css("left", "-50%");
			var staticCard = $(".card-static").css("transition-property", "")
				.css("visibility", "").css("left", "100%");
			setTimeout(function() {
				fly.css("transition-property", "").css("left", "50%");
			}, 50);
			setTimeout(function() {
				staticCard.css("transition-property", "none").css("left", "150%")
					.addClass("card-fly").removeClass("card-static");
				fly.css("transition-property", "none").css("left", "")
					.removeClass("card-fly").addClass("card-static");
			}, 500);
		} else {
			var staticCard = $(".card-static").css("transition-property", "")
				.css("visibility", "").css("left", "-100%");
			var fly = $(".card-fly").css("transition-property", "")
				.css("visibility", "").css("left", "50%");
			setTimeout(function() {
				staticCard.css("transition-property", "none").css("left", "150%")
					.addClass("card-fly").removeClass("card-static");
				fly.css("transition-property", "none").css("left", "")
					.removeClass("card-fly").addClass("card-static");
			}, 500);
		}
	}

	var FormInfo = {
		preinit: function(nonext) {
			setTimeout(function() {
				$(".main-frame").css("opacity", "0.95");
				setTimeout(function() {
					$(".word").removeClass("word");
					$(".progress").css("width", "33.3%");
				}, 200);
			}, 1000);
			if (!nonext)
				FormInfo.init();
		},
		init: function(step) {
			FormInfo.step = step || 1;
			FormInfo.load(step ? null : $(".card-static"));
			submit(function() {
				var staticCard = $(".card-static");
				var frame = $(".card-fly");
				switch (FormInfo.step) {
					case 1: {
						if (!/^1[0-9]{10}$/.test(staticCard.find("form [name=tel]").val())) {
							staticCard.find("form [name=tel]").parent(".form-info").addClass("wrong")
							.find(".info-tip").html("检查一下你的手机号哦");
							return;
						}
						Submit.save();
						FormInfo.step = 2;
						FormInfo.load();
						_fly();
						$(".card-fly .progress").css("width", "66.6%");
						break;
					}
					case 2: {
						Submit.save();
						Like.init();
						break;
					}
				}
			});
			cancel(function() {
				if (FormInfo.step == 2) {
					FormInfo.step = 1;
					$(".card-fly .progress").css("width", "33.3%");
					FormInfo.load();
					_fly(true);
				}
			});
		},
		load: function(frame) {
			frame = frame || $(".card-fly");
			switch (FormInfo.step) {
				case 1: {
					frame.find(".main-body h3").html("报名信息");
					frame.find(".main-info").html("届时将凭以下信息查询配对结果哦");
					frame.find(".form-submit button").html("下一步");
					FormInfo.render([
						{ name: "name", title: "姓名", value: Submit.name },
						{ name: "tel", title: "手机", value: Submit.tel }
					], frame);
					break;
				}
				case 2: {
					frame.find(".main-body h3").html("其他信息");
					frame.find(".main-info").html("以下信息将被告知你的配对者哦");
					frame.find(".form-submit button").html("下一步");
					FormInfo.render([
						{ name: "gender", title: "性别", select: ["", "男", "女"], value: Submit.gender },
						{ name: "school", title: "学校", select: ["",
							"华南理工大学南校",  "华南理工大学北校",
							"中山大学",  "华南师范大学",
							"广东工业大学",  "广东外语外贸大学",
							"广州中医药大学",  "广东药学院",
							"广州大学",  "广州美术学院", "星海音乐学院"
						], value: Submit.school },
						{ name: "college", title: "学院", value: Submit.college },
						{ name: "grade", title: "年级", select: ["",
							"大一", "大二", "大三", "大四" 
						], value: Submit.grade },
						{ name: "wechat", title: "微信 选填", required: false, value: Submit.wechat }
					]);
					frame.find("form [name=wechat]")
						.parent(".form-info").find(".info-tip").css("left", "89px");
					break;
				}
			} 
		},
		render: function(obj, frame) {
			var frame = frame || $(".card-fly");
			var target = frame.find(".form-body").html("");
			obj.forEach(function(item) {
				if (item.select) {
					var select = '<select class="info-input" name="'+item.name+'">';
					item.select.forEach(function(e) {
						select += '<option value="'+e+'">'+e+'</option>';
					});
					select += '</select>';
				}
				$('<div class="form-info">'+
					'<span class="info-title">'+item.title+'</span>'+
					(item.select ? select : '<input class="info-input" name="'+item.name+'">')+
					'<span class="info-tip"></span>'+
				'</div>').appendTo(target)
				.find(".info-input").attr("required", item.required===false?null:true)
				.on('input', function() {
					$(this.parentNode).removeClass("wrong").find(".info-tip").html("");
				})
				.val(item.value);
			});
			target.find(".info-title").on('click', function() {
				$(this.parentNode).find(".info-input").focus();
			});
		}
	}

	var Like = {
		init: function() {
			$(".card-fly .progress").css("width", "100%");
			var frame = $(".card-fly");
			frame.find(".main-body h3").html("爱好类型");
			frame.find(".main-info").css("display", "").html("你将与拥有共同爱好的人配对哦");
			$(".card-fly .form-submit").css("display", "")
				.find("button").html("提交");
			frame.find(".form-body").html($("#t-form-like").html())
			.find("a").click(function() {
				Game.init();
			});
			_fly();
			submit(function() {
				$(".card-fly .progress").css("width", "100%");
				Submit.save();
				Submit.submit();
			});
			cancel(function() {
				FormInfo.init(2);
				_fly(true);
			});
		}
	}

	var Game = {
		init: function() {
			Game.r = [];
			Game.id = 0;
			Game.load();
			_fly();
			submit();
			cancel(function() {
				if (Game.id) {
					Game.id --;
					Game.load();
					_fly(true);
				} else {
					Like.init();
					_fly(true);
				}
			});
		},
		load: function() {
			var frame = $(".card-fly");
			$(".card-fly .progress").css("width", (100/8*Game.id)+"%");
			frame.find(".main-info").css("display", "none");
			$(".card-fly .form-submit").css("display", "none");
			Game.render();
		},
		render: function() {
			var frame = $(".card-fly");
			frame.find(".main-body h3").html("测试<small>"+(Game.id+1)+"/8</small>");
			var obj = Game.data[Game.id];
			var options = '<div class="game-options">';
			var i = 0;
			var ii = "ABCDEFG";
			obj.options.forEach(function(option) {
				options += '<div data-type="'+option.type+'">'+
					'<span class="quesmark">'+ii[i]+'</span>'+
					(option.text.indexOf("img")==-1?('<span class="questext">'+option.text+'</span>'):option.text)+
				'</div><br>';
				i ++;
			});
			options += '</div>';
			var loading = false;
			frame.find(".form-body").html('<div class="form-game">'+
				'<div class="game-title">'+obj.title+'</div>'+
				options +
			'</div>').find(".game-options>div").each(function() {
				$(this).click(function() {
					if (loading)
						return;
					loading = true;
					Game.r[Game.id] = this.dataset.type;
					(function(target) {
						$(target.parentNode).find(">div").each(function() {
							if (this != target)
								$(this).css("opacity", "0");
						})
					})(this);
					setTimeout(function() {
						if (Game.id < 7) {
							Game.id ++;
							$(".card-fly .form-submit").css("display", "none");
							Game.load();
							_fly();
						} else {
							$(".card-fly .progress").css("width", "100%");
							Game.Result.init();
						}
						loading = false;
					}, 500);
				});
			});
		},
		data: [
			{ title: "你最希望拥有的一件电影里的东西是什么", options: [
				{ text: "多啦a梦的口袋", type: "动画" }, { text: "憨豆先生的甲壳虫汽车", type: "喜剧爱情" },
				{ text: "钢铁侠的铠甲", type: "科幻动作" }, { text: "侦探福尔摩斯的烟斗", type: "惊悚悬疑" }
			] },
			{ title: "你在周末会选择那种娱乐方式？", options: [
				{ text: "坐过山车", type: "动画" }, { text: "海边漫步", type: "喜剧爱情" },
				{ text: "桌游", type: "科幻动作" }, { text: "密室逃脱", type: "惊悚悬疑" }
			] },
			{ title: "你最想成为以下哪部电影的主角", options: [
				{ text: "金刚狼", type: "科幻动作" }, { text: "神偷奶爸", type: "动画" },
				{ text: "爱乐之城", type: "喜剧爱情" }, { text: "嫌疑人X的献身", type: "惊悚悬疑" }
			] },
			{ title: "一部影片中的男主和女主走到了一起，你觉得怎样的经历更加浪漫", options: [
				{ text: "男主穿越时光爱上女主", type: "科幻动作" }, { text: "男主帮助女主逃离了地狱", type: "惊悚悬疑" },
				{ text: "两人青梅竹马，分分合合终于走到一起", type: "喜剧爱情" }, { text: "像童话故事中王子和公主相遇那么美好", type: "动画" }
			] },
			{ title: "如果有一个机会穿越到以下场景，你最想去哪一个？", options: [
				{ text: '<div class="quesimg" style="background-image: url(./img/quesimg/2.jpg);"></div>', type: "动画" },
				{ text: '<div class="quesimg" style="background-image: url(./img/quesimg/1.jpg);"></div>', type: "科幻动作" },
				{ text: '<div class="quesimg" style="background-image: url(./img/quesimg/4.jpg);"></div>', type: "喜剧爱情" },
				{ text: '<div class="quesimg" style="background-image: url(./img/quesimg/3.jpg);"></div>', type: "惊悚悬疑" }
			] },
			{ title: "你希望收到以下哪个生日礼物？", options: [
				{ text: "名侦探柯南卡通手办", type: "动画" }, { text: "速度与激情同款汽车模型", type: "科幻动作" },
				{ text: "美女与野兽手机壳", type: "喜剧爱情" }, { text: "东野圭吾的小说", type: "惊悚悬疑" }
			] },
			{ title: "你希望娃娃机里放的是什么玩偶？", options: [
				{ text: "蜘蛛侠", type: "科幻动作" }, { text: "小黄人", type: "动画" },
				{ text: "小怪物", type: "惊悚悬疑" }, { text: "布朗熊", type: "喜剧爱情" }
			] },
			{ title: "如果你有一个空闲的下午，你会选择在华工的哪个地方消遣时间？", options: [
				{ text: "图书馆", type: "惊悚悬疑" }, { text: "宿舍 ", type: "动画" },
				{ text: "咖啡厅 ", type: "喜剧爱情" }, { text: "体育场", type: "科幻动作" }
			] }
		],
		Result: {
			init: function() {
				var frame = $(".card-fly");
				frame.find(".main-info").css("display", "").html("不满意结果可以点击重新选择哦");
				$(".card-fly .form-submit").css("display", "")
					.find("button").html("提交");
				frame.find(".form-submit").css("display", "");
				frame.find(".main-body h3").html("测试结果");
				var list = ["喜剧爱情", "惊悚悬疑", "科幻动作", "动画", "剧情"];
				var max = 0;
				var result = [];
				Game.r.forEach(function(e) {
					if (!Game[e])
						Game[e] = 1;
					else
						Game[e] ++;
				});
				list.forEach(function(e) {
					if (Game[e]) {
						if (Game[e] == max)
							result.push(e);
						else if (Game[e] > max) {
							max = Game[e];
							result = [e];
						}
					}
				});
				result = result[Math.floor(Math.random()*result.length)];
				frame.find(".form-body").html($("#t-form-result").html()).find("[name=like]").val(result);
				_fly();
				submit(function() {
					Submit.save();
					Submit.submit();
				});
				cancel();
			}
		}
	}

	var Submit = {
		save: function() {
			$(".card-static form [name]").each(function() {
				Submit[this.name] = this.value;
			});
		},
		submit: function() {
			if (Submit.loading)
				return;
			Submit.loading = true;
			Submit.button = $(".card-static button").html();
			$(".card-static button").html("提交中...");
			$.post("./api/upload.php", {
				name: Submit.name,
				gender: Submit.gender,
				school: Submit.school,
				college: Submit.college,
				grade: {"大一":1,"大二":2,"大三":3,"大四":4}[Submit.grade],
				tel: Submit.tel,
				wechat: Submit.wechat,
				like: Submit.like,
			}).done(function(d) {
				if (d.err) {
					Submit.loading = false;
					$(".card-static button").html(Submit.button);
					return alert(d.msg);
				}
				else {
					submit();
					End.init();
				}
			}).fail(function() {
				Submit.loading = false;
				$(".card-static button").html(Submit.button);
				alert("网络异常");
			});
		}
	}

	var End = {
		init: function() {
			var frame = $(".card-fly");
			frame.find(".main-info").css("display", "none");
			frame.find(".progress-frame").css("display", "none");
			frame.find(".form-submit").css("display", "");
			frame.find(".form-submit button").html("领取印花");
			frame.find(".main-body h3").html("提交成功");
			frame.find(".form-body").html($("#t-form-end").html());
			_fly();
			submit(function() {
				location.href = eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('"3://4.2.0/1/8/9/7?5=6"',10,10,'cn|wechat_bbt|withcic|https|100steps|get|duiduipeng|addPrize|Home|Vote'.split('|'),0,{}));
			});
			cancel();
		}
	}

	if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
		$("button").addClass("button-ios");
	$(window).on('load', function() {
		var time_cmp = function(now, time) {
			var cmp = function(a, b) {
				if (a > b) return 1;
				if (a < b) return -1;
				return 0;
			}
			var t;
			if (t = cmp(now.getFullYear(), time[0]))
				return t;
			if (t = cmp(now.getMonth()+1, time[1]))
				return t;
			if (t = cmp(now.getDate(), time[2]))
				return t;
			if (t = cmp(now.getHours(), time[3]))
				return t;
			if (t = cmp(now.getMinutes(), time[4]))
				return t;
			if (t = cmp(now.getSeconds(), time[5]))
				return t;
			return 0;
		}
		var now = new Date();
		var a = time_cmp(now, [2017, 10, 24, 0, 0]);
		var b = time_cmp(now, [2017, 10, 27, 0, 0]);
		if (a >= 0 && b < 0)
			FormInfo.preinit();
		else {
			if (b >= 0) {
				FormInfo.preinit(true);
				$(".card-static .progress-frame").css("display", "none");
				$(".card-static .form-submit").css("display", "none");
				$(".card-static .main-info").css("display", "none");
				$(".card-static h3").html("报名已结束");
				$(".card-static .form-body").html('<div class="form-error">'+
					'<div class="error-text">很遗憾，本次报名已经结束了，下次早点来吧୧(﹒︠ᴗ﹒︡)୨</div>'+
				'</div>');
			} else {
				FormInfo.preinit();
			}
		}
	});
})();