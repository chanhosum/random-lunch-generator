$(document).ready(function(){
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function lowFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
    function getFullList(){
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getFullList/true",
            dataType: "json",
            success: function(data) {
                fullListLength = data.length;
                for(var i in data) {
                    $(".restaurant").append("<label for='checkbox-"+i+"'>"+data[i].name+"</label>\n"+
                        "        <input type='checkbox' class='in1' name='checkbox-"+i+"' id='checkbox-"+i+"'>");
                }
                $( ".in1" ).checkboxradio();
            }
        });
    }
    function getMemberList(){
        $.ajax({
            type: "GET",
            url: "https://random-lunch-list.herokuapp.com/getMemberList",
            dataType: "json",
            success: function(data) {
                fullListLength = data.length;
                for(var i in data) {
                    $(".member").append("<label for='mcheckbox-"+i+"'>"+capitalizeFirstLetter(data[i].name)+"</label>\n"+
                        "        <input type='checkbox' class='in2' name='mcheckbox-"+i+"' id='mcheckbox-"+i+"'>");
                }
                $( ".in2" ).checkboxradio();
            }
        });
    }
    getFullList();
    getMemberList();
    $( "#delete" ).on( "click", function( event) {
        var r = confirm("你是否要刪除嗎？");
        if (r == true) {
            var deleteArray = [];
            $('.restaurant .ui-checkboxradio-checked').each(function(){
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
    $( "#deleteMember" ).on( "click", function( event) {
        var r = confirm("你是否要刪除嗎？");
        if (r == true) {
            var deleteArray = [];
            $('.member .ui-checkboxradio-checked').each(function(){
                deleteArray.push(lowFirstLetter($(this)[0].innerText.trim()));
            });
            $.ajax({
                type: "POST",
                url: "https://random-lunch-list.herokuapp.com/deleteMember",
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
    $( "#addMember" ).on( "click", function( event) {
        var addText = $("#addMemberText").val();
        $.ajax({
            type: "POST",
            url: "https://random-lunch-list.herokuapp.com/addMember",
            contentType: 'application/json',
            data: JSON.stringify({text:lowFirstLetter(addText)}),
            success: function(data) {
                location.reload();
            }
        });
    });
});
