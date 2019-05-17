# LoRa_WebApp 專案

Architecture 
    Two Arduino Uno with LoRa shield, one sends LoRa data and one recieves LoRa data . 
    Receiver Arduino saves Time, Location, Speed, Address (Google Api) data into MongoDB database. 
    Write a webpage to visualize the data.
    
    
使用本專案前請先執行

```
npm install
```
會將必要的 package 安裝完成

---

## MongoDB Server 的設定 --Windows

### Server 的程式 

```
"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath .\database
```

### Client 的程式  

```
"C:\Program Files\MongoDB\Server\3.4\bin\mongo.exe" --host 127.0.0.1
```

### Client 的指令

查看有那些 database
```
show dbs
```

使用或建立 device 資料庫
```
use device
```

準備要新增的 document
```js
{"sid":"s001","name":"LoRa_c1"}
```

新增準備好的 document
```
db.device.insert({"sid":"s001","name":"LoRa_c1"})
```

查詢是否新增成功
```
db.device.find()
```

離開Client程式
```
exit
```

## Node.js 的設定

建立專案 package.json
```
npm init
```

安裝 mongoDB driver
```
npm install mongodb --save
```

宣告 MongoClient 變數

```js
var MongoClient = require('mongodb').MongoClient;
```

宣告 Azure 主機字串

```js
var url = 'mongodb://<endpoint>:<password>@<endpoint>.documents.azure.com:10250/?ssl=true';
```

宣告本機字串
```js
var url = 'mongodb://127.0.0.1/school';
```

連接 MongoDB 主機
```js
MongoClient.connect(url, function(err, db) {
console.log('主機連線成功');
db.close();
});
```
## 定義 WebApi

### 查詢device資料
```
http://127.0.0.1:1337/find/device
```

### 新增學生資料使用 post
```
http://127.0.0.1:1337/insert/device/
```

key | value
:--:|:-----:
s001| LoRa_c1

表單範例
```html
<form action="http://127.0.0.1:1337/insert/student/" method="post">
    學號：<input type="text" name="sid"><br>
    姓名：<input type="text" name="name">
    <input type="submit" value="Submit">
</form>
```

### 新增device資料使用 get

```
http://127.0.0.1:1337/insert/device/?sid=s001&name=LoRa_c1
```

### 新增學生資料直接使用 url

```
http://127.0.0.1:1337/insert/device/s001/LoRa_c1
```

