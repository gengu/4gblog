var m_db = require('../model/m_db') ;

function test_insert_cat(){
	db = new m_db();
	var cat = {
		value : {
			'_id':'大数据的一些思考',
			'gmt_create':'2014-08-09 12:11:14',
			blogs:[]
		}
	}

	var blog = {
		value : {
			'_id':'fqefqefqefqerfqeqf',
			'name':'hadoop 架构',
			'gmt_create':'2014-08-09 12:11:14',
			'content':'hadoop 是个牛逼的分布式系统，包括MR计算框架和HDFS文件系统'
		},
		cat : {
			'_id' :'hadoop 生态'
		}
	}

	var comment = {
		value : {
			'email':'xxxx@xxx.com',
			content:'文章很不错' 
		},
		blog:{
			'_id':'hadoop 架构' 
		}
	}

	// db.insertComment(comment,function(err,result){
	// 	// console.log(err);
	// 	// console.log(result) ;
	// });
	db.insertCat(cat,function(err,result){
		console.log(err);
		console.log(result) ;
	});
	// db.insertBlog(blog,function(err,result){
	// 	console.log(err);
	// 	console.log(result);
	// })
}

test_insert_cat();

