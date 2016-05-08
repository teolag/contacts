"use strict";
var mysql = require('mysql');
var Config = require('./config');

var dbConfig = Config.mysql;
var database, username, connection;
database = dbConfig.database;
username = dbConfig.user;
connection = mysql.createConnection(dbConfig);
connection.connect(connectionCallback);


module.exports = {

	insert: function(table, data, callback) {
		var sql = 'INSERT INTO ' + table + ' SET ?';
		connection.query(sql, data, function(err, result) {
			if(err) console.log("Error inserting:", err);
			else if(callback) callback(result);
		});
	},

	update: function(sql, data, callback) {
		connection.query(sql, data, function(err, result) {
			if(err) console.log("Error updating:", err);
			else if(callback) callback(result);
		});
	},

	select: function(sql, data, callback) {
		connection.query(sql, data, function(err, result) {
			if(err) console.log("Error selecting:", err);
			else if(callback) callback(result);
		});
	}
}


function connectionCallback(err) {
	if(err) {
		console.log("Error connection to database:", err);
	} else {
		console.log("Connected to database " + database + " as " + username);
	}
}