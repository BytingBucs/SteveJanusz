var	express = require("express"),
	http = require("http"),
	app = express(),
	ToDo = require("./models/todo.js"),
	bodyParser = require("body-parser");

app.use(express.static(__dirname + "/client"));

// app.use(express.urlencoded()); no longer supported.
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(3000);

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

// Takes the place of todos.json
app.get("/todos.json", function(req, res) {
	ToDo.find({}, function(err, toDos) {
		res.json(toDos);
	});
});
