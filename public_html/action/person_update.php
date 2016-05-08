<?php
require "../../includes/init.php";

$timerStart = microtime(true);
$response = array();

$personId = $_POST['personId'];

if(empty($personId)) {
	//New person
	$response['action'] = "insert";

	$sql = "INSERT INTO persons(first_name, last_name) VALUES(?,?)";
	$personId = $db->insert($sql, array($_POST['firstName'], $_POST['lastName']));

	if(!empty($_POST['birthdate'])) {
		$sql = "INSERT INTO person_date(person_id, attribute_key, value) VALUES(?,'birthdate',?)";
		$db->insert($sql, array($personId, $_POST['birthdate']));
	}
	$response['person'] = getPerson($db, $personId);

} else {

	//Update person
	$response['action'] = "update";
	$response['person_id'] = $personId;

	$sql = "UPDATE persons SET first_name=?, last_name=? WHERE person_id=?";
	$rows = $db->update($sql, array($_POST['firstName'], $_POST['lastName'], $_POST['personId']));


	//Insert or update birthday
	$sql = "SELECT person_date_id FROM person_date WHERE person_id=? AND attribute_key='birthdate'";
	$personDateId = $db->getValue($sql, array($personId));
	if(empty($personDateId)) {
		$sql = "INSERT INTO person_date (person_id, attribute_key, value) VALUES(?,'birthdate',?)";
		$db->insert($sql, array($personId, $_POST['birthdate']));
	} else {
		$sql = "UPDATE person_date SET value=? WHERE person_date_id=?";
		$db->update($sql, array($_POST['birthdate'], $personDateId));
	}

	$response['person'] = getPerson($db, $personId);
}


function getPerson(&$db, $personId) {
	$sql = "SELECT persons.person_id, first_name AS firstName, last_name AS lastName, birth.value AS birthdate FROM persons LEFT JOIN person_date AS birth ON birth.person_id=persons.person_id AND attribute_key='birthdate' WHERE persons.person_id=?";
	return $db->getRow($sql, array($personId));
}



header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$response['timer'] = microtime(true) - $timerStart;
echo json_encode($response, JSON_NUMERIC_CHECK);




?>