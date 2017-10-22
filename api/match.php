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
//if ($current > $feedback_begin || $current < $update_end) {
//    echo '时间错误，匹配退出';
//    exit(0);
//}

try{
    $sql_str = "SELECT * FROM `complete`";
    $result = $pdo->query($sql_str);
    $arrays = $result->fetchAll(PDO::FETCH_ASSOC);
    $length = count($arrays);
}catch(Exception $e){
    output(500,"服务器或数据库错误,查询失败");
}

for ($i = 0;$i<$length;++$i){
    $match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']] = array();
    array_push($match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']],
        [$arrays[$i]['id'],$arrays[$i]['name'],$arrays[$i]['ismatched'],$arrays[$i]['join_time']]);
}

for ($i = 0;$i < 5;++$i){
    for ($k = 1;$k <= 7;++$k){
        if (!isset($match[$i][0][$k])) continue;
        $count = count($match[$i][0][$k]);

        for ($j = 0;$j < $count;++$j){
            $early_people = most_early_people($i,$k,$j);
            if (empty($early_people)) break;
            alter($match[$i][0][$k][$j][0], 1, $early_people[1], $early_people[0]);
            alter($early_people[0], 1, $match[$i][0][$k][$j][1], $match[$i][0][$k][$j][0]);
        }
    }
}
//print_r($match);


echo "匹配完成";

//返回数组，第0项id，第1项name
function most_early_people($i, $k, $j){
    global $match;
    $min1 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
    $min2 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
    $min3 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
    $arr = array();

    if (isset($match[$i][1][$k - 1])){

        for ($num = 0;$num < count($match[$i][1][$k - 1]);++$num){
            if ($match[$i][1][$k - 1][$num][2] == 0){
                $min1[0] = $num;
                $min1[1] = strtotime($match[$i][1][$k - 1][$num][3]);
                $min1[2] = $k - 1;
                break;
            }
        }
    }
    if (isset($match[$i][1][$k])){
        for ($num = 0;$num < count($match[$i][1][$k]);++$num){
            if ($match[$i][1][$k][$num][2] == 0){
                $min2[0] = $num;
                $min2[1] = strtotime($match[$i][1][$k][$num][3]);
                $min2[2] = $k;
                break;
            }
        }
    }
    if (isset($match[$i][1][$k + 1])){
        for ($num = 0;$num < count($match[$i][1][$k + 1]);++$num){
            if ($match[$i][1][$k + 1][$num][2] == 0){
                $min3[0] = $num;
                $min3[1] = strtotime($match[$i][1][$k + 1][$num][3]);
                $min3[2] = $k + 1;
                break;
            }
        }
    }

    if ($min1[1] < $min2[1]) $arr = $min1;
        else $arr = $min2;
    if ($arr[1] > $min3[1]) $arr = $min3;

    if ($arr[1] == strtotime('2017-10-26 23:59:59')) return array();
    else {
        $match[$i][1][$arr[2]][$arr[0]][2] = 1;
        return array($match[$i][1][$arr[2]][$arr[0]][0],$match[$i][1][$arr[2]][$arr[0]][1]);
    }
}

