$(document).ready(function () {

    $("#get_speed").click(function () {
        $('speedbut').empty();
        console.log('get speed');
        $.get("http://127.0.0.1:1337/get_speed", function (data, status) {
            console.log(data.speed);
            $button = $('<button class="btn btn-primary">').text('speed= ' + data.speed);
            $('speedbut').append($button);
        })

    })

    $("#location").click(function () {
        console.log('click location');
        $.get("http://127.0.0.1:1337/get_location", function (data, status) {
            console.log('location data');

            $('markers').empty();
            for (var i in data) {
                //$('marker').empty();
                $marker = $('<marker>').attr({
                    id: (+i + 1),
                    //name: data[i].name,
                    address: data[i].address,
                    lat: data[i].lat,
                    lng: data[i].lng,
                    type: data[i].type,
                })
                $('markers').append($marker);
            }
            $("marker").each(function (index) {

                //name = $(this).attr("name");
                name = "Address";
                address = $(this).attr('address');
                type = $(this).attr('type');
                var point = new google.maps.LatLng(
                    parseFloat(this.getAttribute('lat')),
                    parseFloat(this.getAttribute('lng')));
                var infowincontent = document.createElement('div');
                var strong = document.createElement('strong');
                strong.textContent = "Address";
                var infoWindow = new google.maps.InfoWindow;
                infowincontent.appendChild(strong);
                infowincontent.appendChild(document.createElement('br'));
                //console.log(parseFloat(this.getAttribute('lng')));
                var text = document.createElement('text');
                text.textContent = address;
                infowincontent.appendChild(text);
                var icon = customLabel[type] || {};
                var marker = new google.maps.Marker({
                    map: map,
                    position: point,
                    label: icon.label,

                });
                marker.addListener('click', function () {
                    infoWindow.setContent(infowincontent);
                    infoWindow.open(map, marker);
                });

            })

        })
    })


})


function downloadurl(data, callback) {
    for (var i in data) {
        $name = data[i].name;
        $address = data[i].address;
        $lat = data[i].lat;
        $lng = data[i].lng;

    }
}
var deleteData = function (id) {
    // 刪除資料
    $.get("http://127.0.0.1:1337/delete/" + id, function (data, status) {
        console.log(data);
        // 對 #query 執行 click
        $('#query').click();
    });
};
var updateData = function (iid, $data) {
    $.post("http://127.0.0.1:1337/update/" + iid, $data, function (data, status) {
        //$('#query').click();
        alert('商品更新完成');
    });
};

$('#query').on('click', function () {
    // 查詢資料
    console.log('find data');
    $.get("http://127.0.0.1:1337/query", function (data, status) {

        $('tbody').empty();

        update = [];
        del = [];
        for (var i in data) {
            // 宣告需要的DOM元件
            $tdIndex = $('<td id="index">').text(+i + 1);
            $tdName = $('<td id="name">').text(data[i].name);
            $tdPrice = $('<td id="price">').text(data[i].price);
            $tdCount = $('<td id="count">').text(data[i].count);

            $btnUpdate = $('<button>').attr('class', 'btn btn-primary').text('修改').attr('data-id', data[i].id);
            $btnFinish = $('<button>').text('完成').attr({ 'class': 'btn btn-primary' });
            $btnDel = $('<button>').text('刪除').attr({ 'del-id': data[i].id, 'class': 'btn btn-primary' });

            $tr = $('<tr>').append($tdIndex)
                .append($tdName)
                .append($tdPrice)
                .append($tdCount)
                .append($btnUpdate)
                .append($btnDel);
            $tr.attr('data', data[i].id);
            // 將 tr 插入到 tbody
            $('tbody').append($tr);
        }
        $btnFinish.on('click', function () {
            console.log('click finish');
            var iid = $(this).attr('data-id')
            $name = $('#inputName').val();
            $price = $('#inputPrice').val();
            $count = $('#inputCount').val();
            $data = { "name": $name, "price": $price, "count": $count };
            updateData(iid, $data);
            console.log('data and iid');
            console.log(iid);
            console.log($data);
        })


        $("[data-id]").on('click', function () {
            var iid = $(this).attr('data-id');
            $btn = $('<button>').text('完成').attr({ 'class': 'btn btn-primary', 'data-id': iid });
            console.log('update click id');
            console.log(iid);
            $("[data=" + iid + "]").find("#name").empty().append($('<input id="inputName" >'));
            $("[data=" + iid + "]").find("#price").empty().append($('<input id="inputPrice" >'));
            $("[data=" + iid + "]").find("#count").empty().append($('<input id="inputCount" >'));
            $("button[data-id=" + iid + "]").replaceWith($btn);
        });

        $("[del-id]").on('click', function () {
            var iid = $(this).attr('del-id');
            console.log('delete iid');
            console.log(iid);
            deleteData(iid);
        })
    });

});
$('#insert').on('click', function () {
    console.log('click');
    $td_name = $('#InputProductName').val();
    $td_price = $('#InputProductPrice').val();
    $td_count = $('#InputProductCount').val();
    $td = { name: $td_name, price: $td_price, count: $td_count };
    console.log($td);
    $.post('http://127.0.0.1:1337/insert/', $td);
    alert("商品新增成功");
})