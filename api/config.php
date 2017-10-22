<?php
/**
 * Created by PhpStorm.
 * User: Lintean
 * Date: 2017/10/15
 * Time: 11:16
 */

$register_close_time = "";


$dbhost = "localhost";
$dbname = "bbt-movie-collision-2017";
$user = "bbt-movie-collision-2017";
$user_password = "collision-2017";

$grades = [1,2,3,4];
$schools = ['华南理工大学南校','华南理工大学北校','中山大学','华南师范大学','广东工业大学',
    '广东外语外贸大学','广州中医药大学','广东药学院','广州大学','广州美术学院','星海音乐学院'];
$likes = ['喜剧爱情','惊悚悬疑','科幻动作','动画','剧情'];

$update_end = '2017-10-26 23:59:59';
$feedback_begin = '2017-10-28 12:00:00';
$feedback_end = '2017-11-12 00:00:00';

date_default_timezone_set('Asia/Shanghai');
$current = strtotime(date("Y-m-d H:i:s"));
$update_end = strtotime($update_end);
$feedback_begin = strtotime($feedback_begin);
$feedback_end = strtotime($feedback_end);


