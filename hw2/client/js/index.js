// 當文件都下載完後執行
$(document).ready(function() {
    //$("#query").click();

    var deleteData = function(id) {
        // 刪除資料
        $.get("http://127.0.0.1:1337/delete/" + id, function(data, status) {
            console.log(data);
            // 對 #query 執行 click
            $('#query').click();
             alert("商品刪除成功");
        });
    };
    var updateData = function(iid, $data) {
        $.post("http://127.0.0.1:1337/update/" + iid, $data, function(data, status) {
            //$('#query').click();
            alert('商品更新完成');
        });
    };

    $('#query').on('click', function() {
        // 查詢資料
        console.log('find data');
        $.get("http://127.0.0.1:1337/query", function(data, status) {

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
           
            $("[data-id]").on('click', function() {
                var iid = $(this).attr('data-id');
                $btn = $('<button>').text('完成').attr({ 'class': 'btn btn-primary', 'data-id': iid });
                console.log('update click id');
                console.log(iid);

                $btn.on('click', function() {
                console.log('click finish');
                var iid = $(this).attr('data-id')
                $name = $('#inputName').val();
                $price = $('#inputPrice').val();
                $count = $('#inputCount').val();
                $data = { "name": $name, "price": $price, "count": $count };
                updateData(iid, $data);
                window.setTimeout('location.reload()', 100)
                console.log('data and iid');
                console.log(iid);
                console.log($data);
            })
            
                $("[data=" + iid + "]").find("#name").empty().append($('<input id="inputName" >'));
                $("[data=" + iid + "]").find("#price").empty().append($('<input id="inputPrice" >'));
                $("[data=" + iid + "]").find("#count").empty().append($('<input id="inputCount" >'));
                $("button[data-id=" + iid + "]").replaceWith($btn);
            });

            $("[del-id]").on('click', function() {
                var iid = $(this).attr('del-id');
                console.log('delete iid');
                console.log(iid);
                deleteData(iid);
               
            })
        });

    });
    $('#insert').on('click', function() {
        console.log('click');
        $td_name = $('#InputProductName').val();
        $td_price = $('#InputProductPrice').val();
        $td_count = $('#InputProductCount').val();
        $td = { name: $td_name, price: $td_price, count: $td_count };
        console.log($td);
        $.post('http://127.0.0.1:1337/insert/', $td);
        alert("商品新增成功");
    })
})