//模块4：负责处理具体路由处理
var fs = require('fs');
var querystring = require('querystring');
var path = require('path');
var config = require('./config.js');
//1./index的具体处理


module.exports.index = function (req, res) {
    readJson(function (list) {
        res.render(path.join(config.viewPath, 'index.html'), { list: list });
    })
}

//2.submit的具体处理
module.exports.submit = function (req, res) {
    res.render(path.join(config.viewPath, 'submit.html'));

}


//3.item的具体处理
module.exports.item = function (req, res) {
    readJson(function (list_news) {

        var model = null;
        //循环news的数据,找到和id相同的数据
        for (var i = 0; i < list_news.length; i++) {

            if (list_news[i].id == req.query.id) {
                model = list_news[i];
                break;
            }

        }
        if (model) {
            res.render(path.join(config.viewPath, 'item.html'), { news: model });
        } else {

            res.end('no such');
        }
    })

}


//4.get添加新闻
module.exports.addGet = function (req, res) {
    readJson(function (list) {
        req.query.id = list.length;
        list.push(req.query);
        writeJson(JSON.stringify(list), function () {
            res.statusCode = 302;
            res.statusMessage = 'found';
            res.setHeader('Location', '/');
            res.end();
        });
    })
}


//5.post添加新闻
module.exports.addPost = function (req, res) {
    readJson(function (list) {
        postBody(req, function (postdata) {
            postdata.id = list.length + 1;
            list.push(postdata);

            writeJson(JSON.stringify(list),function(){
                res.statusCode = 302;
                res.statusMessage = 'found';
                res.setHeader('location', '/');
                res.end();
            })
        })

    });    
}

module.exports.static = function(req,res){
    res.render(path.join(__dirname, req.url)); 
}


module.exports.fourZeroFour = function(req,res){
    res.writeHead(404, 'Not found', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.end('404', 'Not found');
}

//封装一个读data.json文件的函数
//在有异步执行的函数。必须通过回调函数封装
function readJson(callback) {
    fs.readFile(config.dataPath, 'utf8', function (err, data) {
        if (err && err.code !== 'ENOENT') {
            throw err;
        }
        //读取到的新闻数据
        var list = JSON.parse(data || '[]');
        callback(list);
    });
}

//封装一个写入data.json文件的方法
function writeJson(data, callback) {
    fs.writeFile(config.dataPath, data, function (err) {
        if (err) {
            throw err;
        }
        callback();

    })
}

//封装一个获取用户post提交数据的方法
function postBody(req, callback) {
    var array = [];
    req.on('data', function (chunk) {
        //chunk是一个buffer 对象
        array.push(chunk);
    });
    req.on('end', function () {
        var postbody = Buffer.concat(array);
        postbody = postbody.toString('utf8');
        postbody = querystring.parse(postbody);
        callback(postbody);

    });
}