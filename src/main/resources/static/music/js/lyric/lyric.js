$(function() {
    
    // 歌词的拖拽变量
    var canMove = false;
    var downClientY;
    var historyY = 0;
    var y;
    // 唱片的旋转变量
    var rotateCircle = 0;
    var rotateTimer;

    $("#lyric").mousedown(function(event) {
        canMove = true;
        downClientY = event.clientY;
    });

    $("#lyric").mouseup(function(event) {
        canMove = false;
        historyY += y;
    });

    // Y轴拖拽歌词
    $("#lyric").mousemove(function(event) {
        if (canMove) {
            y = downClientY - event.clientY;
            $(this).scrollTop(y + historyY); // 原生js没有scrollTop(), 采用scrollTo()
        }
    });

    var lrc = "[00:05.00]歌名：盗将行[00:10.00]歌手：花粥、马雨阳[00:18.00]劫过九重城关 我座下马正酣[00:23.00]看那轻飘飘的衣摆 趁擦肩把裙掀[00:29.00]踏遍三江六岸 借刀光做船帆[00:35.00]任露水浸透了短衫 大盗睥睨四野[00:43.00]枕风宿雪多年 我与虎谋早餐[00:49.00]拎着钓叟的鱼弦 问卧龙几两钱[00:55.00]蜀中大雨连绵 关外横尸遍野[01:02.00]你的笑像一条恶犬 撞乱了我心弦[01:23.00]谈花饮月赋闲 这春宵艳阳天[01:28.00]待到梦醒时分睁眼 铁甲寒意凛冽[01:34.00]夙愿只隔一箭 故乡近似天边[01:40.00]不知何人浅唱弄弦 我彷徨不可前[01:51.00]枕风宿雪多年 我与虎谋早餐[01:57.00]拎着钓叟的鱼弦 问卧龙几两钱[02:03.00]蜀中大雨连绵 关外横尸遍野[02:09.00]你的笑像一条恶犬 撞乱我心弦[02:15.00]烽烟万里如衔 掷群雄下酒宴[02:22.00]谢绝策勋十二转 想为你窃玉簪[02:28.00]入巷间吃汤面 笑看窗边飞雪[02:34.00]取腰间明珠弹山雀 立枇杷于庭前[02:45.00]入巷间吃汤面 笑看窗边飞雪[02:53.00]取腰间明珠弹山雀 立枇杷于庭前";
    var lrcList = new Array();
    var lrcTimeList = new Array();
    var lyricTimer;
    var isPlaying = false;
    var curLyricLocation = 0;

    // loadLyric(lrc);
    
    // 解析歌词
    function loadLyric(lrc) {
        $("#lyric").empty();
        var lrcListTmp = lrc.split('[');
        // 前面补充3个span
        for (var i = 0; i < 3; i++) {
            $("<span class='line'>&nbsp;</span>").appendTo($("#lyric"));
        }
        for (var i = 1; i < lrcListTmp.length; i++) {
            var b = lrcListTmp[i].split(']');
            lrcList.push(b);
            $("<span class='line' id='l" + (i - 1) + "'>" + b[1] + "</span>").appendTo($("#lyric"));
        }
        // 后面补充生成5个span
        for (var i = lrcListTmp.length; i < lrcListTmp.length + 5; i++) {
            $("<span class='line' id='l" + (i - 1) + "'>&nbsp;</span>").appendTo($("#lyric"));
        }
        var maxTime;
        for (var i = 0; i < lrcList.length; i++) {
            var d = lrcList[i][0].split('.');
            lrcTimeList.push(d[0]);
            maxTime = d[0];
            $("<span class='time' id='t" + i + "'>" + timeStr2Second(d[0]) + "</span>").appendTo($("#l" + i));
        }
        for (var i = lrcList.length; i < lrcList.length + 5; i++) {
            lrcTimeList.push(maxTime);
            $("<span class='time' id='t" + i + "'>" + timeStr2Second(maxTime) + "</span>").appendTo($("#l" + i));
        }
    }

    // 定位歌词行
    function locateLyric() {
        var lyric = document.getElementById("lyric");
        var player = document.getElementById("musicAudio");
        var currentTime = player.currentTime;
        if (player.currentTime < 1) {
            lyric.scrollTo(0, 0);
        }
        // 找到当前时间对应的行
        var curLine = 0;
        for ( var i = 0; i < lrcTimeList.length; i++) {
            if (currentTime >= timeStr2Second(lrcTimeList[i]) && currentTime <= timeStr2Second(lrcTimeList[i + 1])) {
                curLine = i;
                break;
            }
        }
        $("#lyric #l" + i).addClass("lyricColor");
        $("#lyric").scrollTop(parseInt((i) * $("#lyric .line").css("height").replace("px", "")));
    }

    function timeStr2Second(time) {
        var tmp = time.split(":");
        var minute = parseInt(tmp[0]);
        var second = parseInt(tmp[1]);
        return minute * 60 + second;
    }

    function isSongEnd() {
        var player = document.getElementById("musicAudio");
        var ended = player.ended;
        var currentTime = player.currentTime === 0;
        var isEnd = ended || currentTime;
        return isEnd;
    }

    
    // 唱针旋转样式(包括了唱片的旋转)
    function recordRoate() {
        if (isPlaying || !isSongEnd()) {
            $(".musicLyric .stylus").css("-webkit-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("-moz-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("-ms-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("transform", "rotate(45deg)");
            // 不用动画
            // setTimeout(() => {
            //     $(".musicLyric .songPicOutter").addClass("rotation");
            //     $(".musicLyric .songPic").addClass("rotation");
            // }, 300);
            rotateTimer = setInterval(picRotate, 200);
        }
    }

    // 唱片的旋转
    function picRotate() {
        rotateCircle++;
        $(".musicLyric .songPicOutter").css("transform", "rotate(" + rotateCircle * 1.8 * 2 + "deg)");
        $(".musicLyric .songPicOutter").css("transition", ".2s linear");
        $(".musicLyric .songPic").css("transform", "rotate(" + rotateCircle * 1.8 * 2 + "deg)");
        $(".musicLyric .songPic").css("transition", ".2s linear");
    }

    // 停止旋转
    function stopRecordRoate() {
        if (!isPlaying || isSongEnd()) {
            // $(".musicLyric .songPicOutter").removeClass("rotation");
            // $(".musicLyric .songPic").removeClass("rotation");
            clearInterval(rotateTimer);
            rotateTimer = null;
            $(".musicLyric .stylus").css("-webkit-transform", "rotate(0deg)");
            $(".musicLyric .stylus").css("-moz-transform", "rotate(0deg)");
            $(".musicLyric .stylus").css("-ms-transform", "rotate(0deg)");
            $(".musicLyric .stylus").css("transform", "rotate(0deg)");
        }
    }
    
    // 播放暂停
    $(".lyricDiv .songControls").click(function() {
        var player = document.getElementById("musicAudio");
        if (!isPlaying) {
            // player.src = "http://www.ytmp3.cn/down/48303.mp3";
            player.play();
            isPlaying = true;
            lyricTimer = setInterval(locateLyric, 300);
            recordRoate();
        } else {
            clearInterval(lyricTimer);
            lyricTimer = null;
            player.pause();
            isPlaying = false;
            stopRecordRoate();
        }
    });

    var timer;
    // startSongTime();
    function startSongTime() {
        timer = setInterval(showSongTime, 300);
    }

    function showSongTime() {
        var player = document.getElementById("musicAudio");
        $(".lyricDiv .songTime").text(player.currentTime);
    }

    

})