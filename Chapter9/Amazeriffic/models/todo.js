var mongoose = require("mongoose");
	
var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});

//connect to amazeriffic mongodb store
mongoose.connect("mongodb://localhost/amazerrific");

var ToDo = mongoose.model("ToDo", ToDoSchema);

module.exports = ToDo;