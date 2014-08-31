var m_db = require('../model/m_db') ;

var db = new m_db();

// db.getBlogByName('hadoop 架构',function(err,blog){
// 	console.log(err);
// 	console.log(blog);
// });

// db.getBlogsByCat('hadoop 生态',function(err,data){
// 	console.log(err);
// 	console.log(data);
// });

// db.blog.update({"_id" : "hadoop 架构"},{$unset:{blogs:0}})

// db.getCommentsByBlog('hadoop 架构',function(err,data){
// 	console.log(data);
// });

db.getAllBlogs(function(err,data){
	if(err){
		console.log(err);
	}
	console.log(data);
});

// db.getCatList();