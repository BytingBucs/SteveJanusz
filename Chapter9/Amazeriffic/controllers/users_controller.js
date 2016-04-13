var	User		= require("../models/user.js"),
	mongoose	= require("mongoose");
	
var UsersController = {};

UsersController.index = function(req, res) {
	console.log("index action called");
	res.send(200);
};

// Show a user
UsersController.show = function(req, res) {
	console.log("Show action called");
	res.send(200);
};

UsersController.create = function(req, res) {
	console.log("Create action called");
	res.send(200);
};

UsersController.update = function(req, res) {
	console.log("Update action called");
	res.send(200);
};

UsersController.delete = function(req, res) {
	console.log("Delete action called");
	res.send(200);
};

modules.exports = UsersController;