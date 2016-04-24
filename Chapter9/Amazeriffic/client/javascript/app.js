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
			$.get("todos.json", function(newToDoObjects) {
				toDoObjects = newToDoObjects;
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
			$.get("todos.json", function(newToDoObjects) {
				toDoObjects = newToDoObjects;
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
			$.get("todos.json", function(newToDoObjects) {
				toDoObjects = newToDoObjects;
				var organizedByTag = organizeByTag(toDoObjects);
				
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
	
	//Custom Fields? Search? Tab
	tabs.push({
		"name": 	"Search",
		"content":	function(callback) {
			$.get("todos.json", function(newToDoObjects) {
				toDoObjects = newToDoObjects;
				var $elements = [];
				
				//var $searchKeyLabel = $("<span>").text("Search Field: ");
				//var $searchKeyInput = $("<input>").addClass("searchKeyInput");
				
				//var $searchValueLabel = $("<span>").text("Search Value: ");
				//var $searchValueInput = $("<input>").addClass("searchValueInput");
				
				//var $searchButton = $("<button>").text("Search");
				//$searchButton.on("click", function(event) {
				//	searchForTags();
				//});
				
				//$elements.push($searchKeyLabel);
				//$elements.push($searchKeyInput);
				//$elements.push($("<br>"));
				//$elements.push($searchValueLabel);
				//$elements.push($searchValueInput);
				//$elements.push($("<br>"));
				//$elements.push($searchButton);
				//$elements.push($("<br>"))
				//$elements.push($("<br>"))
				
				var $fieldList = $("<ul>");
				$fieldList.append($("<h3>").text("Click Field to Sort"));
				
				getFieldList(toDoObjects).forEach(function(field) {
					var $fieldItem = $("<li>").text(field);
					$fieldItem.css("cursor", "pointer");
					
					$fieldItem.on("click", function(event) {
						//textContent for FireFox, innerText for others
						searchForTags(event.target.innerText || event.target.textContent);
					});
					
					$fieldList.append($fieldItem);
				});
				$elements.push($fieldList);
				
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
	
	var addItemToList = function() {
		var $description = $("main .container .content .descriptionInput").val();
		var $tags = $("main .container .content .tagsInput").val().split(",");
		
		var newToDo = {"description": $description, "tags": $tags}
		//Add custom fields to 'newToDo'
		var $custNames = [];
		var $custValues = [];
		
		var i = 0;
		while(true) {
			var $fieldName = $("main .container .content .custNameInput:eq(" + i + ")").val();
			var $fieldValue = $("main .container .content .custValueInput:eq(" + i + ")").val();
			
			if(!($fieldName || $fieldValue)) {
				break;
			}
			
			newToDo[$fieldName] = $fieldValue;
			
			i+=1;
		}
		
		if($description != "" && $tags != "") {

			$.post("todos", newToDo, function(response) {
				//AJAX updates this now.
				//toDoObjects.push(newToDo);
	
				toDos = toDoObjects.map(function(toDo) {
					return toDo.description;
				});
				
				$("main .container .tabs a:first-child span").trigger("click");
			});		
			
			$("main .container .content .descriptionInput").val("");
			$("main .container .content .tagsInput").val("");
		}
	
	};
	
	var searchForTags = function($searchKey) {
		//var $searchKey = $("main .container .content .searchKeyInput").val();
		//var $searchValue = $("main .container .content .searchValueInput").val();
		
		var searchToDos = [];
		
		//For each todo
		for(var i = 0; i < toDoObjects.length; i++) {
			
			//For each custom tag
			for(var j = 0; j < toDoObjects[i]["custom"].length; j++) {
				
				//Bypass second -- testing custom tags a new way.
				if($searchKey == toDoObjects[i]["custom"][j]["key"]) {// && toDoObjects[i]["custom"][j]["value"].indexOf($searchValue) !== -1) {
					searchToDos.push(toDoObjects[i]);
					break;
				}
			}
		};
		
		//Set content to 'searchToDos'
		var organizedByTag = organizeByCustomTag(searchToDos, $searchKey);
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
		
		$("main .container .content").html($elements);
		
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
			if(toDo.tags.indexOf(tag) !== -1) {
				toDosWithTag.push(toDo);
			}
		});
		
		return {"name": tag, "toDos": toDosWithTag};
	});

	return tagObjects;
};

var organizeByCustomTag = function(toDoObjects, searchKey) {
	var tags = [];

	toDoObjects.forEach(function(toDo) {
		toDo.custom.forEach(function(tag) {
			if(tag["key"] == searchKey && tags.indexOf(tag["value"]) === -1) {
				tags.push(tag["value"]);
			}
		});
	});
	
	var tagObjects = tags.map(function(tag) {
		var toDosWithTag = [];
		toDoObjects.forEach(function(toDo) {
			toDo.custom.forEach(function(itemTags) {
				if(itemTags["value"] == tag) {
					toDosWithTag.push(toDo);
				}
			})
		});
		
		return {"name": tag, "toDos": toDosWithTag};
	});

	console.log(tagObjects);
	return tagObjects;
};

var getFieldList = function(toDoObjects) {
	var tags = [];
	
	toDoObjects.forEach(function(toDo) {
		toDo.custom.forEach(function(tag) {
			if(tags.indexOf(tag["key"]) === -1) {
				tags.push(tag["key"]);
			}
		});
	});
	
	return tags;
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