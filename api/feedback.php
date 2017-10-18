<?php
header("Content-Type: application/json");
require_once "config.php";
require_once "connect_init.php";

function data_change($data_to_change){
    $data['name'] = $data_to_change['name'];
    $data['school'] = $data_to_change['school'];
    $data['college'] = $data_to_change['college'];
    $data['grade'] = $data_to_change['grade'];
    $data['tel'] = $data_to_change['tel'];
    $data['wechat'] = $data_to_change['wechat'];
    $data['like'] = $data_to_change['like'];
    return $data;
}

if (isset($_POST['name']) && isset($_POST['tel'])){
    try{
        $sql_str = "SELECT * FROM `complete` WHERE `name`=? and `tel`=?";
        $sth = $pdo->prepare($sql_str);
        $sth->execute(array($_POST['name'],$_POST['tel']));
        $result = $sth->fetch(PDO::FETCH_ASSOC);

        if ($result){
            $arr = $result[0];
            if ($arr['ismatched'] == '1') output(0,null,data_change($arr));
            else output(404,"未匹配到人");
        }
        else output(404,"您还没参加这次活动，欢迎下次参与");
    }catch(Exception $e){
        output(500,"服务器或数据库错误,查询失败");
    }
}
else output(500,"服务器错误,没有接收到数据");
