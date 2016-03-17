var	express = require("express"),
	http = require("http"),
	app = express(),
	toDos = [
			{
				"description" : "Get groceries",
				"tags" : [ "shopping", "chores" ]
			},
			{
				"description" : "Make up some new ToDos",
				"tags" : [ "writing", "work" ]
			},
			{
				"description" : "Prep for Monday's class",
				"tags" : [ "work", "teaching" ]
			},
			{
				"description" : "Answer emails",
				"tags" : [ "work" ]
			},
			{
				"description" : "Take Gracie to the park",
				"tags" : [ "chores", "pets" ]
			},
			{
				"description" : "Finish writing this book",
				"tags" : [ "writing", "work" ]
			}
		];

app.use(express.static(__dirname + "/client"));

// app.use(express.urlencoded()); no longer supported.
bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

http.createServer(app).listen(3000);


app.post("/todos", function(req, res) {
	var newToDo = req.body;

	console.log(newToDo);

	toDos.push(newToDo);

	// Send response.
	res.json({"message": "Server response to post."});
});

// Takes the place of todos.json
app.get("/todos.json", function(req, res) {
	res.json(toDos);
});
