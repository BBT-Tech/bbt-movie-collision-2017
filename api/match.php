<?php
/**
 * Created by PhpStorm.
 * User: Lintean
 * Date: 2017/10/15
 * Time: 11:16
 */

require_once "config.php";
require_once "connect_init.php";



//时间检测
//if ($current > $feedback_begin || $current < $update_end) {
//    echo '时间错误，匹配退出';
//    exit(0);
//}

$match = array();
$length = 0;
for ($i = 0;$i < 5;++$i){
    $match[$i][0] = array();
    $match[$i][1] = array();
}
$f = array();
$line;
$boys = array(); //$u即$girl,$v即$boy
$girls = array();
$used = array();
$ans = 0;

try{
    $sql_str = "SELECT * FROM `complete`";
    $result = $pdo->query($sql_str);
    $arrays = $result->fetchAll(PDO::FETCH_ASSOC);
    $length = count($arrays);
}catch(Exception $e){
    output(500,"服务器或数据库错误,查询失败");
}



for ($i = 0;$i<$length;++$i){
    $num = -1;
//    var_dump($arrays[$i]['gender']);
    if ($arrays[$i]['gender'] == '0') {
        array_push($girls,[$arrays[$i]['name'],$arrays[$i]['id']]);
        $num = count($girls) - 1;
    }
    if ($arrays[$i]['gender'] == '1') {
        array_push($boys,[$arrays[$i]['name'],$arrays[$i]['id']]);
        $num = count($boys) - 1;
    }

    $match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']] = array();
    array_push($match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']],
        [$arrays[$i]['name'],$arrays[$i]['id'],$num]);
}

for ($like = 0;$like < 5;++$like) {
    $gender = 0;
    for ($grade = 1; $grade <= 7; ++$grade) {
        if (!isset($match[$like][$gender][$grade])) continue;
        $count = count($match[$like][$gender][$grade]);

            for ($l = $grade - 1; $l <= $grade + 1; ++$l) {
                for ($girl = 0; $girl < $count; ++$girl) {

                    if (isset($match[$like][1 - $gender][$l])) {
                        for ($boy = 0; $boy < count($match[$like][1 - $gender][$l]); ++$boy) {
                            $line[$match[$like][$gender][$grade][$girl][2]] [$match[$like][1 - $gender][$l][$boy][2]] = true;
                        }
                    }

                }
            }

    }

}

for ($u = 0; $u < count($girls); ++$u){
    $used = array();
    if (find($u)) $ans++;
}

for ($num = 0; $num < count($boys); ++$num){
    if (isset($f[$num])){
        alter($girls[$f[$num]][1], 1, $boys[$num][0], $boys[$num][1]);
        alter($boys[$num][1], 1, $girls[$f[$num]][0], $girls[$f[$num]][1]);
    }
}
echo "匹配成功"."总人数".count($arrays)."匹配人数".$ans * 2;
print_r($line);

function find($u){    //$u为girl
    global $f,$line,$boys,$used;

    for ($v=0; $v<count($boys); $v++){    //扫描每一个boy
        if (isset($line[$u][$v]) && !isset($used[$v]))
            // isset($line[$u][$v])表示元素u和v之间有连线，$used[$v]表示这个元素的曾是否有过要更改匹配的，这样可以省下一些时间
        {
            $used[$v]=1;
            if (!isset($f[$v]) || find($f[$v])) {   //$f[$v]表示boy所匹配的girl
                //!isset(f[v])表示该元素仍未匹配 find($f[$v])是去尝试能否改变匹配$v元素的元素的匹配
                $f[$v]=$u;
                return true;
            }
        }
    }
     return false;
}

//for ($i = 0;$i<$length;++$i){
//    $match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']] = array();
//    array_push($match[array_search($arrays[$i]['like'],$likes)][$arrays[$i]['gender']][$arrays[$i]['grade']],
//        [$arrays[$i]['id'],$arrays[$i]['name'],$arrays[$i]['ismatched'],$arrays[$i]['join_time']]);
//}
//
//for ($i = 0;$i < 5;++$i){
//    for ($k = 1;$k <= 7;++$k){
//        if (!isset($match[$i][0][$k])) continue;
//        $count = count($match[$i][0][$k]);
//
//        for ($j = 0;$j < $count;++$j){
//            $early_people = most_early_people($i,$k,$j);
//            if (empty($early_people)) break;
//            alter($match[$i][0][$k][$j][0], 1, $early_people[1], $early_people[0]);
//            alter($early_people[0], 1, $match[$i][0][$k][$j][1], $match[$i][0][$k][$j][0]);
//        }
//    }
//}
////print_r($match);
//
//
//echo "匹配完成";
//
////返回数组，第0项id，第1项name
//function most_early_people($i, $k, $j){
//    global $match;
//    $min1 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
//    $min2 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
//    $min3 = array(-1,strtotime('2017-10-26 23:59:59'),-1);
//    $arr = array();
//
//    if (isset($match[$i][1][$k - 1])){
//
//        for ($num = 0;$num < count($match[$i][1][$k - 1]);++$num){
//            if ($match[$i][1][$k - 1][$num][2] == 0){
//                $min1[0] = $num;
//                $min1[1] = strtotime($match[$i][1][$k - 1][$num][3]);
//                $min1[2] = $k - 1;
//                break;
//            }
//        }
//    }
//    if (isset($match[$i][1][$k])){
//        for ($num = 0;$num < count($match[$i][1][$k]);++$num){
//            if ($match[$i][1][$k][$num][2] == 0){
//                $min2[0] = $num;
//                $min2[1] = strtotime($match[$i][1][$k][$num][3]);
//                $min2[2] = $k;
//                break;
//            }
//        }
//    }
//    if (isset($match[$i][1][$k + 1])){
//        for ($num = 0;$num < count($match[$i][1][$k + 1]);++$num){
//            if ($match[$i][1][$k + 1][$num][2] == 0){
//                $min3[0] = $num;
//                $min3[1] = strtotime($match[$i][1][$k + 1][$num][3]);
//                $min3[2] = $k + 1;
//                break;
//            }
//        }
//    }
//
//    if ($min1[1] < $min2[1]) $arr = $min1;
//        else $arr = $min2;
//    if ($arr[1] > $min3[1]) $arr = $min3;
//
//    if ($arr[1] == strtotime('2017-10-26 23:59:59')) return array();
//    else {
//        $match[$i][1][$arr[2]][$arr[0]][2] = 1;
//        return array($match[$i][1][$arr[2]][$arr[0]][0],$match[$i][1][$arr[2]][$arr[0]][1]);
//    }
//}

