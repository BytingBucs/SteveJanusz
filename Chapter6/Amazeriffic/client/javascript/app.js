var main = function(toDoObjects) {
	"use strict";
	
	var toDos = toDoObjects.map(function(toDo) {
		return toDo.description;
	});
	
	var addItemToList = function() {
		var $description = $("main .content .description").val();
		var $tags = $("main .content .tags").val().split(",");
		var newToDo = {"description": $description, "tags": $tags}

		if($description != "" && $tags != "") {

			$.post("todos", newToDo, function(response) {
				console.log(response);

				toDoObjects.push(newToDo);
	
				toDos = toDoObjects.map(function(toDo) {
					return toDo.description;
				});
			});		
			
			$("main .content .description").val("");
			$("main .content .tags").val("");
		}
	};
	
	$(".tabs a span").toArray().forEach(function(element) {
		var $element = $(element);
		$element.on("click", function() {
			$(".tabs a span").removeClass("active");
			$(element).addClass("active");
			$("main .content").empty();
			
			if($element.parent().is(":nth-child(1)")) {
				
				var $content = $("<ul>");
				
				//Slice is needed so we do not modify the original array.
				toDos.slice().reverse().forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				$("main .content").append($content);
				
			} else if($element.parent().is(":nth-child(2)")) {
				
				var $content = $("<ul>");
				toDos.forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				$("main .content").append($content);
			
			} else if($element.parent().is(":nth-child(3)")) {
				console.log("The tags tab was clicked.")
				
				var organizedByTag = organizeByTag(toDoObjects);
				console.log(organizedByTag);
				
				organizedByTag.forEach(function(tag) {
					var $tagName = $("<h3>").text(tag.name);
					var $content = $("<ul>");
						
					tag.toDos.forEach(function(description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					
					$("main .content").append($tagName);
					$("main .content").append($content);
				});
				
			} else if($element.parent().is(":nth-child(4)")) {

				var $content = $("<div>");
				
				var $inputLabel = $("<span>").text("Description: ");
				var $input = $("<input>").addClass("description");
				$input.on("keypress", function(event) {
					if(event.keyCode === 13) {
						addItemToList();
					}
				});
				
				var $tagLabel = $("<span>").text("Tags: ");
				var $tagInput = $("<input>").addClass("tags");
				$input.on("keypress", function(event) {
					if(event.keyCode === 13) {
						addItemToList();
					}
				});
				
				var $button = $("<button>").text("Add");
				$button.on("click", function() {
					addItemToList();
				});
				
				$content.append($inputLabel);
				$content.append($input);
				$content.append($("<br>"));
				
				$content.append($tagLabel);
				$content.append($tagInput);
				$content.append($("<br>"));
				
				$content.append($button);
				$("main .content").append($content);
			
			}
			
			return false;
		});
	});
	
	$(".tabs a:first-child span").trigger("click");
};

var organizeByTag = function(toDoObjects) {
	var tags = [];

	toDoObjects.forEach(function(toDo) {
		toDo.tags.forEach(function(tag) {
			if(tags.indexOf(tag) === -1) {
				tags.push(tag);
			}
		});
	});
	
	var tagObjects = tags.map(function(tag) {
		var toDosWithTag = [];
		toDoObjects.forEach(function(toDo) {
			if(toDo.tags.indexOf(tag !== -1)) {
				toDosWithTag.push(toDo.description);
			}
		});
		
		return {"name": tag, "toDos": toDosWithTag};
	});
	return tagObjects;
};

$(document).ready(function() {
	$.getJSON("todos.json", function(toDoObjects) {
		main(toDoObjects);
	});
});