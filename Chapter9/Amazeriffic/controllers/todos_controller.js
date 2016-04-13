var 	ToDo = require("../models/todo.js"),
		ToDosController = {};
		
ToDosController.index = function(req, res) {
	var username = req.params.username || null,
		respondWithToDos;
	
	// Find todo helper function
	respondWithToDos = function(query) {
		ToDo.find(query, function(err, toDos) {
			if(err !== null) {
				res.json(500, err);
			} else {
				res.json(200, toDos);
			}
		});
	};
	
	if(username !== null) {
		User.find({"username": username}, function(err, result) {
			if(err !== null) {
				res.json(500, err);
			} else if(result.length === 0) {
				// User was not found
				res.send(404);
			} else {
				respondWithToDos({"owner": result[0].id });
			}
		});
	} else {
		// Respond with all todos
		respondWithToDos({});
	}
};

ToDosController.create = function(req, res) {
	var username = req.params.username || null;
	
	var newToDo = new ToDo({	"description": 	req.body.description,
								"tags":			req.body.tags});
	
	ToDo.find({"username": username}, function(err, result) {
		if(err) {
			res.resnd(500);
		} else {
			if(result.length === 0) {
				//User not found -- userless todo
				newToDo.owner = null;
			} else {
				//User found
				newToDo.owner = result[0]._id;
			}
			newToDo.save(function(err, result) {
				if(err !== null) {
					// ToDo not saved.
					res.json(500, err);
				} else {
					res.json(200, result);
				}
			});
		}
	});
};

ToDosController.show = function(req, res) {
	// Show ID specified in URL
	var id = req.params.id;
	
	// Find specified item.
	ToDo.find({"_id": id}, function(err, todo) {
		if(err !== null) {
			res.json(500, err);
		} else {
			if(todo.length > 0) {
				res.json(200, todo[0]);
			} else {
				res.send(404);
			}
		}
	});
};

module.exports = ToDosController;