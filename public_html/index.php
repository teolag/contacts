<?php

require "../includes/init.php";


if(empty($_SESSION['token'])) {
	$scope = array(
		'https://www.googleapis.com/auth/userinfo.profile',
		'https://www.google.com/m8/feeds/'
	);
	$scopes = implode("+", $scope);
	header("Location: https://accounts.google.com/o/oauth2/auth?client_id={$client_id}&redirect_uri={$redirect_uri}&scope={$scopes}&response_type=code");
	exit();
}


$q = 'https://www.googleapis.com/oauth2/v1/userinfo?v=3.0&access_token='.$_SESSION['token'];
$json = file_get_contents($q);
$userInfoArray = json_decode($json,true);
	
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
		
			<?php print_r($userInfoArray); ?>
			
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