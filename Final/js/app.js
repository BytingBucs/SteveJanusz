var main = function () {
     "use strict";
 
     var url = "http://jimbarrell.com/fsw/getJSON.php?table=Issues";
     $.getJSON(url, function (Issues) {
		$issues = Issues;
		createTables();
     });
 
     url = "http://jimbarrell.com/fsw/getJSON.php?table=Contacts";

     $.getJSON(url, function (Contacts) {
		$contacts = Contacts;
		createTables();
     });
    
 
};

var createTables = function() {
	if(first) {
		first = 0;
		return;
	}
	
	var $issueRows=$("");
	$issues.forEach(function (issue) {
		$issueRows+="<tr><td>"+
		issue.ID+"</td><td>" +
		issue.Title+"</td><td>" +
		issue.AssignedTo+"</td><td>" +
		issue.OpenedBy+"</td><td>" +
		issue.OpenedDate+"</td><td>" +
		issue.Status+"</td><td>" +
		issue.Category+"</td><td>" +
		issue.Priority+"</td><td>" +
		issue.Description+"</td><td>" +
		issue.DueDate+"</td><td>" +           
		issue.RelatedIssue+"</td></tr>";
		//$list.append($contact);
	});
	$("#tblIssues tbody").append($issueRows);
	
	var $rows=$("");
	$contacts.forEach(function (contact) {
		$rows+="<tr><td>"+
		contact.ID+"</td><td>" +
		contact.Company+"</td><td>" +
		contact.FirstName+"</td><td>" +
		contact.LastName+"</td><td>" +
		contact.EmailAddress+"</td><td>" +
		contact.JobTitle+"</td><td>" +
		contact.BusinessPhone+"</td></tr>";
		//"</tr><td>&nbsp;</td>";
		//contact.BusinessPhone+"</td></tr><td>&nbsp;</td>";
		//$list.append($contact);
	});
	$("#tblContacts tbody").append($rows);
}

var $contacts;
var $issues;
var first = 1;
 
$(document).ready(main);