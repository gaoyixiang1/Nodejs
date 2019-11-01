//一.引入模块
var http=require('http');
var fs=require('fs');
var url=require('url');
var querystring=require('querystring');
//创建数组对象，实现动态添加数据
var msgs=[
    {name:'思涵', content : '你好，我是思涵，跟高兴认识你',create_at:'2019-11-1 11:00:20'},
    {name:'小刘', content : '今天有没有好好学习呢',create_at:'2019-11-2 11:00:20'}
];
//二.创建服务器
var server=http.createServer();
//三.监听
server.on('request',function(req,res){
//获取当前请求地址
var currentUrl=req.url;
//判断请求地址
 if(currentUrl=='/'){
     //请求‘/’加载留言板列表
    fs.readFile('./view/index.html','utf8',function(err,data){
        if(err) res.end('404 not found');
        //遍历数组，拼接数据JQ.each  js forEach()
        var html='';
        msgs.forEach(function(item){
            //<li class="list-group-item">张三1说：今天天气不错<span class="pull-right">2018-11-11</span></li>
            //传统：+拼接
            //Es6:反引号，遍历$(变量名)输出（js最新语法）
            html+=
           `
            <li class="list-group-item">
                ${item.name}说：${item.content}
            <span class="pull-right">${item.create_at}</span>
            </li>
           `
            
        })
//将获取的里面的笑脸替换
        var  data=data.replace('^_^',html);
        res.setHeader('Content-Type','text/html;charset=utf-8');
        res.write(data);
        res.end();
    })
 }else if(currentUrl=='/add'){
    //请求‘/’加载留言板列表
   fs.readFile('./view/add.html','utf8',function(err,data){
       if(err) res.end('404 not found');
       res.setHeader('Content-Type','text/html;charset=utf-8');
       res.write(data);
       res.end();
   })
}else if(currentUrl.indexOf('/public')===0){
    //检查静态资源并响应
   fs.readFile('./'+currentUrl,'utf8',function(err,data){
       if(err) res.end('404 Not found');
    //    res.setHeader('Content-Type','text/html;charset=utf-8');
       res.write(data);
       res.end();
   })
}else if(currentUrl.indexOf('/doadd')===0){
//表单提交参数
    if(req.method=='POST'){
        var postData='';
        req.on('data',function(chunk){
            postData+=chunk;
        });
        req.on('end',function(){
            paramObj=querystring.parse(postData);
            console.log(paramObj);
            //入库
            var d= new Date();
    var date=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var msg={name:paramObj.name,content:paramObj.content,create_at:date};
    msgs.push(msg);
    //3.跳转
    res.statusCode=302;
    res.setHeader('Location','/');
    res.end();
        });
    } else{
    // 1.接受数据
        var paramObj=url.parse(req.url,true).query;
        console.log(paramObj);
    // 2.入库，放进数组
    var d= new Date();
    var date=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+'-'+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
    var msg={name:paramObj.name,content:paramObj.content,create_at:date};
    msgs.push(msg);
    //3.跳转
    res.statusCode=302;
    res.setHeader('Location','/');
    res.end();
    }
}
else{
      //404
   fs.readFile('./view/404.html','utf8',function(err,data){
    if(err) res.end('404 not found');
    res.setHeader('Content-Type','text/html;charset=utf-8');
    res.write(data);
    res.end();
     })
    }
})
//四启动服务器
   server.listen('8080',function(){
        console.log('启动成功,请访问http://localhost:8080');

    })