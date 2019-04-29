$(function() {

    var showPlayer = false;
    var showSongList = false;
    var silence = false;
    var timer;
    var processTimer;
   
    initTimer();

    // 显示隐藏整个播放器
    $(".show").mouseenter(function() {
        if (!showPlayer) {
            $(".musicPlayer").css("left", "0px");
            $(".show span").css("transform", "rotate(180deg)");
            showPlayer = true;
        } else {
            $(".musicPlayer").css("left", "-480px");
            $(".show span").css("transform", "rotate(0deg)");
            showPlayer = false;
        }
    });

    // 显示隐藏歌曲列表
    $(".playerDiv .player .rightOther .showPlayerList").click(function() {
        if (!showSongList) {
            $(".playerDiv .playerList").css("height", "200px");
            showSongList = true;
        } else {
            $(".playerDiv .playerList").css("height", "0px");
            showSongList = false;
        }
    });

    // 静音
    $("#silence").click(function() {
        if (!silence) {
            $(this).css("background-position", "-60px -170px");
            $("#curVolume").css("width", "0");
            var player = document.getElementById("musicAudio");
            player.volume = 0;
            silence = true;
        }
    });

    // 调整音量大小（点击的方式,暂不支持拖动）
    $("#maxVolume").click(function(event) {
        var x = event.pageX - $("#curVolume").offset().left;
        $("#curVolume").css("width", x);
        var player = document.getElementById("musicAudio");
        var maxVolume = parseInt($(this).css("width").replace("px", ""));
        var setVolume = x / maxVolume;
        player.volume = setVolume;
        if (x > 0) {
            $("#silence").css("background-position", "0 -170px");
            silence = false;
        }
    });

    // 调节播放进度(点击的方式，暂不支持拖动)
    $(".playerDiv .songProcess").click(function() {
        var x = event.pageX - $(".playerDiv .songProcess .curProcess").offset().left;
        $(".playerDiv .songProcess .curProcess").css("width", x);
        var maxProcess = parseInt($(this).css("width").replace("px", ""));
        var percent = x / maxProcess;
        if (percent > 1) {
            percent = 1;
        }
        var player = document.getElementById("musicAudio");
        var maxTime = player.duration;
        if (maxTime === undefined || maxTime === null) {
            return;
        }
        var curTime = Math.floor(maxTime * percent);
        player.currentTime = curTime;
    });

    // 适应播放器的位置
    $(window).scroll(function() {
        var scrolls = $(this).scrollTop();
        $(".musicPlayer").css("top", scrolls + 150);
    });

    function intervalFormat(time) {
        var minute = Math.floor(time / 60);
        var second = Math.floor(time % 60);
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        return minute + ":" + second;
    }

    function curTimeDisplay() {
        var player = document.getElementById("musicAudio");
        var curTime = intervalFormat(player.currentTime);
        $(".songTime #curTime").text(curTime);
    }

    function curProcessDisplay() {
        var player = document.getElementById("musicAudio");
        var curTime = player.currentTime;
        var maxTime = player.duration;
        if (maxTime === undefined || maxTime === null) {
            return;
        }
        var percent = curTime / maxTime;
        if (percent > 1) {
            percent = 1;
        }
        var maxProcess = $(".playerDiv .songProcess").css("width");
        maxProcess = parseInt(maxProcess.replace("px", ""));
        var curProcess = percent * maxProcess;
        $(".playerDiv .songProcess .curProcess").css("width", curProcess + "px");
    }

    function initTimer() {
        timer = setInterval(curTimeDisplay, 300);
        processTimer = setInterval(curProcessDisplay, 300);
    }
})