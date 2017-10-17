<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>电影对对碰 &copy;2017</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" type="text/css" href="./css/index.css?<?php echo filemtime('./css/index.css'); ?>">
</head>
<body>
	<div class="word"></div>
	<div class="main-frame">
		<div class="main-body">
			<h3><small></small></h3>
			<div class="main-info"></div>
			<form class="main-form" onsubmit="return false">
				<div class="form-header"></div>
				<div class="form-body"></div>
				<div class="form-submit">
					<div class="grounded-radiants"><button>下一步</button></div>
				</div>
			</form>
		</div>
		<div class="progress-frame">
			<div class="progress"></div>
		</div>
	</div>
<script type="text/plain" id="t-form-like">
	<div class="form-like">
		<select name="like" required>
			<option value="">点此选择喜欢的电影类型</option>
			<option value="喜剧爱情">喜剧爱情</option>
			<option value="惊悚悬疑">惊悚悬疑</option>
			<option value="科幻动作">科幻动作</option>
			<option value="动画">动画</option>
			<option value="剧情">剧情</option>
		</select>
		<div class="like-tip">
			不确定？ <a href="javascript:;">来做个测试吧</a>
		</div>
	</div>
</script>
<script type="text/plain" id="t-form-result">
	<div class="form-result">
		<div class="like-tip">根据测试，你喜欢的是：</div>
		<div class="select-frame">
			<select name="like" required>
				<option value="">&nbsp;请选择</option>
				<option value="喜剧爱情">&nbsp;喜剧爱情</option>
				<option value="惊悚悬疑">&nbsp;惊悚悬疑</option>
				<option value="科幻动作">&nbsp;科幻动作</option>
				<option value="动画">&nbsp;&nbsp;&nbsp;&nbsp;动画</option>
				<option value="剧情">&nbsp;&nbsp;&nbsp;&nbsp;剧情</option>
			</select>
		</div>
	</div>
</script>
<script type="text/plain" id="t-form-end">
	<div class="form-end">
		<p>感谢你的参与><</p>
		<p>配对结果将于两天后公布，届时可凭姓名和手机号查询哦</p>
		<p>同时恭喜你获得印花一枚，马上领取吧</p>
	</div>
</script>
<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
<script src="./js/index.js?<?php echo filemtime('./js/index.js'); ?>"></script>
</body>
</html>