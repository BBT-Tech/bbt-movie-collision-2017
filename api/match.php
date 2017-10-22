<?php
/**
 * Created by PhpStorm.
 * User: Lintean
 * Date: 2017/10/15
 * Time: 11:16
 */

require_once "config.php";
require_once "connect_init.php";

$match = array();
$length = 0;
for ($i = 0;$i < 5;++$i){
    $match[$i][0] = array();
    $match[$i][1] = array();
}

//时间检测
if ($current > $feedback_begin || $current < $update_end) echo '时间错误，匹配退出';

try{
    $sql_str = "SELECT * FROM `complete`";
    $result = $pdo->query($sql_str);
    $arrays = $result->fetchAll(PDO::FETCH_ASSOC);
    $length = count($arrays);
}catch(Exception $e){
    output(500,"服务器或数据库错误,查询失败");
}

for ($i = 0;$i<$length;++$i){
    $match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']] = array();
    array_push($match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']], [$arrays[$i]['id'],$arrays[$i]['name']]);
    //是字符

}
//print_r($match);

for ($i = 0;$i < 5;++$i){
    $min = min(count($match[$i][0]),count($match[$i][1]));
    for ($j = 0;$j < $min;++$j){
        alter($match[$i][0][$j][0], 1, $match[$i][1][$j][1], $match[$i][1][$j][0]);
        alter($match[$i][1][$j][0], 1, $match[$i][0][$j][1], $match[$i][0][$j][0]);
    }
}

echo "匹配完成";

