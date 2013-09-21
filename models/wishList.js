var mongoDoc = require('./db');
var mongoose = mongoDoc.mongoose;
var db = mongoDoc.db;

var WishListSchame = mongoose.Schame({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	books: [
		type: mongoose.Schema.Types.ObjectId,
		ref: 'books'
	],
	createDate: {
		type: Date,
		default: new Date()
	},
	wishNumber: {
		type； Number,
		default: 0
	},
	receivedNumber: {
		type； Number,
		default: 0
	},
	priorityLevel: {
		type； Number,
		default: 0,
		enum: [0, 1, 2, 3, 4]
	},
	comment: {
		title: {
			type: String,
			default: 'I like it !'
		},
		content: {
			type: String
		}
	}
});

var WishListModel = db.model("wishlist", WishListSchame, "wishlists");
module.exports.WishListModel = WishListModel;
module.exports.WishListSchame = WishListSchame;