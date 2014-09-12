<?php

require "../includes/init.php";




$token = $_SESSION['token'];

if(empty($token)) {
	$scope = "email%20profile";
	$authUrl = sprintf("https://accounts.google.com/o/oauth2/auth?scope=%s&redirect_uri=%s&response_type=code&client_id=%s", $scope, $redirect_uri, $client_id);
	echo $authUrl;
	header("Location: " . $authUrl);
	exit();
}


$url = "https://www.googleapis.com/userinfo/v2/me?";
$curl = curl_init();
$headers = array(
	"Authorization: Bearer " . $token,
	"GData-Version: 3.0",
);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_POST, false);
$result = curl_exec($curl);
curl_close($curl);

$user = json_decode($result);
$_SESSION['googleId'] = $user->id;

?>

<!doctype html>
<html>
	<head>
		<title>My contacts</title>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="/css/style.css" type="text/css" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	</head>
	<body>
	
		<div class="column left">
	
			<input type="search" id="filter" />
			
			<button type="button" id="btnNewPerson">+</button>
	
			<div id="personsBox">
				<ul id="persons"></ul>
			</div>
		
		</div>
		
		<div class="column main">
		
			<?php print_r($user); ?>
			
			<a href="/action/logout.php">Logout</a><br>
			
			<div id="info"></div>
			
			
		
		</div>
		
		
		
		<dialog id="dialogPerson">
			<form>
				<input type="hidden" name="personId" />
				<input type="text" name="firstName" placeholder="firstname" />
				<input type="text" name="lastName" placeholder="lastname" />
				<br />
				<input type="date" name="birthdate" placeholder="birthdate" />
				<br><br>
				<button type="submit">Save</button>
				<button type="button" id="btnCancelPersonEdit">Cancel</button>
			
			</form>
		</dialog>
		
		<script src="/js/main.js"></script>
	</body>
</html>