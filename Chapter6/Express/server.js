var express = require("express"),
	http = require("http"),
	tweetCounts = require("../Twitter/tweet_counter.js"),
	app = express();

app.use(express.static(__dirname + "/client"));

// Express HTTP on port 3000
http.createServer(app).listen(3000);

// set up our routes
app.get("/", function (req, res) {
	res.send("This is the root route.");
});

app.get("/counts.json", function(req, res) {
	// return counts as json file
	res.json(tweetCounts);
});

app.get("/hello", function (req, res) {
	res.send("Hello World!");
});

app.get("/goodbye", function (req, res) {
	res.send("Goodbye World!");
});
