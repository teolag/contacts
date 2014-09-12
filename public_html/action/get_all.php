<?php
	
require "../../includes/init.php";

$timerStart = microtime(true);
$response = array();

$sql = 'SELECT persons.person_id, first_name, last_name, birth.value AS birthdate FROM persons LEFT JOIN person_date AS birth ON birth.person_id=persons.person_id AND attribute_key="birthdate" ORDER BY first_name, last_name';
$persons = $db->getArray($sql, null, true);
$response['persons'] = $persons;

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$response['timer'] = microtime(true) - $timerStart;
echo json_encode($response, JSON_NUMERIC_CHECK);
	
	
?>