$(document).ready(function(){

            var clickcount =0;
            $("#inputword").click(function(){        
                $("input:text[name=word]").val(function(index,value){
                    clickcount +=1 ;         
                    var word = localStorage.setItem("input_list",value);
                       
                });
            var get_text = localStorage.getItem("input_list");
            $("#output").append(get_text+'<br />');
            //document.getElementById("output").innerHTML = localStorage.getItem("input_list");
            $("#click").text(clickcount);

        
    });

});



