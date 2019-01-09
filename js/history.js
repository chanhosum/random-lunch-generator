$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "https://random-lunch-list.herokuapp.com/getHistory",
        dataType: "json",
        success: function (data) {
            var html = "";
            for (var i in data) {
                html += "  <tr>\n" +
                    "    <td>"+data[i].name+"</td>\n" +
                    "    <td>"+data[i].time+"</td>\n" +
                    "    <td><button class=\"ui-button ui-widget ui-corner-all deleteButton\" id='"+data[i].utc+"'>刪除</button></td>\n" +
                    "  </tr>";
            }
            $("#table").append(html);
            $( ".deleteButton" ).on( "click", function( event) {
                var r = confirm("你是否要刪除嗎？");
                if (r == true) {
                    $.ajax({
                        type: "POST",
                        url: "https://random-lunch-list.herokuapp.com/deleteHistory",
                        contentType: 'application/json',
                        data: JSON.stringify({time:event.target.id}),
                        success: function(data) {
                            location.reload();
                        }
                    });
                }
            });
        }
    });
    $.ajax({
        type: "GET",
        url: "https://random-lunch-list.herokuapp.com/getFullList/true",
        dataType: "json",
        success: function(data) {
            fullListLength = data.length;
            for(var i in data) {
                if(data[i].properties!="picked"){
                    $("#table2").append("<tr><td><button class=\"ui-button ui-widget ui-corner-all eat\"' id='"+data[i].name+"'>"+data[i].name+"</button></td></tr>");
                }
            }
            $( ".eat" ).on( "click", function( event) {
                $.ajax({
                    type: "POST",
                    url: "https://random-lunch-list.herokuapp.com/eat",
                    contentType: 'application/json',
                    data: JSON.stringify({name:event.target.id}),
                    success: function(data) {
                        location.reload();
                    }
                });
            });
        }
    });
});