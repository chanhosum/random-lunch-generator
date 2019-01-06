var fullListLength = 0;
var userList = [];
$(document).ready(function(){

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function getUser() {
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getUser",
            dataType: "json",
            success: function (data) {
                var userHtml = "";
                for (var i in data) {
                    userList.push(data[i].name);
                    userHtml +=
                        "<div class='banList'>\n" +
                        "    <p>" + capitalizeFirstLetter(data[i].name) + "</p>\n" +
                        "    <ul id='" + data[i].name + "List' class='connectedSortable'>\n" +
                        "    </ul>\n" +
                        "</div>";
                }
                $(".ban").html(userHtml);
                getFullList();
            }
        });
    }
    function getFullList(){
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getFullList",
            dataType: "json",
            success: function(data) {
                fullListLength = data.length;
                for(var i in data) {
                    console.log(data[i]);
                    var idName;
                    if (data[i].properties == "notPicked") {
                        idName = "#notPickedList";
                    }else if (data[i].properties == "picked") {
                        idName = "#pickedList";
                    }else{
                        idName = "#"+data[i].properties+"List";
                    }
                    $(idName).append("<li class='ui-state-default' value='"+data[i].name+"'>"+data[i].name+"</li>");
                }
                $( ".connectedSortable" ).sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            }
        });
    }
    getUser();
    $( "#save" ).on( "click", function( event) {
        $(".loader").show();
        var dbUpdateJSON = {
            fullListLength: fullListLength,
            notPicked: $( "#notPickedList" ).sortable( "toArray",{attribute: 'value'} ),
            picked: $( "#pickedList" ).sortable( "toArray",{attribute: 'value'} )
        }
        for(var i in userList){
            dbUpdateJSON[userList[i]] = $( "#"+userList[i]+"List" ).sortable( "toArray",{attribute: 'value'} );
        }
        console.log(dbUpdateJSON);
        $.ajax({
            type: "POST",
            url: "http://localhost:8099/updateFullList",
            contentType: 'application/json',
            data: JSON.stringify(dbUpdateJSON),
            success: function(data) {
                $(".loader").hide();
            }
        });
    });
});