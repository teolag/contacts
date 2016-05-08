<?php

require "../../includes/init.php";


if($_SESSION['googleId']!==$googleId) {
	die("invalid googleId");
}


$timerStart = microtime(true);
$response = array();

//Persons by id
$sql = 'SELECT persons.person_id, first_name AS firstName, last_name AS lastName, birth.value AS birthdate FROM persons LEFT JOIN person_date AS birth ON birth.person_id=persons.person_id AND attribute_key="birthdate"';
$persons = $db->getArray($sql, null, true);
$response['persons'] = $persons;

//Tags by id
$sql = 'SELECT tag_id, tag FROM tags';
$tags = $db->getArray($sql, null, true);
$response['tags'] = $tags;

//Tag to Person connections
$sql = 'SELECT tag_id, person_id FROM person_tag';
$cups = $db->getArray($sql);
foreach($cups as $cup) {
	$response['persons'][$cup['person_id']]['tags'][] = $cup['tag_id'];
	$response['tags'][$cup['tag_id']]['persons'][] = $cup['person_id'];
}


/*
//Persons by tag
$sql = 'SELECT tag_id, GROUP_CONCAT(person_id) AS personIds FROM person_tag GROUP BY tag_id';
$connections = $db->getArray($sql, null, true);
foreach($connections as $tag_id => $persons) {
	$response['tags'][$tag_id]['persons'] = explode(",",$persons['personIds']);
}
*/



header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$response['timer'] = microtime(true) - $timerStart;
echo json_encode($response, JSON_NUMERIC_CHECK);


?>