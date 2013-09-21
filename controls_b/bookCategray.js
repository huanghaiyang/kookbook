var BookCategrayModel = require('../models/bookCategray').BookCategrayModel ; 
var BookCategray = function(){}
BookCategray.prototype.get = function(name , callback){
	BookCategrayModel.findOne({"name" : name},"" , function(err , bookCategray){
		if(err)
			return callback(err) ; 
		callback(err , bookCategray) ; 
	}) ; 
} ;
BookCategray.prototype.save = function(bookCategrayin , callback){
	var bookCategray = new BookCategrayModel({
		name : bookCategrayin.name , 
		ename : bookCategrayin.ename ,
		memo : bookCategrayin.memo ,
		createDate : new Date()
	}) ; 
	if(bookCategrayin.parentCategray.id)
	{
		BookCategrayModel.findById(bookCategrayin.parentCategray.id , "" , function(err , parentCategray){
			if(err)
				return callback(err) ; 
			else
			{
				if(parentCategray)
				{
					bookCategray.parentCategray = [bookCategrayin.parentCategray.id] ; 
					bookCategray.upstage = 1 ; 
					bookCategray.save(callback) ;
				}
			}
		}) ;
	}
	else
	{
		bookCategray.upstage = 0 ; 
		bookCategray.save(callback) ;
	}
};
BookCategray.prototype.getCategraySimple = function(callback){
	var query = BookCategrayModel.find({}, "name") ; 
	var promise = query.exec();
	promise.addBack(function (err, categraies) {
		if(err)
			return callback(err) ; 
		else
			return callback(err , categraies) ; 
	});
}
BookCategray.prototype.listCategraiesAllByJson_bk = function(skip , limit , queryCondition , callback)
{
	var t_count = 0 ; 
	BookCategrayModel.count({} , function(error , count){
		if(error)
			return callback(error) ; 
		else
			t_count = count ; 
		if(t_count == 0)
			return callback(error , t_count , null) ; 
		var likeQuery = {} ; 
		var equalQuery = {} ; 
		if(queryCondition)
		{
			for(var p in queryCondition)
			{
				if(queryCondition.hasOwnProperty(p)){
					var key = p.split("_")[0] ; 
					var condition = p.split("_")[1] ; 
					var value = queryCondition[p] ; 
					if(condition == "equal")
					{
						if(value)
							equalQuery[key] = value ; 
					}
					else if(condition.toLowerCase() == "like")
					{
						if(value)
							likeQuery[key] = new RegExp(value , 'ig') ; 
					}
				}
			}
		}
		var query = BookCategrayModel.find(likeQuery) ; 
		if(equalQuery)
		{
			for(var p in equalQuery)
			{
				if(equalQuery.hasOwnProperty(p)){
					query = query.where(p).equals(equalQuery[p]) ; 
				}
			}
		}
		query.skip(skip).limit(limit).sort("createDate").select("name ename") ;
		query.exec(function (err, categraies) {
			if(err)
				return callback(err) ; 
			else
				return callback(err , t_count , categraies) ; 
		});
	}) ; 
}
BookCategray.prototype.getOneCatagrayInfo = function(id , callback){
	BookCategrayModel
		.findById(id)
		.populate('parentCategray')
		.exec(function (err, categray) {
		  if (err) return callback(err);
		  callback(err , categray) ; 
		}) ;
}
BookCategray.prototype.deleteOneCatagray = function(id , callback){
	BookCategrayModel.findByIdAndRemove(id , function(err , categray){
		if(err)
			return callback(err) ;
		return callback(err , categray) ;  
	}) ; 
}
module.exports.BookCategrayDao = new BookCategray() ; 