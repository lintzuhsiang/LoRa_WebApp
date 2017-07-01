var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var ObkectID = require('mongodb').ObjectID;
// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
var uri = 'mongodb://127.0.0.1/b02901069';

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;
var id = 0;
var coll_name = 'data';

var server = http.createServer(function(req, res) {
    console.log(id);
    console.log(coll_name);
    // 解析使用者要求的路徑名稱
    let urlData = url.parse(req.url);

    let action = urlData.pathname;

    console.log(action);
    console.log('method:' + req.method);
    let actionlist = action.split('/');
    console.log(actionlist);

   
    if (/get_location/i.test(actionlist[1])) {
        var productList = [];
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            console.log("query 主機連接成功");
            db.collection(coll_name).find().toArray(function(err, data) {
                productList = data;
                console.log(data);
                //productList = { "id": iid, "name": data.name, "price": data.price, "count": data.count, "status": true };
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(JSON.stringify(productList));
                res.end();
                db.close();


            });

        })
    } else if (/get_speed/i.test(actionlist[1])) {
        //var speed = [];
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            console.log("get speed 連接成功");
            db.collection(coll_name).find().toArray(function(err, data) {
                var speed = data[data.length-1];
                console.log(speed);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(JSON.stringify(speed));
                res.end();
                db.close();
            })
        })
    }else if (/lora/i.test(actionlist[1])){
        var data = [];
        req.on('data',function(chunk){
            data.push(chunk);
        });
        req.on('end',function(){
            data = Buffer.concat(data).toString();
            data = JSON.parse(data);
             console.log("data");
             console.log(data);
            // var product = qs.parse(data);
            // console.log("product"); 
            // product = {"id":data.id,"sensor":"gps","time":data['time'],"counter":data.counter,"lng":data.lng,"lat":data.lat};
            // //product = { "id": id, "name": product.name, "price": product.price, "count": product.count, status: true };
            // console.log(product);

        MongoClient.connect(uri,function(err,db){
            if (err) throw err;
            console.log('lora 連接成功');
            db.collection(coll_name).insert(data);
        })
        // res.writeHead(200,{
        //     'Content-Type':'application/json',

        // })
    } )
}
    else {
        res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
        res.write('<h1>Server 正常<h1>');
        res.end();
    }

});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);