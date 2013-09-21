var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'kookbook');
exports.mongoose = mongoose;
exports.db = db;