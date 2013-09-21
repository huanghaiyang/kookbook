var AdminModel = require('../models/admin').AdminModel ; 
var Admin = function(){} 
Admin.prototype.get = function(adminname , callback){
	AdminModel.findOne({"name" : adminname},"" , function(err , admin){
		if(err)
			return callback(err) ; 
		callback(err , admin) ; 
	}) ; 
} ;
Admin.prototype.save = function(adminin , callback){
	var admin = new AdminModel({
		name : adminin.name , 
		password : adminin.password 
	}) ; 
	admin.save(callback) ; 
};
module.exports = new Admin() ; 