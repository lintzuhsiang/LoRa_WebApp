var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');
var ObkectID = require('mongodb').ObjectID;
// 利用 mongodb 的 driver 宣告一個 MongoClient
var MongoClient = require('mongodb').MongoClient;

// 宣告要連接的主機位置
//var uri = 'mongodb://140.112.28.194/b02901069';
var uri = 'mongodb://127.0.0.1/b02901069';

// 設定 port 預設為 1337，若系統環境有設定則以系統環境設定為主
var port = process.env.PORT || 1337;
var id = 0;
var coll_name = 'hw2';

var productList = [{
        "id": "001",
        "name": "米家掃地機器人",
        "price": 8895,
        "count": 1,
        "state": true
    },
    {
        "id": "002",
        "name": "小米體重計",
        "price": 665,
        "count": 1,
        "state": true
    },
    {
        "id": "003",
        "name": "小米手環2",
        "price": 865,
        "count": 1,
        "state": true
    }
];

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

    if (/query/i.test(actionlist[1])) {
        var productList = []
            // 這裡執行資料查詢的動作 (請自行完成)
            // TODO: db.product.find(id) 
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            console.log("query 主機連接成功");
            db.collection(coll_name).find().toArray(function(err, data) {
                productList = data;
                //productList = { "id": iid, "name": data.name, "price": data.price, "count": data.count, "status": true };
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.write(JSON.stringify(productList));
                res.end();
                db.close();
            });
        });

    } else if (/delete/i.test(actionlist[1])) {
        var iid = actionlist[2];

        console.log(iid);
        // 這裡執行刪除資料的動作 (請自行完成)
        // TODO: db.product.delete(id) 
        MongoClient.connect(uri, function(err, db) {
            console.log("delete 主機連接成功");
            db.collection(coll_name).remove({ "id": +iid });
        })


        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(JSON.stringify(iid));
        res.end();

    } else if (/insert/i.test(actionlist[1]) && /post/i.test(req.method)) {

        // 取得 post 資料
        var data = [];
        req.on('data', function(chunk) {
            data.push(chunk);
        });
        req.on('end', function() {
            data = Buffer.concat(data).toString();
            console.log('post data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);
            console.log(product);
            product = { "id": id, "name": product.name, "price": product.price, "count": product.count, status: true };
            //product = data;
            console.log('insert product');
            console.log(product);
            // 這裡執行插入資料的動作 (請自行完成)
            // TODO: db.product.insert(product) 

            MongoClient.connect(uri, function(err, db) {
                if (err) throw err;
                console.log("insert 主機連接成功");
                db.collection(coll_name).insert(product);
                //var iid = db.collection(coll_name).find({ "id": 003 });
                //console.log('iid');
                //console.log(iid);
            })



            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.write(JSON.stringify(product));
            res.end();

        })
        id = id + 1;
    } else if (/update/i.test(actionlist[1]) && /post/i.test(req.method)) {
        // 取得 post 資料
        var data = [];
        req.on('data', function(chunk) {
            data.push(chunk);
        });
        req.on('end', function() {
            data = Buffer.concat(data).toString();
            console.log('update data: ' + data);

            // 將 post 資料格式轉成 json
            var product = qs.parse(data);
            var iid = actionlist[2];
            console.log(iid);
            // console.log(type(iid));
            console.log(product);
            // TODO: db.product.update(product) 
            MongoClient.connect(uri, function(err, db) {
                if (err) throw err;
                console.log("update 主機連接成功");

                db.collection(coll_name).update({ "id": +iid }, { $set: { "id": +iid, "name": product.name, "price": product.price, "count": product.count, "status": true } });

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                })
                res.write(JSON.stringify(product));
                res.end();
                db.close();
            })
        })

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<h1>Server 正常<h1>');
        res.end();
    }

});

// 啟動並等待連接
server.listen(port);
console.log('Server running at http://127.0.0.1:' + port);