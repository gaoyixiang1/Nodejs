//模块1：负责启动服务
//模块2：负责扩展req,res对象，给他们增加一些api
//模块3：负责路由判断
//模块4：负责处理具体路由处理
//模块5：负责进行数据库操作
//模块6：负责保存各种项目中用到的配置信息


//1.加载http模块
var http = require("http");
var context = require('./context.js');
var router = require('./router.js');
var _ = require('underscore');
var config = require('./config');
// 2.创建服务
http.createServer(function (req, res) {

    context(req,res);
    router(req,res);

}).listen(8080, function () {
    console.log('http://localhost:'+config.port);
});