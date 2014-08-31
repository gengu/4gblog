var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var m_db = require('../model/m_db');
var multipart = require('connect-multiparty');
var markdown  = require('markdown').markdown;
var fs = require('fs'); 
var path = './public/images';
var multi = multipart({uploadDir: path });


var db = new m_db();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: '4gblog' });
});

router.get('/about',function(req,res){
  res.render('about',{});
});

router.get('/signin',function(req,res){
  res.render('signin',{});
});

router.post('/signin',function(req,res){
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.passwd).digest('hex');

  if(req.body.username == 'genxiaogu' && password == 'ec4ca912e02bafd7c9c997a8fabb1ac3'){
    var user = {
      username : req.body.username  
    }
    req.session.user = user ;
    res.redirect('/publish');
  }else{
    res.redirect('/signin');
  }
});

router.get('/publish',function(req,res){
  if(!req.session.user){
    res.redirect('/signin');
  }else{
    db.getCatList(function(err,data){
      if(err){
        res.redirect('/');
      }
      res.render('publish',{cats:data});
    });
  }
});

//发布页面
router.post('/publish',function(req,res){
  if(!req.body.title || !req.body.content){
    res.redirect('/publish');
  }else{
    var title = req.body.title;
    var content = req.body.content;
    // var content = markdown.toHTML(req.body.content);
    var cat = req.body.cat;
    var blog = {
      value : {
        'name':title,
        'gmt_create':new Date(),
        'content':content
      },
      cat : {
        '_id' :cat
      }
    }
    db.insertBlog(blog,function(err,data){
      if(err){
        res.send("对不起，插入失败！");
      }else {
        var blog = "/blog/"+data;
        res.charset = 'utf-8';
        res.redirect(blog);
      }
    });
  }
});

//博客页面
router.get('/blog/:blogid',function(req,res){
  if(req.params.blogid){
    db.getBlogById(req.params.blogid,function(err,blog){
      if(blog){
        content = markdown.toHTML(blog.content);

        console.log(content);
        blog.content = content;
        // blog.content = content.replace("alt=\"image\"","alt=\"image\" width=800px height=600px");
        console.log(blog.content);
        db.getAllBlogs(function(err,blogList){
          if(err){
            res.send("对不起，页面显示错误");
          }
          res.render('page',{blog:blog,blogList:blogList});
        });   
      }
      else {
        res.render('404', { title: '404' });
      }
    });
  }
});

router.post('/upload',multi,function(req,res){
  if(req.files && req.files.codecsv != 'undifined' ){
    var temp_path = req.files.codecsv.path;
    temp_path = temp_path.replace("public","");
      res.send({path:temp_path});
      res.json({success:1});
  }
});

module.exports = router;
