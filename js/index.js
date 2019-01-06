$(document).ready(function(){
    function getFullList(){
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getFullList",
            dataType: "json",
            success: function(data) {
                for(var i in data){
                    console.log(data[i]);
                    var idName;
                    if(data[i].properties=="notPicked"){
                        idName = "#notPickedList";
                    }else{
                        idName = "#"+data[i].properties+"List";
                    }
                    $(idName).append("<li class='ui-state-default'>"+data[i].name+"</li>");
                }
                $( ".connectedSortable" ).sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            }
        });
    }
    getFullList();
});