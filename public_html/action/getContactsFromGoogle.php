<?php

$accesstoken = $_SESSION['token'];
echo "token: " . $accesstoken . "<br>";
$curl = curl_init();
$userAgent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)';
$url = 'https://www.google.com/m8/feeds/contacts/default/full?max-results=5000&group=http://www.google.com/m8/feeds/groups/teolag%40gmail.com/base/6&alt=json&oauth_token='.$accesstoken;

curl_setopt($curl, CURLOPT_URL, $url);	//The URL to fetch. This can also be set when initializing a session with curl_init().
curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);	//TRUE to return the transfer as a string of the return value of curl_exec() instead of outputting it out directly.
curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 5);	//The number of seconds to wait while trying to connect.	
curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);	//The contents of the "User-Agent: " header to be used in a HTTP request.
curl_setopt($curl, CURLOPT_FOLLOWLOCATION, TRUE);	//To follow any "Location: " header that the server sends as part of the HTTP header.
curl_setopt($curl, CURLOPT_AUTOREFERER, TRUE);	//To automatically set the Referer: field in requests where it follows a Location: redirect.
curl_setopt($curl, CURLOPT_TIMEOUT, 10);	//The maximum number of seconds to allow cURL functions to execute.
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);	//To stop cURL from verifying the peer's certificate.
curl_setopt($curl, CURLOPT_HTTPHEADER, array('GData-Version: 3.0'));
	
	
$response = curl_exec($curl);
curl_close($curl);


$array = json_decode($response, 1);
$contacts=array();

foreach($array['feed']['entry'] as $contact) {
	$contacts[] = parseContact($contact);	
}


print_r($response);
print_r($contacts);



function parseContact($contact) {
	$addresses = array();
	if(!empty($contact['gd$structuredPostalAddress'])) {
		foreach($contact['gd$structuredPostalAddress'] as $c) {
			$addresses[] = array(
				"label" => $c['label'],
				"street" => $c['gd$street']['$t'],
				"zipcode" => $c['gd$postcode']['$t'],
				"city" => $c['gd$city']['$t'],
				"country" => $c['gd$country']['$t'],
				"country_code" => $c['gd$country']['code'],				
			);
		}
	}
	
	$emails = array();
	if(!empty($contact['gd$email'])) {
		foreach($contact['gd$email'] as $e) {
			$emails[] = array(
				"address" => $e['address'],
				"primary" => $e['primary'],				
			);
		}
	}

	$phones = array();
	if(!empty($contact['gd$phoneNumber'])) {
		foreach($contact['gd$phoneNumber'] as $p) {
			$phones[] = array(
				"number" => $p['$t'],		
			);
		}
	}
	
	$isPerson=true;
	if(empty($contact['title']['$t'])) {
		$isPerson=false;
	}

	return array(
		"id"=>substr($contact['id']['$t'],strrpos($contact['id']['$t'],"/")+1,100),
		"modified"=>date("Y-m-d H:i:s", strtotime($contact['updated']['$t'])),
		"first_name"=>$contact['gd$name']['gd$givenName']['$t'],
		"middle_name"=>$contact['gd$name']['gd$additionalName']['$t'],
		"last_name"=>$contact['gd$name']['gd$familyName']['$t'],
		"nickname"=>$contact['gContact$nickname']['$t'],
		"company"=>$contact['gd$organization'][0]['gd$orgName']['$t'],
		"job"=>$contact['gd$organization'][0]['gd$orgTitle']['$t'],
		"birthday"=>$contact['gContact$birthday']['when'],
		"is_person"=>$isPerson,
		"phones"=>$phones,
		"addresses"=>$addresses,
		"emails"=>$emails,
	);
}
	
?>
