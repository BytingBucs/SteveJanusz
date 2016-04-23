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
				toDoObjects.slice().reverse().forEach(function(todo) {
					var $todoListItem = $("<li>").text(todo.description);
					var $todoRemoveLink = $("<a>").attr("href", "todos/"+todo._id);
					$todoRemoveLink.text("X");
					
					$todoRemoveLink.on("click", removeClick);
					
					$todoListItem.append($todoRemoveLink);
					$content.append($todoListItem);
				});
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				//Send error and null to callback.
				callback(error, null);
			});
		}
	});
	
	//Oldest Tab
	tabs.push({
		"name": 	"Oldest",
		"content":	function(callback) {
			$.get("todos.json", function(toDoObjects) {
				var $content = $("<ul>");
				toDoObjects.forEach(function(todo) {
					var $todoListItem = $("<li>").text(todo.description);
					var $todoRemoveLink = $("<a>").attr("href", "todos/"+todo._id);
					$todoRemoveLink.text("X");
					
					$todoRemoveLink.on("click", removeClick);
					
					$todoListItem.append($todoRemoveLink);
					$content.append($todoListItem);
				});
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				//Send error and null to callback.
				callback(error, null);
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
					var $tagName = $("<h3>").text(tag.name);
					var $content = $("<ul>");

					$content.append($tagName);
						
					tag.toDos.forEach(function(todo) {
						var $todoListItem = $("<li>").text(todo.description);
						var $todoRemoveLink = $("<a>").attr("href", "todos/"+todo._id);
						$todoRemoveLink.text("X");
						
						$todoRemoveLink.on("click", removeClick);
						
						$todoListItem.append($todoRemoveLink);
						$content.append($todoListItem);
					});

					$elements.push($content);
				});
				callback(null, $elements);
				
			}).fail(function(jqXHR, textStatus, error) {
				//Send error and null to callback.
				callback(error, null);
			});
		}
	});
	
	//Add Tab
	tabs.push({
		"name": 	"Add",
		"content":	function(callback) {
			var $content = [];
			
			//Original add field
			var $descLabel = $("<span>").text("Description: ");
			var $descInput = $("<input>").addClass("descriptionInput");
			$descInput.on("keypress", function(event) {
				if(event.keyCode === 13) {
					addItemToList();
				}
			});
			
			var $tagLabel = $("<span>").text("Tags: ");
			var $tagInput = $("<input>").addClass("tagsInput");
			$tagInput.on("keypress", function(event) {
				if(event.keyCode === 13) {
					addItemToList();
				}
			});
			
			//Custom add field(s)
			//Add button that adds a custom field line.
			var $addField = $("<button>").text("Add Custom Field");
			$addField.on("click", function(event) {
				//Add 2 labels, 2 buttons?
				var $custNameLabel = $("<span>").text("Field: ");
				var $custNameInput = $("<input>").addClass("custNameInput");
				
				var $custValueLabel = $("<span>").text("Value: ");
				var $custValueInput = $("<input>").addClass("custValueInput");
				
				$(".submitButton").before($custNameLabel);
				$(".submitButton").before($custNameInput);
				$(".submitButton").before($("<br>"));
				$(".submitButton").before($custValueLabel);
				$(".submitButton").before($custValueInput);
				$(".submitButton").before($("<br>"));
			});
			
			var $button = $("<button>").text("Submit");
			$button.addClass("submitButton");
			$button.on("click", function() {
				addItemToList();
			});
			
			$content.push($descLabel);
			$content.push($descInput);
			$content.push($("<br>"));
			
			$content.push($tagLabel);
			$content.push($tagInput);
			$content.push($("<br>"));
			
			$content.push($addField);
			$content.push($("<br>"));
			$content.push($button);
			
			callback(null, $content);
			
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
			$("main .container .content").empty();
			
			//get the content from the tab's content function
			tab.content(function(err, $content) {
				if(err !== null) {
					console.log("An error occured with your request");
					console.log(err);
				} else {
					$("main .container .content").append($content);
				}
			});

			return false;
		});
		$("main .container .tabs").append($aElement);
	});
	
	//END OF THE TABS SECTION
	
	var addItemToList = function() 
		var $description = $("main .container .content .descriptionInput").val();
		var $tags = $("main .container .content .tagsInput").val().split(",");
		var newToDo = {"description": $description, "tags": $tags}

		if($description != "" && $tags != "") {

			$.post("todos", newToDo, function(response) {
				toDoObjects.push(newToDo);
	
				toDos = toDoObjects.map(function(toDo) {
					return toDo.description;
				});
				
				$("main .container .tabs a:first-child span").trigger("click");
			});		
			
			$("main .container .content .descriptionInput").val("");
			$("main .container .content .tagsInput").val("");
		}
	
	};
	
	$("main .container .tabs a:first-child span").trigger("click");
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
				toDosWithTag.push(toDo);
			}
		});
		
		return {"name": tag, "toDos": toDosWithTag};
	});

	return tagObjects;
};

var removeClick = function(event) {
	$.ajax({
		url: "todos/" + event.target.pathname.split("/").slice(-1)[0],
		type: "DELETE",
		success: function(result) {
			console.log("Delete request");
		}
	}).done(function() {
		// Remove DOM element.
		console.log(event.target.parentNode.remove());
	});
	// return false so link is not followed.
	return false;
}

$(document).ready(function() {
	$.getJSON("todos.json", function(toDoObjects) {
		main(toDoObjects);
	}).fail(function(jqXHR, textStatus, error) {
		//ToDo list was empty.
		main([]);
	});;
});