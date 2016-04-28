var mongoose = require("mongoose"),
	ToDoSchema,
	ObjectId = mongoose.Schema.Types.ObjectId;

ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ],
	owner: { type: ObjectId, ref: "User" },
	custom: [{ key: String, value: String }]
	//custom: [{ name: String, value: String }]
});

//connect to amazeriffic mongodb store
mongoose.connect("mongodb://localhost/amazeriffic");

var ToDo = mongoose.model("ToDo", ToDoSchema);

module.exports = ToDo;