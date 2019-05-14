$(function() {

    function isNull(val) {
        return val === null || val === undefined || val === "";
    }

    $(".headerBack .icon").click(function() {
        layer.msg("Your click is a secret.", {
            offset: "200px"
        });
    });

    $(".headerBack #searchText").focus(function() {
        $(this).css("box-shadow", "0 0 8px 0px #eee");
    });

    $(".headerBack #searchText").blur(function() {
        $(this).css("box-shadow", "");
    });

    $(".headerBack .changeStyle").click(function() {
        layer.alert("I'm Sorry, you have no right to admire other style.", {
            offset: "200px"
        });
    });


    
    $(".headerBack .submit").click(function() {
        var searchText = $("#searchText").val();
        if (isNull(searchText)) {
            layer.alert("You have to offer your idea.", {
                offset: "200px"
            });
            return;
        }
        layer.alert("Sorry, this function have not finished.", {
            offset: "200px"
        });
    });
})