var main = function () {
     "use strict";
 
     var url = "http://jimbarrell.com/fsw/getJSON.php?table=Issues";
     $.getJSON(url, function (Issues) {
		Issues.forEach(function(issue) {
			$issues[issue.ID] = issue;
		});
		
		createTables();
     });
 
     url = "http://jimbarrell.com/fsw/getJSON.php?table=Contacts";

     $.getJSON(url, function (Contacts) {
		Contacts.forEach(function(contact) {
			$contacts[contact.ID] = contact;
		});
		createTables();
     });
    
 
};

var createTables = function() {
	if(first) {
		first = 0;
		return;
	}
	
	var $issueRows=$("");
	Object.keys($issues).forEach(function (issue) {
		
		issue = $issues[issue];
		
		var relatedIssue = "null";
		if($issues[issue.RelatedIssue]) {
			relatedIssue = $issues[issue.RelatedIssue]["Title"];
		}
		
		var assignedTo = "null";
		if($contacts[issue.AssignedTo]) {
			assignedTo = $contacts[issue.AssignedTo]["Company"]
		}
		
		var openedBy = "null";
		if($contacts[issue.OpenedBy]) {
			openedBy = $contacts[issue.OpenedBy]["Company"]
		}
		
		$issueRows+="<tr><td>"+
		issue.ID+"</td><td>" +
		issue.Title+"</td><td>" +
		assignedTo+"</td><td>" +
		openedBy+"</td><td>" +
		issue.OpenedDate+"</td><td>" +
		issue.Status+"</td><td>" +
		issue.Category+"</td><td>" +
		issue.Priority+"</td><td>" +
		issue.Description+"</td><td>" +
		issue.DueDate+"</td><td>" +
		relatedIssue+"</td></tr>";
	});
	$("#tblIssues tbody").append($issueRows);
	
	var $rows=$("");
	Object.keys($contacts).forEach(function (contact) {
		contact = $contacts[contact];
		$rows+="<tr><td>"+
		contact.ID+"</td><td>" +
		contact.Company+"</td><td>" +
		contact.FirstName+"</td><td>" +
		contact.LastName+"</td><td>" +
		contact.EmailAddress+"</td><td>" +
		contact.JobTitle+"</td><td>" +
		contact.BusinessPhone+"</td></tr>";
	});
	$("#tblContacts tbody").append($rows);
}

var $contacts = {};
var $issues = {};
var first = 1;
 
$(document).ready(main);