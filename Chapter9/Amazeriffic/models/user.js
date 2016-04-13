var mongoose = require("mongoose");

// Mongoose model for users
var UserShema = mongoose.Schema({
	username: String,
});

var User = mongoose.model("User", UserSchema);

module.exports = User;