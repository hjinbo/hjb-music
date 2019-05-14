$(function() {

    // MV是否被点击过
    var isVideoPlaying = [false, false, false, false, false, false, false, false];
    
    // MV部分
    $(".hotMVListsDiv .hotMVLists .hotMV .content").mouseover(function() {
        $(this).css("opacity", "1");
        $(this).css("background", "rgba(0, 0, 0, .5)");
        $(this).css("transition", "1s");
        $(this).css("-webkit-transition", "1s");
    });

    $(".hotMVListsDiv .hotMVLists .hotMV .content").mouseout(function() {
        var curId = $(this).parent().attr("id").replace("mv", "");
        // 已点击过的MV将失去隐藏video的样式
        if (!isVideoPlaying[curId]) {
            $(this).css("opacity", "0");
            $(this).css("background", "");
        }
    });

    $(".hotMVListsDiv .hotMVLists .hotMV .content .playIcon").click(function() {
        $(this).siblings("video").attr("controls", "controls");
        var curId = $(this).parent().parent().attr("id");
        // 截取最后下标
        curId = curId.replace("mv", "");
        isVideoPlaying[curId] = true;
        // 隐藏播放图标
        $(this).css("display", "none");
        // 触发播放视频事件(得用原生js，同audio一样)
        var video = document.getElementById($(this).parent().parent().attr("id")).children[0].children[0];
        video.play();
    });
})