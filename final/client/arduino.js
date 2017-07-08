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
        // console.log(typeof(str[0]));
        // console.log(str[0]);
        var addr ;
        var lat = str_JSON['lat'];
        var lng = str_JSON['lng'];
        geocode(lat,lng,function(addr){
            console.log("addr");
            console.log(addr);
            str[0] = (str[0].replace("}",",\"address\":\""+addr+"\"}"));
           console.log(str[0]);
           //console.log(typeof(str[0]));
           //str[0] = JSON.parse(str[0]);
           

        request.post({
        url:'http://127.0.0.1:1337/lora',
        headers:{'Content-Type':'application/json'},
        body:str[0]
},function(error,response,body){
    //if (error)
       // console.log(error);
});

        })
     
 
  
    })
});

var geocode = function(lat,lng,callback){
    
      request.post({
    url:"https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key="+KEY,
//url:"https://maps.googleapis.com/maps/api/geocode/json?latlng=22.28,114.135&key=AIzaSyDfuIwvJiva_NMnShfOc22Jq7wTzItbr6M",
    },function(err,response,body){
 

    var data = JSON.parse(body);
    console.log(body);
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
    callback(address);

})
}



