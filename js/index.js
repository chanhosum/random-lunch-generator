var fullListLength = 0;
var userList = [];
var item = "";
var timeOut;
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
            url: "https://random-lunch-list.herokuapp.com/getFullList/false",
            dataType: "json",
            success: function(data) {
                fullListLength = data.length;
                var noCount = 0;
                var yesCount = 0;
                for(var i in data) {
                    console.log(data[i]);
                    var idName;
                    if (data[i].properties == "notPicked") {
                        idName = "#notPickedList";
                        noCount++;
                    }else if (data[i].properties == "picked") {
                        idName = "#pickedList";
                        yesCount++;
                    }else{
                        idName = "#"+data[i].properties+"List";
                        noCount++;
                    }
                    $(idName).append("<li class='ui-state-default' value='"+data[i].name+"'>"+data[i].name+"</li>");
                }
                $("#no").html("未食："+noCount);
                $("#yes").html("已食："+yesCount);
                $("#all").html("全部："+data.length);
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
            pickOk:null,
            fullListLength: fullListLength,
            notPicked: $( "#notPickedList" ).sortable( "toArray",{attribute: 'value'} ),
            picked: $( "#pickedList" ).sortable( "toArray",{attribute: 'value'} )
        }
        var totalLength = 0;
        for(var i in userList){
            dbUpdateJSON[userList[i]] = $( "#"+userList[i]+"List" ).sortable( "toArray",{attribute: 'value'} );
            totalLength += $( "#"+userList[i]+"List" ).sortable( "toArray",{attribute: 'value'} ).length;
        }
        console.log(dbUpdateJSON);
        $.ajax({
            type: "POST",
            url: "https://random-lunch-list.herokuapp.com/updateFullList",
            contentType: 'application/json',
            data: JSON.stringify(dbUpdateJSON),
            success: function(data) {
                $(".loader").hide();
                totalLength += $( "#notPickedList" ).sortable( "toArray",{attribute: 'value'} ).length;
                $("#no").html("未食："+totalLength);
                $("#yes").html("已食："+$( "#pickedList" ).sortable( "toArray",{attribute: 'value'} ).length);
            }
        });
    });
    $( "#reset" ).on( "click", function( event) {
        var r = confirm("你是否要重設嗎？");
        if (r == true) {
            $.ajax({
                type: "POST",
                url: "https://random-lunch-list.herokuapp.com/reset",
                success: function(data) {
                    location.reload();
                }
            });
        }
    });
    $( "#pickOk" ).on( "click", function( event) {
        $(".loader").show();
        var dbUpdateJSON = {
            pickOk:item,
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
            url: "https://random-lunch-list.herokuapp.com/updateFullList",
            contentType: 'application/json',
            data: JSON.stringify(dbUpdateJSON),
            success: function(data) {
                location.reload();
            }
        });
    });
    function randomPickTemplate(item){
        var x = Math.floor((Math.random() * 15) + 1);
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
                    "<span class=\"line line2\"></span>" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                anime.timeline({loop: true})
                    .add({
                        targets: '.ml5 .line',
                        opacity: [0.5,1],
                        scaleX: [0, 1],
                        easing: "easeInOutExpo",
                        duration: 700
                    }).add({
                    targets: '.ml5 .line',
                    duration: 600,
                    easing: "easeOutExpo",
                    translateY: function(e, i, l) {
                        var offset = -0.625 + 0.625*2*i;
                        return offset + "em";
                    }
                }).add({
                    targets: '.ml5 .ampersand',
                    opacity: [0,1],
                    scaleY: [0.5, 1],
                    easing: "easeOutExpo",
                    duration: 600,
                    offset: '-=600'
                }).add({
                    targets: '.ml5 .letters-left',
                    opacity: [0,1],
                    translateX: ["0.5em", 0],
                    easing: "easeOutExpo",
                    duration: 600,
                    offset: '-=300'
                }).add({
                    targets: '.ml5 .letters-right',
                    opacity: [0,1],
                    translateX: ["-0.5em", 0],
                    easing: "easeOutExpo",
                    duration: 600,
                    offset: '-=600'
                }).add({
                    targets: '.ml5',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 6:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml6\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml6 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml6 .letter',
                        translateY: ["1.1em", 0],
                        translateZ: 0,
                        duration: 750,
                        delay: function(el, i) {
                            return 50 * i;
                        }
                    }).add({
                    targets: '.ml6',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 7:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml7\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml7 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml7 .letter',
                        translateY: ["1.1em", 0],
                        translateX: ["0.55em", 0],
                        translateZ: 0,
                        rotateZ: [180, 0],
                        duration: 750,
                        easing: "easeOutExpo",
                        delay: function(el, i) {
                            return 50 * i;
                        }
                    }).add({
                    targets: '.ml7',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
                /*
            case 8:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml8\">\n" +
                    "  <span class=\"letters-container\">\n" +
                    "    <span class=\"letters letters-left\">"+item+"</span>\n" +
                    "    <span class=\"letters bang\">!</span>\n" +
                    "  </span>\n" +
                    "  <span class=\"circle circle-white\"></span>\n" +
                    "  <span class=\"circle circle-dark\"></span>\n" +
                    "  <span class=\"circle circle-container\"><span class=\"circle circle-dark-dashed\"></span></span>\n" +
                    "</h1>");
                $(".result").show();
                anime.timeline({loop: true})
                    .add({
                        targets: '.ml8 .circle-white',
                        scale: [0, 3],
                        opacity: [1, 0],
                        easing: "easeInOutExpo",
                        rotateZ: 360,
                        duration: 1100
                    }).add({
                    targets: '.ml8 .circle-container',
                    scale: [0, 1],
                    duration: 1100,
                    easing: "easeInOutExpo",
                    offset: '-=1000'
                }).add({
                    targets: '.ml8 .circle-dark',
                    scale: [0, 1],
                    duration: 1100,
                    easing: "easeOutExpo",
                    offset: '-=600'
                }).add({
                    targets: '.ml8 .letters-left',
                    scale: [0, 1],
                    duration: 1200,
                    offset: '-=550'
                }).add({
                    targets: '.ml8 .bang',
                    scale: [0, 1],
                    rotateZ: [45, 15],
                    duration: 1200,
                    offset: '-=1000'
                }).add({
                    targets: '.ml8',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1400
                });

                anime({
                    targets: '.ml8 .circle-dark-dashed',
                    rotateZ: 360,
                    duration: 8000,
                    easing: "linear",
                    loop: true
                });
                break;*/
            case 8:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml9\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml9 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml9 .letter',
                        scale: [0, 1],
                        duration: 1500,
                        elasticity: 600,
                        delay: function(el, i) {
                            return 45 * (i+1)
                        }
                    }).add({
                    targets: '.ml9',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 9:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml10\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml10 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml10 .letter',
                        rotateY: [-90, 0],
                        duration: 1300,
                        delay: function(el, i) {
                            return 45 * i;
                        }
                    }).add({
                    targets: '.ml10',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 10:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml11\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"line line1\"></span>\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml11 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml11 .line',
                        scaleY: [0,1],
                        opacity: [0.5,1],
                        easing: "easeOutExpo",
                        duration: 700
                    })
                    .add({
                        targets: '.ml11 .line',
                        translateX: [0,$(".ml11 .letters").width()],
                        easing: "easeOutExpo",
                        duration: 700,
                        delay: 100
                    }).add({
                    targets: '.ml11 .letter',
                    opacity: [0,1],
                    easing: "easeOutExpo",
                    duration: 600,
                    offset: '-=775',
                    delay: function(el, i) {
                        return 34 * (i+1)
                    }
                }).add({
                    targets: '.ml11',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 11:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml12\">"+item+"</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml12').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml12 .letter',
                        translateX: [40,0],
                        translateZ: 0,
                        opacity: [0,1],
                        easing: "easeOutExpo",
                        duration: 1200,
                        delay: function(el, i) {
                            return 500 + 30 * i;
                        }
                    }).add({
                    targets: '.ml12 .letter',
                    translateX: [0,-30],
                    opacity: [1,0],
                    easing: "easeInExpo",
                    duration: 1100,
                    delay: function(el, i) {
                        return 100 + 30 * i;
                    }
                });
                break;
            case 12:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml13\">"+item+"</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml13').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml13 .letter',
                        translateY: [100,0],
                        translateZ: 0,
                        opacity: [0,1],
                        easing: "easeOutExpo",
                        duration: 1400,
                        delay: function(el, i) {
                            return 300 + 30 * i;
                        }
                    }).add({
                    targets: '.ml13 .letter',
                    translateY: [0,-100],
                    opacity: [1,0],
                    easing: "easeInExpo",
                    duration: 1200,
                    delay: function(el, i) {
                        return 100 + 30 * i;
                    }
                });
                break;
            case 13:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml14\">\n" +
                    "  <span class=\"text-wrapper\">\n" +
                    "    <span class=\"letters\">"+item+"</span>\n" +
                    "    <span class=\"line\"></span>\n" +
                    "  </span>\n" +
                    "</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml14 .letters').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml14 .line',
                        scaleX: [0,1],
                        opacity: [0.5,1],
                        easing: "easeInOutExpo",
                        duration: 900
                    }).add({
                    targets: '.ml14 .letter',
                    opacity: [0,1],
                    translateX: [40,0],
                    translateZ: 0,
                    scaleX: [0.3, 1],
                    easing: "easeOutExpo",
                    duration: 800,
                    offset: '-=600',
                    delay: function(el, i) {
                        return 150 + 25 * i;
                    }
                }).add({
                    targets: '.ml14',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 14:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml15\">\n" +
                    "  <span class=\"word\">"+item+"</span>\n" +
                    "</h1>");
                $(".result").show();
                anime.timeline({loop: true})
                    .add({
                        targets: '.ml15 .word',
                        scale: [14,1],
                        opacity: [0,1],
                        easing: "easeOutCirc",
                        duration: 800,
                        delay: function(el, i) {
                            return 800 * i;
                        }
                    }).add({
                    targets: '.ml15',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
            case 15:
                $(".result").empty();
                $(".result").append("<h1 class=\"ml16\">"+item+"</h1>");
                $(".result").show();
                // Wrap every letter in a span
                $('.ml16').each(function(){
                    $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
                });

                anime.timeline({loop: true})
                    .add({
                        targets: '.ml16 .letter',
                        translateY: [-100,0],
                        easing: "easeOutExpo",
                        duration: 1400,
                        delay: function(el, i) {
                            return 30 * i;
                        }
                    }).add({
                    targets: '.ml16',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                break;
        }
    }
    $("#pick").on("click",function (event) {
        clearTimeout(timeOut);
        $(".result").hide();
        $(".pickOk").hide();
        timeOut = setTimeout(function(){
            var randomArray = $( "#notPickedList" ).sortable( "toArray",{attribute: 'value'} );
            item = randomArray[Math.floor(Math.random()*randomArray.length)];
            randomPickTemplate(item);
            $(".result").show();
            $(".pickOk").show();
            }, 500);
    })

});