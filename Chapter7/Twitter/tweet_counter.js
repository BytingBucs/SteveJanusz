var ntwitter = require("ntwitter"),
	redis = require("redis"),
	credentials = require("./credentials.json"),
	redisClient,
	twitter,
	counts = {};

// twitter object
twitter = ntwitter(credentials);

//redis client
client = redis.createClient();

client.mget(["awesome", "cool", "rad", "gnarly", "groovy"], function(err, results) {
	if(err !== null) {
		//Print error and then exit.
		console.log("ERROR: " + err);
		return;
	}
	
	counts.awesome = parseInt(results[0], 10) || 0;
	counts.cool = parseInt(results[1], 10) || 0;
	counts.rad = parseInt(results[2], 10) || 0;
	counts.gnarly = parseInt(results[3], 10) || 0;
	counts.groovy = parseInt(results[4], 10) || 0;

	// set up our twitter stream with three parameters.
	twitter.stream(
		// string
		"statuses/filter",

		// array with words we are looking for
		{ "track": ["awesome", "cool", "rad", "gnarly", "groovy"] },

		// callback
		function(stream) {
			stream.on("data", function(tweet) {
				if(tweet.text.indexOf("awesome") > -1) {
					client.incr("awesome");
					counts.awesome += 1;
				}
				if(tweet.text.indexOf("cool") > -1) {
					client.incr("cool");
					counts.cool += 1;
				}
				if(tweet.text.indexOf("rad") > -1) {
					client.incr("rad");
					counts.rad += 1;
				}
				if(tweet.text.indexOf("gnarly") > -1) {
					client.incr("gnarly");
					counts.gnarly += 1;
				}
				if(tweet.text.indexOf("groovy") > -1) {
					client.incr("groovy");
					counts.groovy += 1;
				}
			});
		}
	);
	
});

// Awesome count every 3 seconds.
setInterval(function() {
	console.log("awesome: " + counts.awesome);
	console.log("cool: " + counts.cool);
	console.log("rad: " + counts.rad);
	console.log("groovy: " + counts.groovy);
	console.log("gnarly: " + counts.gnarly);
	console.log("----------------------");
}, 3000);

module.exports = counts;
