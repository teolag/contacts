<?php


require "../../includes/config.php";



$max_results = 25;

$auth_code = $_GET["code"];


$fields=array(
	'code'=>  urlencode($auth_code),
	'client_id'=>  urlencode($client_id),
	'client_secret'=>  urlencode($client_secret),
	'redirect_uri'=>  urlencode($redirect_uri),
	'grant_type'=>  urlencode('authorization_code')
);
$post = '';
foreach($fields as $key=>$value) { 
	$post .= $key.'='.$value.'&';
}
$post = rtrim($post,'&');

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL,'https://accounts.google.com/o/oauth2/token');
curl_setopt($curl, CURLOPT_POST,5);
curl_setopt($curl, CURLOPT_POSTFIELDS, $post);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
$result = curl_exec($curl);
curl_close($curl);

$response = json_decode($result);
$accesstoken = $response->access_token;


if(!empty($accesstoken)) {
	session_start();
	$_SESSION['token'] = $accesstoken;
	header("Location: ../index.php");
	exit();
} else {
	
	var_dump($response);
	
}


?>