var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;
var AdminSchema = mongoose.Schema({
	name: {
		type: String
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	createDate: {
		type: Date,
		default: new Date()
	}
});
var AdminModel = db.model("admin", AdminSchema, "admins");
module.exports.AdminModel = AdminModel;
module.exports.AdminSchema = AdminSchema;