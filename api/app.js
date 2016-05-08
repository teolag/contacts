"use strict";
var express = require("express");
var db = require("./db.js");
var PORT = 8052;
var PERSON_FIELDS = "person_id AS id, first_name AS firstName, last_name AS lastName, gender";


var app = express();


app.get('/all', function(req, res){
	res.setHeader('Content-Type', 'application/json');

	db.select("SELECT " + PERSON_FIELDS + " FROM persons", null, function(result) {
		res.send(JSON.stringify(result));
	});
});


app.get('/birthdays', function(req, res){
	//res.setHeader('Content-Type', 'application/json');

	db.select("SELECT * FROM view_upcoming_birthdays", null, function(result) {
		res.json(result);
	});
});




app.get('/', function(req, res){
  res.send('Contacts API');
});


var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
