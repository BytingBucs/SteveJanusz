var main = function() {
	"use strict";
	
	$("select").on("change", function() {
		
		var hand = {
			0: {"rank": $("select:eq(0)").val(), "suit": $("select:eq(1)").val()},
			1: {"rank": $("select:eq(2)").val(), "suit": $("select:eq(3)").val()},
			2: {"rank": $("select:eq(4)").val(), "suit": $("select:eq(5)").val()},
			3: {"rank": $("select:eq(6)").val(), "suit": $("select:eq(7)").val()},
			4: {"rank": $("select:eq(8)").val(), "suit": $("select:eq(9)").val()}
		}
			
		console.log(hand);
		
		$.post("/hand", hand, function(response) {
			$(".result").text(response); // or $(this).val()
		});
	});
}

$(document).ready(main);
