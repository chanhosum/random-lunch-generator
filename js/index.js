var fullListLength = 0;
var userList = [];
$(document).ready(function(){

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    function getUser() {
        $.ajax({
            type: "GET",
            url: "http://localhost:8099/getUser",
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
            url: "http://localhost:8099/getFullList/false",
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
    $( "#reset" ).on( "click", function( event) {
        var r = confirm("你是否要重設嗎？");
        if (r == true) {
            $.ajax({
                type: "POST",
                url: "http://localhost:8099/reset",
                success: function(data) {
                    location.reload();
                }
            });
        }
    });
    function randomPickTemplate(item){
        var x = Math.floor((Math.random() * 4) + 1);
        switch (x) {
            case 1:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml1\">\n" +
                    "                  <span class=\"text-wrapper\">\n" +
                    "                    <span class=\"line line1\"></span>\n" +
                    "                    <span class=\"letters\">"+item+"</span>\n" +
                    "                    <span class=\"line line2\"></span>\n" +
                    "                  </span>\n" +
                    "                </h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml1 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml1 .letter',
                        scale: [0.3,1],
                        opacity: [0,1],
                        translateZ: 0,
                        easing: "easeOutExpo",
                        duration: 600,
                        delay: function(el, i) {
                            return 70 * (i+1)
                        }
                    }).add({
                    targets: '.ml1 .line',
                    scaleX: [0,1],
                    opacity: [0.5,1],
                    easing: "easeOutExpo",
                    duration: 700,
                    offset: '-=875',
                    delay: function(el, i, l) {
                        return 80 * (l - i);
                    }
                }).add({
                    targets: '.ml1',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 2:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml2\">"+item+"</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml2').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml2 .letter',
                        scale: [4,1],
                        opacity: [0,1],
                        translateZ: 0,
                        easing: "easeOutExpo",
                        duration: 950,
                        delay: function(el, i) {
                            return 70*i;
                        }
                    }).add({
                    targets: '.ml2',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 3:
                $(".result").empty();
                $(".result").append("<h1 class='ml3'>"+item+"</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml3').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml3 .letter',
                        opacity: [0,1],
                        easing: "easeInOutQuad",
                        duration: 2250,
                        delay: function(el, i) {
                            return 150 * (i+1)
                        }
                    }).add({
                    targets: '.ml3',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 4:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml4\">\n" +
                    "  <span class=\"letters letters-1\">"+item+"</span>\n" +
                    "</h1>");
                $(".result").show();
                var ml4 = {};
                ml4.opacityIn = [0,1];
                ml4.scaleIn = [0.2, 1];
                ml4.scaleOut = 3;
                ml4.durationIn = 800;
                ml4.durationOut = 600;
                ml4.delay = 500;

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml4 .letters-1',
                        opacity: ml4.opacityIn,
                        scale: ml4.scaleIn,
                        duration: ml4.durationIn
                    }).add({
                    targets: '.ml4 .letters-1',
                    opacity: 0,
                    scale: ml4.scaleOut,
                    duration: ml4.durationOut,
                    easing: "easeInExpo",
                    delay: ml4.delay
                }).add({
                    targets: '.ml4 .letters-2',
                    opacity: ml4.opacityIn,
                    scale: ml4.scaleIn,
                    duration: ml4.durationIn
                }).add({
                    targets: '.ml4 .letters-2',
                    opacity: 0,
                    scale: ml4.scaleOut,
                    duration: ml4.durationOut,
                    easing: "easeInExpo",
                    delay: ml4.delay
                }).add({
                    targets: '.ml4 .letters-3',
                    opacity: ml4.opacityIn,
                    scale: ml4.scaleIn,
                    duration: ml4.durationIn
                }).add({
                    targets: '.ml4 .letters-3',
                    opacity: 0,
                    scale: ml4.scaleOut,
                    duration: ml4.durationOut,
                    easing: "easeInExpo",
                    delay: ml4.delay
                }).add({
                    targets: '.ml4',
                    opacity: 0,
                    duration: 500,
                    delay: 500
                });
                break;
            case 5:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml5\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"line line1\"></span>\n" +
                    "    <span class=\"letters letters-left\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
        }
    }
    $("#pick").on("click",function (event) {
        var randomArray = $( "#notPickedList" ).sortable( "toArray",{attribute: 'value'} );
        var item = randomArray[Math.floor(Math.random()*randomArray.length)];
        randomPickTemplate(item);
    })
















    $('.ml2').each(function(){
        $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
    });

    anime.timeline({loop: true})
        .add({
            targets: '.ml2 .letter',
            scale: [4,1],
            opacity: [0,1],
            translateZ: 0,
            easing: "easeOutExpo",
            duration: 950,
            delay: function(el, i) {
                return 70*i;
            }
        }).add({
        targets: '.ml2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });












});