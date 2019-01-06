$(document).ready(function(){
    function getFullList(){
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getFullList/true",
            dataType: "json",
            success: function(data) {
                fullListLength = data.length;
                for(var i in data) {
                    $(".restaurant").append("<label for='checkbox-"+i+"'>"+data[i].name+"</label>\n"+
                        "        <input type='checkbox' name='checkbox-"+i+"' id='checkbox-"+i+"'>");
                }
                $( "input" ).checkboxradio();
            }
        });
    }
    getFullList();
    $( "#delete" ).on( "click", function( event) {
        var r = confirm("你是否要刪除嗎？");
        if (r == true) {
            var deleteArray = [];
            $('.ui-checkboxradio-checked').each(function(){
                deleteArray.push($(this)[0].innerText.trim());
            });
            $.ajax({
                type: "POST",
                url: "https://random-lunch-list.herokuapp.com/delete",
                contentType: 'application/json',
                data: JSON.stringify(deleteArray),
                success: function(data) {
                   location.reload();
                }
            });
        }
    });
    $( "#add" ).on( "click", function( event) {
        var addText = $("#addText").val();
        $.ajax({
            type: "POST",
            url: "https://random-lunch-list.herokuapp.com/add",
            contentType: 'application/json',
            data: JSON.stringify({text:addText}),
            success: function(data) {
                location.reload();
            }
        });
    });
});
