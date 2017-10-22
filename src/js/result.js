;(function() {
	"use strict"
	var _fly = function() {
		var staticCard = $(".card-static").css("left", "-100%");
		var fly = $(".card-fly").css("left", "50%");
		setTimeout(function() {
			staticCard.css("transition-property", "none").css("left", "150%")
				.addClass("card-fly").removeClass("card-static");
			fly.css("transition-property", "none").css("left", "")
				.removeClass("card-fly").addClass("card-static");
		}, 500);
	}

	if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
		$("button").addClass("button-ios");
	$(window).on('load', function() {
		setTimeout(function() {
			$(".main-frame").css("opacity", "0.95");
			setTimeout(function() {
				$(".word").removeClass("word");
				$(".progress").css("width", "33.3%");
			}, 200);
		}, 500);
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
		var a = time_cmp(now, [2017, 10, 28, 12, 0, 0]);
		var b = time_cmp(now, [2017, 11, 12, 0, 0, 0]);
		if (b >= 0) {
			$(".card-static .progress-frame").css("display", "none");
			$(".card-static .form-submit").css("display", "none");
			$(".card-static .main-info").css("display", "none");
			$(".card-static h3").html("查询已结束");
			$(".card-static .form-body").html('<div class="form-error">'+
				'<div class="error-text">很遗憾，本次结果查询服务已经结束了，记得下次早点来哦୧(﹒︠ᴗ﹒︡)୨</div>'+
			'</div>');
			return;
		} else if (a < 0) {
			// $(".card-static .progress-frame").css("display", "none");
			// $(".card-static .form-submit").css("display", "none");
			// $(".card-static .main-info").css("display", "none");
			// $(".card-static h3").html("查询未开始");
			// $(".card-static .form-body").html('<div class="form-error">'+
			// 	'<div class="error-text">结果查询服务还未开始，开始时间是2017年10月28日中午12点哦୧(﹒︠ᴗ﹒︡)୨</div>'+
			// '</div>');
			// return;
		}
		$("form [name=tel]").on('input', function() {
			$(this.parentNode).removeClass("wrong").find(".info-tip").html("");
		});
		var loading = false;
		$(".card-static form").submit(function() {
			if (loading)
				return;
			if (!/^1[0-9]{10}$/.test($("form [name=tel]").val())) {
				$("form [name=tel]").parent(".form-info").addClass("wrong")
				.find(".info-tip").html("检查一下你的手机号哦");
				return;
			}
			$.post("./api/feedback.php", $(".card-static form").serialize()).done(function(d) {
				switch (d.err) {
					case 500:
						return alert("网络错误，请稍后再试");
					case 400:
						return alert("没有检索到报名记录哦，请检查输入的信息是否正确><");
					case 404:
						$(".card-fly h3").html("匹配失败");
						$(".card-fly .main-info").css("display", "none");
						$(".card-fly .form-body").html($("#t-error-404").html());
						break;
					case 0:
						d.data.grade = ["大一", "大二", "大三", "大四", "研一", "研二", "研三"][d.data.grade-1];
						Object.keys(d.data).forEach(function(i) {
							$("[data-name="+i+"] .info-input").html(d.data[i]);
						});
						break;
					default:
						return alert("未知错误");
				}
				_fly();
			}).fail(function() {
				alert("网络错误，请稍后再试");
			});
		});
	});
})();