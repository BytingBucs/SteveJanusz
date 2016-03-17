var main = function() {
	"use strict";

	var insertCountsIntoDOM = function(counts) {
		$("h2").text("Awesome count: " + counts.awesome);
	};

	// update every 5 seconds.
	setInterval(function() {
		$.getJSON("counts.json", insertCountsIntoDOM);
	}, 5000);
}

$(document).ready(main);
