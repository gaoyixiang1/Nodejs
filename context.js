//模块2：负责扩展req,res对象，给他们增加一些api
//1.为req增加一个query属性，用于保存get请求过来的数据

//2.为req增加一个pathname属性

//3.为res增加一个render方法



var fs = require('fs');
var url = require('url');
var _ = require('underscore');
var mime = require('mime');

//让当前模块向外暴露一个函数，通过这个函数讲index.js的req,res传入context.js里面
module.exports = function (req,res) {
    var urlObj = url.parse(req.url.toLowerCase(), true);
    req.query = urlObj.query;
    req.pathname = urlObj.pathname;
    req.method = req.method.toLowerCase();
    res.render = function (filename, tplData) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                res.writeHead(404, 'Not found', { 'Content-Type': 'text/html;charset=utf-8' });
                res.end('404', 'Not found');
                return;
            }
            if (tplData) {
                //如果用户传递了tpldata，表示要进行模板替换
                var fn = _.template(data.toString('utf8'));
                data = fn(tplData);
            }
            res.setHeader('Content-Type', mime.getType(filename));
            res.end(data);
        });

    }
}
//封装步骤：
// 1.思考，该模块中要封装什么代码
//2.思考，这些代码有没有用到外部的属性？如果用到了，是否需要通过参数将这些数据
// 传入到当前模块
// 3.当前模块需要对外暴露的值