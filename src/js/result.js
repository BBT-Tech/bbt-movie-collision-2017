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

	$(window).on('load', function() {
		setTimeout(function() {
			$(".main-frame").css("opacity", "0.95");
			setTimeout(function() {
				$(".word").removeClass("word");
				$(".progress").css("width", "33.3%");
			}, 200);
		}, 500);
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
						$(".card-fly .form-body").html($("#t-error-404").html());
						break;
					case 0:
						d.data.grade = ["大一", "大二", "大三", "大四"][d.data.grade-1];
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
	if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
		$("button").addClass("button-ios");
})();