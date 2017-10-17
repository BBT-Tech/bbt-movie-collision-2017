;(function() {
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

	var FormInfo = {
		init: function() {
			FormInfo.step = 0;
			$(".main-body h3").html("报名信息");
			$(".main-info").html("届时将凭以下信息查询配对结果哦");
			FormInfo.render([
				{ name: "name", title: "姓名" },
				{ name: "tel", title: "手机" }
			]);
			setTimeout(function() {
				$(".main-frame").css("opacity", "0.95");
				setTimeout(function() {
					$(".word").removeClass("word");
					$(".progress").css("width", "0%");
					FormInfo.step = 1;
				}, 200);
			}, 500);
			submit(function() {
				switch (FormInfo.step) {
					case 1: {
						if (!/^1[0-9]{10}$/.test($("form [name=tel]").val())) {
							$("form [name=tel]").parent(".form-info").addClass("wrong")
							.find(".info-tip").html("检查一下你的手机号哦");
							return;
						}
						Submit.save();
						$(".main-body h3").html("其他信息");
						$(".main-info").html("以下信息将被告知你的配对者哦");
						FormInfo.render([
							{ name: "gender", title: "性别", select: ["", "男", "女"] },
							{ name: "school", title: "学校", select: ["",
								"华南理工大学南校",  "华南理工大学北校",
								"中山大学",  "华南师范大学",
								"广东工业大学",  "广东外语外贸大学",
								"广州中医药大学",  "广东药学院",
								"广州大学",  "广州美术学院", "星海音乐学院"
							] },
							{ name: "college", title: "学院" },
							{ name: "grade", title: "年级", select: ["",
								"大一", "大二", "大三", "大四" 
							] },
							{ name: "wechat", title: "微信 选填", required: false }
						]);
						$("form [name=wechat]")//.css("width", "140px")
						.parent(".form-info").find(".info-tip").css("left", "90px");
						FormInfo.step = 2;
						$(".progress").css("width", "30%");
						break;
					}
					case 2: {
						Submit.save();
						Like.init();
						break;
					}
				}
			});
		},
		render: function(obj) {
			var target = $(".form-body").html("");
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
				});
			});
			target.find(".info-title").on('click', function() {
				$(this.parentNode).find(".info-input").focus();
			});
		}
	}

	var Like = {
		init: function() {
			$(".progress").css("width", "60%");
			$(".main-body h3").html("爱好类型");
			$(".main-info").html("你将与拥有共同爱好的人配对哦");
			$(".form-submit button").html("提交");
			$(".form-body").html($("#t-form-like").html())
			.find("a").click(function() {
				Game.init();
			});
			submit(function() {
				$(".progress").css("width", "100%");
				Submit.save();
				Submit.submit();
			});
		}
	}

	var Game = {
		init: function() {
			$(".progress").css("width", "60%");
			$(".main-info").css("display", "none");
			$(".form-submit").css("display", "none");
			Game.id = 0;
			Game.render();
			submit();
		},
		render: function() {
			$(".main-body h3").html("测试<small>"+(Game.id+1)+"/9</small>");
			var obj = Game.data[Game.id];
			var options = '<div class="game-options">';
			var i = 0;
			var ii = "ABCDEFG";
			obj.options.forEach(function(option) {
				options += '<div data-type="'+option.type+'">'+
					'<span>'+ii[i]+'</span>'+option.text+
					'<div class="option-underline"></div>'+
				'</div><br>';
				i ++;
			});
			options += '</div>';
			var loading = false;
			$(".form-body").html('<div class="form-game">'+
				'<div class="game-title">'+obj.title+'</div>'+
				options +
			'</div>').find(".game-options>div").each(function() {
				$(this).click(function() {
					if (loading)
						return;
					loading = true;
					if (Game[this.dataset.type])
						Game[this.dataset.type] ++;
					else
						Game[this.dataset.type] = 1;
					$(this).find(".option-underline").css("width", "100%");
					setTimeout(function() {
						if (Game.id < 8) {
							Game.id ++;
							$(".progress").css("width", (60+40/9*Game.id)+"%");
							Game.render();
						} else {
							$(".progress").css("width", "100%");
							Game.Result.init();
						}
						loading = false;
					}, 500);
				});
			});
		},
		data: [
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] },
			{ title: "这是一道测试题，而且这道题可能还有点长，大概有两到三行那么长。", options: [
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}, { type: "喜剧爱情", text: "这是一个答案"},
				{ type: "喜剧爱情", text: "这是一个答案"}
			] }
		],
		Result: {
			init: function() {
				$(".main-info").html("不满意结果可以点击重新选择哦").css("display", "block");
				$(".form-submit button").html("提交");
				$(".form-submit").css("display", "block");
				$(".main-body h3").html("测试结果");
				var list = ["喜剧爱情", "惊悚悬疑", "科幻动作", "动画", "剧情"];
				var max = 0;
				var result = [];
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
				$(".form-body").html($("#t-form-result").html()).find("[name=like]").val(result);
				submit(function() {
					Submit.save();
					Submit.submit();
				});
			}
		}
	}

	var Submit = {
		save: function() {
			$("form [name]").each(function() {
				Submit[this.name] = this.value;
			});
		},
		submit: function() {
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
				alert("OK");
			}).fail(function() {
				alert("网络异常");
			});
		}
	}

	var End = {
		init: function() {
			$(".main-info").css("display", "none");
			$(".progress-frame").css("display", "none");
			$(".form-submit button").html("领取印花");
			$(".main-body h3").html("提交成功");
			$(".form-body").html($("#t-form-end").html());
		}
	}

	$(window).on('load', function() {
		FormInfo.init();
		// setTimeout(function() {
		// 	Game.Result.init();
		// }, 1000);
	});
})();