//mongodb配置
var settings = require('../settings') ;
	mongodb = require('mongodb') ;
	Server = require('mongodb').Server ;
	Db = require('mongodb').Db;
	DBRef = require('mongodb').DBRef ;
var tools = require('./tools.js');
var util = require('util');


var m_db = function(){
}

m_db.prototype.insertCat = function(data,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err, db) {
		//插入类别
		var collection = db.collection('cat');
		collection.insert(data.value,{w:1}, function(err, result) {
			collection.findOne(data.value, function(err, item) {
				db.close();
				return callback(err,data.value._id);
			});
		});
	})
};

//插入文章要做两个步骤1：把文章写入到数据库 2：把文章的id和文章名写入到类目
m_db.prototype.insertBlog = function(data,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err, db) {
		var collection = db.collection('blog');
		//插入到文章表中
		var tool = new tools();
		var id = tool.createId(data.value.name,8)
		data.value._id = id;
		collection.insert(data.value,{w:1}, function(err, result) {
			if(err){
				return callback(err); 
			}
			var tool = new tools();
			var collection1 = db.collection('cat');
			collection.findOne(data.value,function(err,blog){
				collection1.update(data.cat,{$push:{blogs:{id:data.value._id,name:data.value.name}}},function(err,result){
					db.close();
					if(err){
						console.log(err);
						return callback('插入失败！');
					}
					return callback(err,data.value._id);
				});
			});
		});
	});
};

//插入评论
m_db.prototype.insertComment = function(data,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err, db) {
		var collection = db.collection('comment');
		//插入到文章表中
		collection.insert(data.value,{w:1}, function(err, result) {
			if(err){
				return callback(err);
			}

			var collection1 = db.collection('blog');
			// var dbref = new DBRef('comment',data.value._id);

			collection.findOne(data.value,function(err,blog){
				collection1.update(data.blog,{$push:{comments : data.value._id}},function(err,result){
					db.close();
					if(err){
						return callback('插入失败！');
					}
					return callback(err,data.value._id);
				});
			});
		});
	});
} ; 

//获取文章按照id
m_db.prototype.getBlogById = function(id,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('blog');
		collection.findOne({_id:id},function(err,result){
			db.close();
			if(err){
				return callback('Query Error!');
			}
			return callback(null,result);
		});
	});
};

//获取文章按文章名
m_db.prototype.getBlogByName  = function(name,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('blog');
		collection.findOne({name:name},function(err,result){
			db.close();
			if(err){
				return callback('Query Error!');
			}
			return callback(result);
		});
	});
};

//返回文章名按照类目
m_db.prototype.getBlogsByCat = function(cat,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('cat');
		collection.findOne({_id:cat},function(err,result){
			db.close();
			return callback(err,result.blogs);
		});
	}); 
} ;



//返回评论 引用根本就不是必须的
m_db.prototype.getCommentsByBlog = function(blog,callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('blog');
		collection.findOne({_id:blog},function(err,data){
			var comments = data.comments ;
			var collection1 = db.collection('comment');
			var result = [];
			for(var c_id in comments){
				collection1.findOne({_id:comments[c_id]},function(err,data){
					result.push(data);
					if(c_id == comments.length-1){
						db.close();
						return callback(err,result);
					}
				}) ;
			}
		});
	}); 
};

//获取类别列表
m_db.prototype.getCatList = function(callback){
var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('cat');
		result = [];
		collection.find().toArray(function(err,data){
			db.close();
			for (var i in data){
				result.push(data[i]._id);
			}
			return callback(null,result);
		});
	}); 
}


//返回所有文章
m_db.prototype.getAllBlogs = function(callback){
	var db = new Db('4gblog',new Server(settings.host,settings.port),{safe:true}) ;
	db.open(function(err,db){
		if(err){
			return callback('Connecttion Error!');
		}
		var collection = db.collection('cat');
		collection.find().toArray(function(err,result){
			db.close();
			console.log(console.log(util.inspect(result, { showHidden: true, depth: null })));
			return callback(err,result);
		});
	}); 
} ;

module.exports = m_db ;




