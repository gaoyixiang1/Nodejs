//模块3：负责路由判断
var fs = require('fs');
var querystring = require('querystring');
var path = require('path');
var handle = require('./handle.js');
module.exports = function (req, res) {
    if (req.url === '/' || req.url === '/index' && req.method === 'get') {
        //    1.读取data.json文件中的数据，并将读取到的数据转换为list数组
       handle.index(req,res);

    } else if (req.url.startsWith('/item') && req.method === 'get') {
        handle.item(req,res);

    } else if (req.url.startsWith('/submit.html') && req.method === 'get') {
        handle.submit(req,res);
    } else if (req.url.startsWith('/add') && req.method === 'get') {
        // 1.获取数据 url.parse
        handle.addGet(req,res);

        //3.跳转新闻列表页面 

    } else if (req.url === '/add' && req.method === 'post') {
        handle.addPost(req,res);
    } else if (req.url.startsWith('/css') && req.method === 'get') {
        handle.static(req,res);
    }
    else {
       handle.fourZeroFour(req,res);
    }
}



