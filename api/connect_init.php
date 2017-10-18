<?php
require_once "config.php";
/**
 * Created by PhpStorm.
 * User: Lintean
 * Date: 2017/10/15
 * Time: 11:25
 */

try{
    $pdo = new PDO("mysql:host=$dbhost;dbname=$dbname;charset=utf8",$user,$user_password
//        ,array(
//        PDO::ATTR_PERSISTENT => false,
//        PDO::ATTR_EMULATE_PREPARES => true,
//        PDO::ATTR_ORACLE_NULLS => true,
//        PDO::ATTR_ERRMODE ,
//        PDO::ERRMODE_EXCEPTION
//    )
    );
}
catch (Exception $e){
    output(500,"数据库链接失败，请联系管理员");
}

function output($err,$msg = null,$data = null){
    if ($data == null)
        echo json_encode(['err'=>$err,'msg'=>$msg]);
    else echo json_encode(['err'=>$err,'msg'=>$msg,'data'=>$data]);

    exit();
}

function insert($form_name,$data){
    global $pdo;
    $sql_str = "INSERT INTO `$form_name`(`name`,gender,school,college,grade,tel,wechat,`like`,ismatched,matched_people,matched_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    $sth = $pdo->prepare($sql_str);
    $result = $sth->execute(array($data['name'],$data['gender'],$data['school'],$data['college'],
        $data['grade'],$data['tel'],$data['wechat'],$data['like'],$data['ismatched'],$data['matched_people'],$data['matched_id']));
    if ($result) output(0);
    else output(500,"服务器或数据库错误,数据写入失败");
}

function alter1($id,$ismatched,$matched_people,$matched_id){
//    echo $id,' ',$ismatched,' ',$matched_people,' ',$matched_id;
//    echo "<br>";

    global $pdo;
    $sql_str = "UPDATE `complete` SET ismatched = ?, matched_people = ?, matched_id = ? WHERE id = ?";
    $sth = $pdo->prepare($sql_str);
    $result = $sth->execute(array($ismatched,$matched_people,$matched_id,$id));
    if ($result) ;
    else output(500,"服务器或数据库错误,数据写入失败");
}

function alter2($id,$ismatched,$matched_people,$matched_id,$gender,$school,$college,$grade,$wechat,$like){
    global $pdo;
    $sql_str = "UPDATE `complete` SET ismatched = ?, matched_people = ?, matched_id = ?, gender = ?, school = ?, college = ?, grade = ?, wechat = ?,`like` = ? WHERE id = ?";
    $sth = $pdo->prepare($sql_str);
    $result = $sth->execute(array($ismatched,$matched_people,$matched_id,$gender,$school,$college,$grade,$wechat,$like,$id));
    if ($result) output(0);
    else output(500,"服务器或数据库错误,数据写入失败");
}

function alter($id,$ismatched,$matched_people,$matched_id,$gender = null,$school = null,$college = null,$grade = null,$wechat = null,$like = null){
    if (func_num_args()==4) alter1($id,$ismatched,$matched_people,$matched_id);
        else alter2($id,$ismatched,$matched_people,$matched_id,$gender ,$school,$college ,$grade ,$wechat ,$like);
}


