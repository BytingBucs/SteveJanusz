var ntwitter = require("ntwitter"),
	credentials = require("../credentials.json"),
	twitter,
	counts = {};

// twitter object
twitter = ntwitter(credentials);

counts.awesome = 0;
// counts.cool = 0;
// counts.rad = 0;
// counts.gnarly = 0;
// counts.groovy = 0;

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
				counts.awesome += 1;
			}
		});
	}
);

// Awesome count every 3 seconds.
setInterval(function() {
	console.log("awesome: " + counts.awesome);
}, 3000);

module.exports = counts;
