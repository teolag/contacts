<?php

require "../../includes/init.php";


if($_SESSION['googleId']!==$googleId) {
	die("invalid googleId");
}


$tag = $_POST['tag'];
if(empty($tag) {
	die("tag name not specified");
});


$timerStart = microtime(true);
$response = array();

$sql = 'INSERT INTO tags(tag) VALUES(?)';
$tagId = $db->getInsert($sql, array($tag));
$response['tag'] = array("id"=>$tagId, "tag"=>$tag);


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$response['timer'] = microtime(true) - $timerStart;
echo json_encode($response, JSON_NUMERIC_CHECK);


?>