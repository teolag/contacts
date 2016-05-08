<?php

require "../includes/init.php";

$token = $_SESSION['token'];

if(empty($token)) {
	$scope = "email%20profile%20https://www.google.com/m8/feeds";
	$authUrl = sprintf("https://accounts.google.com/o/oauth2/auth?scope=%s&redirect_uri=%s&response_type=code&client_id=%s", $scope, $redirect_uri, $client_id);
	echo $authUrl;
	header("Location: " . $authUrl);
	exit();
}


$url = "https://www.googleapis.com/oauth2/v3/userinfo";
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
$_SESSION['googleId'] = $user->sub;

?>

<!doctype html>
<html>
	<head>
		<title>xioContacts</title>
		<meta charset="utf-8" />
		<link rel="stylesheet" href="//cdn.xio.se/xioPop/dev/XioPop.css" type="text/css" />
		<link rel="stylesheet" href="/css/style.css" type="text/css" />
		<link rel="icon" href="/img/contact.png" sizes="32x32">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	</head>
	<body>

		<div class="column left">

			<input type="search" class="person-list-filter" />

			<menu type="toolbar">
				<button type="button" id="btnNewPerson">+</button>
				<button type="button" id="btnSelectAll">Select all</button>
				<button type="button" id="btnDeselectAll">Deselect all</button>
			</menu>

			<div id="personsBox">
				<ul class="person-list"></ul>
			</div>
		</div>

		<div class="column main">
			<div id="userBox">
				<img src="<?php echo $user->picture; ?>" />
				<div class="name"><?php echo $user->name; ?></div>
				<div class="email"><?php echo $user->email; ?></div>
				<a href="/action/logout.php">Logout</a><br>
			</div>

			<section class="area" data-area="person"></section>
		</div>



		<template id="tplPerson">
			<span class="firstName"></span>
			<span class="lastName"></span>
			<br>
			<span class="birthdate"></span>
			<button type="button" class="person-edit">Edit</button>


			<ul class="person-tags"></ul>
			<button type="button" class="person-add-tag">Add tag</button>
		</template>


		<template id="tplPersonEdit">
			<h1></h1>
			<form action='/action/person_update.php'>
				<input type="hidden" name="personId" />
				<input type="text" name="firstName" placeholder="firstname" />
				<input type="text" name="lastName" placeholder="lastname" />
				<br />

				<input type="date" name="birthdate" placeholder="birthdate" />
				<br><br>
				<button type="submit">Save</button>
				<button type="button" id="btnCancelPersonEdit">Cancel</button>
			</form>
		</template>

		<script src="//cdn.xio.se/xioPop/dev/XioPop.js"></script>
		<script src="//cdn.xio.se/XI/dev/XI.Element.js"></script>
		<script src="//cdn.xio.se/XI/dev/XI.Ajax.js"></script>
		<script src="/js/person-list.js"></script>
		<script src="/js/person-edit.js"></script>
		<script src="/js/main.js"></script>
	</body>
</html>