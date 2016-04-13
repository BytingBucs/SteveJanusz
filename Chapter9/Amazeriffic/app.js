var	express = require("express"),
	http = require("http"),
	app = express(),
	mongoose = require("mongoose"),
	ToDosController = require("./controllers/todos_controller.js"),
	usersController = require("./controllers/users_controller.js"),
	bodyParser = require("body-parser");

app.use(express.static(__dirname + "/client"));

// app.use(express.urlencoded()); no longer supported.
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(3000);

/*
app.post("/todos", function(req, res) {
	console.log(req.body);
	var newToDo = new ToDo({	"description":	req.body.description,
								"tags":			req.body.tags});

	newToDo.save(function(err, result) {

		if(err !== null) {
			console.log(err);
			res.send("ERROR");
		} else {
			// expects ALL items to be returned
			ToDo.find({}, function(err, result) {
				if(err !== null) {
					// element did not get saved
				}
				res.json(result);
			});
		}
	});


	// toDos.push(newToDo);

	// Send response.
	// res.json({"message": "Server response to post."});
});
*/

// routes
app.get("/todos.json", ToDosController.index);

// basic CRUD routes
app.get("/todos/:id", ToDosController.show);
app.post("/todos", ToDosController.create);

// user routes
app.get("/users.json", usersController.index);
app.post("/users", usersController.create);
app.get("/users/:username", usersController.show);
app.put("/users/:username", usersController.update);
app.del("/users/:username", usersController.destroy);

// :username/todos routes
app.get("/users/:username/todos.json", ToDosController.index);
app.post("/users/:username/todos", ToDosController.create);
// app.put("/users/:username/todos/:id", ToDosController.update);
// app.del("/users/:username/todos/:id", ToDosController.destroy);