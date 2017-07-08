var file = 'COM4';
var http = require('http');
var url = require('url');
var path = require('path');
var request = require('request');
var SerialPort = require('serialport');
var serialport = new SerialPort('COM4',{baudrate:9600,parser:SerialPort.parsers.readline('\n')});

var KEY = 'AIzaSyDfuIwvJiva_NMnShfOc22Jq7wTzItbr6M';

serialport.on('open',function(){
    console.log("serial port open");
    serialport.on('data',function(data){
        var str = data.toString();
        str = str.replace("with RSSI","");
        str = str.split("'");
        var str_JSON = JSON.parse(str[0]);
        
        console.log("str_JSON");
        console.log(str_JSON);
        call(22.22,114.135);
        //geocode(str_JSON.lat,str_JSON.lng);
        //var address = geocode();
        //console.log("address");
        //console.log(address);
        request.post({
    url:'http://127.0.0.1:1337/lora',
    headers:{'Content-Type':'application/json'},
    body:str[0]
},function(error,response,body){
    //if (error)
       // console.log(error);
});

    })
});
// console.log(str[0]);

var geocode = function(){
// var llat = lat;
// var llng = lng;
// var return_address="hello";
//var call =
//var address = call(lat,lng);
//console.log("geocode address");
//console.log(address);
//return address;
};
//var call=function(lat,lng){}

// function doCall(urlToCall, callback) {
//     urllib.request(urlToCall, { wd: 'nodejs' }, function (err, data, response) {                              
//         var statusCode = response.statusCode;
//         finalData = getResponseJson(statusCode, data.toString());
//         return callback(finalData);
//     });
// }

function call(lat,lng,callback){ 
     var data = "";
       request.post({
    //url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+llat+","+llng+"&key="+KEY,
url:"https://maps.googleapis.com/maps/api/geocode/json?latlng=22.28,114.135&key=AIzaSyDfuIwvJiva_NMnShfOc22Jq7wTzItbr6M",
},function(err,response,body){

    var data = JSON.parse(body);
    data = data.results[0]["address_components"];
    var list = [];

    for (var i in data){
        list[i] = data[i];
    }
    var address = "";
    for (var i in list){
        address += list[i].long_name;
        if (i==list.length-1){
            address = address + ".";
        }else
            address = address + ",";
    }
    console.log("address");
    console.log(address);
    if (callback)
        return callback(address);
    //return_address = address;
   // return return_address;
   
//return address;
   data = address;

    //console.log(return_address);
})
}


// var method1 = function(a1,a2){
// ....處理其他事務.....
// var r1 = ...;
// var r2 = ...;//處理好的資料
// 	$.post("經緯度轉地址之URL",{a1,a2},function(err,data){
// 		var addr = 處理地址(data).....//取得編好的地址
// 		$.post("資料庫位址",{r1,r2,addr});
// 	});
// }
// main(){
// 	method1(經度,緯度);
// }