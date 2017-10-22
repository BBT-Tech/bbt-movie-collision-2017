<?php

header("Content-Type: application/json");
require_once "config.php";
require_once  "connect_init.php";

if ($current > $update_end) output(100, '活动报名已经结束');

$data_to_insert = null;

if (isset($_POST['name'])){
    if (true) {
        $data_to_insert['name'] = htmlspecialchars($_POST['name']);
    }
    else output(403,"name数据不规范");
}
else output(500,"服务器错误,没有接收到name");

if (isset($_POST['gender'])){
    if ($_POST['gender'] == "女") {
        $data_to_insert['gender'] = 0;
    }
    elseif ($_POST['gender'] == "男"){
        $data_to_insert['gender'] = 1;
    }
    else output(403,"gender数据不规范");

}
else output(500,"服务器错误,没有接收到gender");

if (isset($_POST['school'])){
    if (in_array($_POST['school'],$schools)) {
        $data_to_insert['school'] = htmlspecialchars($_POST['school']);
    }
    else output(403,"school数据不规范");
}
else output(500,"服务器错误,没有接收到school");

if (isset($_POST['college'])){
    if (true) {
        $data_to_insert['college'] = htmlspecialchars($_POST['college']);
    }
    else output(403,"college数据不规范");
}
else output(500,"服务器错误,没有接收到college");

if (isset($_POST['grade'])){
    if (in_array($_POST['grade'],$grades)) {
        $data_to_insert['grade'] = htmlspecialchars($_POST['grade']) - '0';
    }
    else output(403,"grade数据不规范");
}
else output(500,"服务器错误,没有接收到grade");

if (isset($_POST['tel'])){
    if (preg_match('/1[3,5,7,8]\d{9}/U',$_POST['tel'])) {
        $data_to_insert['tel'] = htmlspecialchars($_POST['tel']);
    }
    else output(403,"tel数据不规范");
}
else output(500,"服务器错误,没有接收到tel");

if (isset($_POST['wechat'])){
    if (true) {
        $data_to_insert['wechat'] = htmlspecialchars($_POST['wechat']);
    }
    else output(403,"wechat数据不规范");
}

if (isset($_POST['like'])){
    if (in_array($_POST['like'],$likes)) {
        $data_to_insert['like'] = htmlspecialchars($_POST['like']);
    }
    else output(403,"like数据不规范");
}
else output(500,"服务器错误,没有接收到like");

$data_to_insert['ismatched'] = 0;
$data_to_insert['matched_people'] = "null";
$data_to_insert['matched_id'] = -1;

//去重查询
$sql_str = 'SELECT * FROM `complete` WHERE `name`=? and `tel`=?';
$sth = $pdo->prepare($sql_str);
if ($sth->execute(array($_POST['name'],$_POST['tel']))){
    $result = $sth->fetchAll(PDO::FETCH_ASSOC);
    if (empty($result)){
        //向服务器增添信息
        insert("complete",$data_to_insert);
    }
    else {
        //$id,$ismatched,$matched_people,$matched_id,$gender = null,$college = null,$grade = null,$wechat = null,$like = null
        alter($result[0]['id'],0,"null",-1,$data_to_insert['gender'],$data_to_insert['school'],$data_to_insert['college'],
            $data_to_insert['grade'],$data_to_insert['wechat'],$data_to_insert['like']);
    }
}
else{
    output(500,"服务器或数据库错误");
}







