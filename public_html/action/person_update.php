<?php
require "../../includes/init.php";

$timerStart = microtime(true);
$response = array();


if(empty($_POST['personId'])) {
	//New person

	$sql = "INSERT INTO persons(first_name, last_name) VALUES(?,?)";
	$personId = $db->insert($sql, array($_POST['firstName'], $_POST['lastName']));
	
	if(!empty($_POST['birthdate'])) {
		$sql = "INSERT INTO person_date(person_id, attribute_key, value) VALUES(?,'birthdate',?)";
		$db->insert($sql, array($personId, $_POST['birthdate']));
	}

	$response['person'] = array(
		"id" => $personId,
		"first_name" => $_POST['firstName'],
		"last_name" => $_POST['lastName']
	);

} else {
	//Update person

}


header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$response['timer'] = microtime(true) - $timerStart;
echo json_encode($response, JSON_NUMERIC_CHECK);




?>