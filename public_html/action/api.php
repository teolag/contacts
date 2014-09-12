<?php
	
require "../../includes/init.php";

$response = array();

$persons = $db->getArray('SELECT persons.* FROM persons JOIN person_tag USING (person_id) JOIN tags USING (tag_id) WHERE tag = "Ping Pong AB" ORDER BY first_name, last_name');

$response['persons'] = $persons;

header('Content-Type: application/json');
echo json_encode($response, JSON_NUMERIC_CHECK);
	
	
?>