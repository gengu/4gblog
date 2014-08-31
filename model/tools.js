var crypto = require('crypto');
var utility = require('utility');
//工具类
//提供各种加密工具
var tools = function(){};


//第一个参数表示要设置前多少位的参数 如果没有传递n参数或者该参数为空 则默认取16位
tools.prototype.createId = function(str,n) {
  if(typeof n === 'function'){
    callback = n;
    n = null;
  }
  if(n){
    var md5 = utility.md5(str);
    md5 = md5.slice(0,n);
    return md5;
  }else{
    var md5 = utility.md5(str);
    md5 = md5.slice(0,16);
    return md5;
  }
};

module.exports = tools ;