var express = require("express"),
	http = require("http"),
	app = express();
	
var getHighestHand = function(hand) {
	// Rankings were taken from this site: https://www.pokerstars.com/poker/games/rules/hand-rankings/
	// Traditional High Poker Hand Ranks
	// Define variables to make checking easier.
	var ranks = [hand[0]["rank"], hand[1]["rank"], hand[2]["rank"], hand[3]["rank"], hand[4]["rank"]].sort(function(a,b){return a-b});;
	var allRanksUnique = ranks[0] != ranks[1] && ranks[1] != ranks[2] && ranks[2] != ranks[3] && ranks[3] != ranks[4];
	var allSuitsMatch = hand[0]["suit"] == hand[1]["suit"] == hand[2]["suit"] == hand[3]["suit"] == hand[4]["suit"];	
	var straight = allRanksUnique && (ranks[4] - ranks[0] == 4);
	
	// console.log("ranks unique: " + allRanksUnique);
	// console.log("suits match : " + allSuitsMatch);
	// console.log("straight    : " + straight);
	// console.log(ranks);
	// console.log("---");
	
	// Check for hands going from highest to lowest.
	// Royal flush or straight flush
	if(allSuitsMatch && straight) {
		if(ranks[4] == 14) {
			return("Royal flush");
		} else {
			return("Straight flush");
		}
	}
	// Four of a kind
	if(ranks[0] == ranks[3] || ranks[1] == ranks[4]) {
		return("Four of a kind");
	}
	// Full house
	// First three and last two match or first two and last three match.
	if(ranks[0] == ranks[1] && ranks[1] == ranks[2] && ranks[3] == ranks[4] || ranks[0] == ranks[1] && ranks[2] == ranks[3] && ranks[3] == ranks[4]) {
		return("Full house");
	}
	// Flush
	if(allSuitsMatch) {
		return("Flush");
	}
	// Straight
	if(straight) {
		return("Straight");
	}
	//Three of a kind
	if(ranks[0] == ranks[2] || ranks[1] == ranks[3] || ranks[2] == ranks[4]) {
		return("Three of a kind");
	}
	// Check for 1 or 2 pairs
	var numPairs = 0;
	var numChecked = {};
	
	for(var i = 0; i < 5; i++) {
		var num = ranks[i];
		if(num in numChecked) {
			numPairs += 1;
		} else {
			numChecked[num] = true;
		}
	}
	// 2 pairs
	if(numPairs == 2) {
		return("Two pairs");
	}
	// 1 pair
	if(numPairs == 1) {
		return("One pair");
	}
	// No matches.
	return("No match");
}

app.use(express.static(__dirname + "/client"));

bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Express HTTP on port 3000
http.createServer(app).listen(3000);

app.post("/hand", function(req, res) {
	var hand = req.body;
	var handSet = [];
	var valid = true;
	
	// Check if the hand is valid -- no repeating cards and all values in proper range.
	for(var i = 0; i < 5; i++) {
		if(hand[i]["rank"] + "," + hand[i]["suit"] in handSet || hand[i]["rank"] < 2 || hand[i]["rank"] > 14 || hand[i]["suit"] < 1 || hand[i]["suit"] > 4) {
			valid = false;
		}
		handSet[hand[i]["rank"] + "," + hand[i]["suit"]] = true;
	}
	
	
	if(valid) {
		var highestHand = getHighestHand(hand);
		res.json(highestHand);
		
	} else {
		// The hand was not valid.
		res.json("Invalid hand");
	}
});

// set up our routes
app.get("/", function (req, res) {
	res.send("This is the root route.");
});

app.get("/hello", function (req, res) {
	res.send("Hello World!");
});

app.get("/goodbye", function (req, res) {
	res.send("Goodbye World!");
});
