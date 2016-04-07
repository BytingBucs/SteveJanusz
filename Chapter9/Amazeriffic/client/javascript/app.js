var main = function(toDoObjects) {
	"use strict";
	
	var toDos,
		tabs;
	
	toDos = toDoObjects.map(function(toDo) {
		return toDo.description;
	});
	
	//START OF THE TABS SECTION
	tabs = [];
	
	//Newest Tab
	tabs.push({
		"name": 	"Newest",
		"content":	function(callback) {
			$.get("todos.json", function(toDoObjects) {
				var $content = $("<ul>");
				//Slice is needed so we do not modify the original array.
				toDos.slice().reverse().forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				callback($content);
			});
		}
	});
	
	//Oldest Tab
	tabs.push({
		"name": 	"Oldest",
		"content":	function(callback) {
			$.get("todos.json", function(toDoObjects) {
				var $content = $("<ul>");
				toDos.forEach(function(todo) {
					$content.append($("<li>").text(todo));
				});
				callback($content);
			});
		}
	});
	
	//Tags Tab
	tabs.push({
		"name": 	"Tags",
		"content":	function(callback) {
			$.get("todos.json", function(toDoObjects) {
				var organizedByTag = organizeByTag(toDoObjects);
				//console.log(organizedByTag);
				
				var $elements = [];
				
				organizedByTag.forEach(function(tag) {
					var $holder = $("<div>");
					var $tagName = $("<h3>").text(tag.name);
					var $content = $("<ul>");
						
					tag.toDos.forEach(function(description) {
						var $li = $("<li>").text(description);
						$content.append($li);
					});
					
					$holder.append($tagName);
					$holder.append($content);

					$elements.push($holder);
				});
				callback($elements);
			});
		}
	});
	
	//Add Tab
	tabs.push({
		"name": 	"Add",
		"content":	function(callback) {
			$.get("todos.json", function(toDoObjects) {
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
				callback($content);
			});
		}
	});
	
	//Add the tabs to the page
	tabs.forEach(function(tab) {
		var $aElement = $("<a>").attr("href", "#"),
			$spanElement = $("<span>").text(tab.name);
			
		$aElement.append($spanElement);
		
		$spanElement.on("click", function() {
			var $content;
			
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .container").empty();
			
			//get the content from the tab's content function
			tab.content(function($content) {
				$("main .container").append($content);
			});

			return false;
		});
		$("main .tabs").append($aElement);
	});
	
	//END OF THE TABS SECTION
	
	var addItemToList = function() {
		//Do the calls to the values need to be more specific?
		
		var $description = $("main .description").val();
		var $tags = $("main .tags").val().split(",");
		var newToDo = {"description": $description, "tags": $tags}

		if($description != "" && $tags != "") {

			$.post("todos", newToDo, function(response) {
				console.log(response);

				toDoObjects.push(newToDo);
	
				toDos = toDoObjects.map(function(toDo) {
					return toDo.description;
				});
			});		
			
			$("main .description").val("");
			$("main .tags").val("");
		}
	};
	
	$(".tabs a span").toArray().forEach(function(element) {
		var $element = $(element);
		$element.on("click", function() {
			$(".tabs a span").removeClass("active");
			$(element).addClass("active");
			$("main .content").empty();
			
			if($element.parent().is(":nth-child(2)")) {
			} else if($element.parent().is(":nth-child(3)")) {				
			} else if($element.parent().is(":nth-child(4)")) {			
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
			//console.log(toDo.tags);
			//console.log(toDo.tags.indexOf(tag));
			//console.log("-----");
			if(toDo.tags.indexOf(tag) !== -1) {
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