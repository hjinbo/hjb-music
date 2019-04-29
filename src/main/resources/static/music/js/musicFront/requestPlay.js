$(function() {
    // 例子"https://api.mlwei.com/music/api/?key=523077333&cache=1&type=song&id=000GOW8F2cdcyv&size=hq";
    const apiPre = "https://api.mlwei.com/music/api/";
    const apiProviderQQ = "523077333";
    var id = ""; // 歌曲/歌单的id，当type=so(搜索音乐)时，id的值为关键词，必须对中文进行URL编码
    var cache = 1; // 默认=0不缓存，当cache=1时开启缓存，提高解析速度70%，数据不更新时，可把参数值改成cache=0访问一次即可清除缓存
    var type = "song"; // 解析类型：song 单曲，songlist 歌单，so 搜索，url 链接，pic 专辑图，lrc 歌词
    var nu = 100; // 当type=so(搜索音乐)时有效，定义搜索结果数量，默认100
    var size = "hq"; // 音质，默认高清。参数值可为：m4a 压缩音质，mp3 高清，hq 高品质，ape 无损，flac 超级无损
    var songList = new Array(); // 存放歌曲列表中的歌曲
    var bakSongList = new Array(); // 备份歌曲列表
    var isPlaying = false;
    var syncStatus = 0; // 双击列表播放歌曲时会触发多个标签的点击事件，引发播放器短时间内多次调用play()或是设置播放源，导致控制台报错

    var timer; // 改变syncStatus的定时器
    var songChangeTimer;
    // 歌词部分变量
    var showLyric = false;
    var currentLrc = "[00:05.00]歌名：盗将行[00:10.00]歌手：花粥、马雨阳[00:18.00]劫过九重城关 我座下马正酣[00:23.00]看那轻飘飘的衣摆 趁擦肩把裙掀[00:29.00]踏遍三江六岸 借刀光做船帆[00:35.00]任露水浸透了短衫 大盗睥睨四野[00:43.00]枕风宿雪多年 我与虎谋早餐[00:49.00]拎着钓叟的鱼弦 问卧龙几两钱[00:55.00]蜀中大雨连绵 关外横尸遍野[01:02.00]你的笑像一条恶犬 撞乱了我心弦[01:23.00]谈花饮月赋闲 这春宵艳阳天[01:28.00]待到梦醒时分睁眼 铁甲寒意凛冽[01:34.00]夙愿只隔一箭 故乡近似天边[01:40.00]不知何人浅唱弄弦 我彷徨不可前[01:51.00]枕风宿雪多年 我与虎谋早餐[01:57.00]拎着钓叟的鱼弦 问卧龙几两钱[02:03.00]蜀中大雨连绵 关外横尸遍野[02:09.00]你的笑像一条恶犬 撞乱我心弦[02:15.00]烽烟万里如衔 掷群雄下酒宴[02:22.00]谢绝策勋十二转 想为你窃玉簪[02:28.00]入巷间吃汤面 笑看窗边飞雪[02:34.00]取腰间明珠弹山雀 立枇杷于庭前[02:45.00]入巷间吃汤面 笑看窗边飞雪[02:53.00]取腰间明珠弹山雀 立枇杷于庭前";
    var lrcList = new Array();
    var lrcTimeList = new Array();
    var lyricTimer;
    var curLyricLocation = 0;
    var isLoadLyric = false;
    // 唱片的旋转变量
    var rotateCircle = 0;
    var rotateTimer;
    /*
    0 列表循环  
    1 单曲循环
    2 随机播放
    */
   var playType = 0;

    startSyncStatusTimer();

    function startSyncStatusTimer() {
        timer = setInterval(changeSyncStatus, 500);
    }

    function startAutoPlayTimer() {
        initAutoPlay();
    }

    function stopAutoPlayTimer() {
        clearInterval(songChangeTimer);
        songChangeTimer = null;
    }

    function startLyricTimer() {
        lyricTimer = setInterval(locateLyric, 300);
    }

    function stopLyricTimer() {
        clearInterval(lyricTimer);
        lyricTimer = null;
    }

    function initAutoPlay() {
        if (songChangeTimer !== null) {
            clearInterval(songChangeTimer);
            songChangeTimer = null;
        }
        setTimeout(() => {
            songChangeTimer = setInterval(autoPlayNext, 300);
        }, 1000);
    }

    function changeSyncStatus() {
        if (syncStatus === 1) {
            syncStatus = 0;
        }
    }

    function autoPlayNext() {
        if (songList.length <= 0) {
            return;
        }
        if (isSongEnd()) {
            if (playType === 1) {
                clearInterval(songChangeTimer);
                songChangeTimer = null;
            } else {
                if (songChangeTimer === null) {
                    songChangeTimer = setInterval(autoPlayNext, 1000);
                }
                var next = document.getElementById("next");
                next.click();
            }
        }
    }

    function play() {
        var player = document.getElementById("musicAudio");
        player.play();
        $(".songOperator #start").css("background-position", "0 -42px");
        isPlaying = true;
    }

    function useTimer() {
        // 设置开始图片
        $(".songOperator #start").css("background-position", "0 0");
        // 停止定时器
        stopAutoPlayTimer();
        // 停止唱片转动
        stopRecordRoateTimer("end");

        // 设置暂停图片
        $(".songOperator #start").css("background-position", "0 -42px");
        // 转动唱片
        startRecordRoateTimer();
        // 启动定时器
        startAutoPlayTimer();
    }

    // 轮播图播放
	$("#m_box ul li").click(function() {
        var id = parseInt($(this).attr("id").replace("imgCard", ""));
        if (id < 0 || id > 4) {
            layer.msg("页面更新这里没来得及修改", {
                offset: "200px"
            });
        } else {
            var sliderList = getSongFromSlider(id);
            addSongList(sliderList);
            doubleClickPlay();
            removeListSong();
            play();
            useTimer();
        }
    });
    
    function getSongFromSlider(id) {
        var sliderList = [
        ];
        return sliderList[id].list;
    }

    // 新歌播放
    $(".newSong .playIcon").click(function() {
        var mid = $(this).siblings(".mid").text();
        requestPlay(mid, $(this));
        doubleClickPlay();
        removeListSong();
    });
    
    // 双击列表歌曲播放歌曲
    function doubleClickPlay() {
        $(".playerDiv .playerList .song").dblclick(function() {
            var toPlayUrl = $(this).children(".songUrl").text();
            var toPlayLrc = $(this).children(".songLrc").text();
            var songPic = $(this).children(".songPic").text();
            var titleAndSinger = $(this).children(".songNameAndSinger").text();
            var player = document.getElementById("musicAudio");
            if (syncStatus !== 0) {
                return;
            }
            player.src = toPlayUrl;
            currentLrc = toPlayLrc;
            syncStatus = 1;
            // 将播放图片置为暂停图片
            $(".songOperator #start").css("background-position", "0 -42px");
            // 设置当前歌曲图片
            $(".player .songPic").css("background-image", "url(" + songPic + ")");
            // 设置最大时长
            $(".songTime #maxTime").text($(this).children(".songTime").text());
            // 设置当前播放歌名及歌手
            $(".songTime #songNameAndSinger").text($(this).children(".songNameAndSinger").text());
            // 设置歌词背景和唱片背景
            $(".musicLyric .lyricDivBack").css("background-image", "url(" + songPic + ")");
            $(".musicLyric .songPic").css("background-image", "url(" + songPic + ")");
            $(".musicLyric .right .songInfo .songName").text(json.title);
            $(".musicLyric .right .songInfo .singer").text(json.author);
            $(".musicLyric .right .songInfo .songAlbum").text(json.albumName);
            loadLyric(currentLrc);
            play();
            useTimer();
        });
    }

    // 移除歌曲（存在问题）
    function removeListSong() {
        $(".playerDiv .playerList .song .removeSong").click(function() {
            console.log("移除的歌曲:" + $(this).parent().children(".songNameAndSinger").text());
            $(this).parent().remove();
            // 找出待移除歌曲在数组中的下标
            var removeSongUrl = $(this).siblings(".songUrl").text();
            var removeIndex = findSongIndex(removeSongUrl);
            // songList.splice(removeIndex, 1);
            // 如果移除的歌曲为当前播放的歌曲则暂停播放
            var curSongUrl = $("#musicAudio").attr("src");
            var player = document.getElementById("musicAudio");
            if (curSongUrl === removeSongUrl) {
                player.pause();
                isPlaying = false;
                $("#musicAudio").attr("src", "");
                $(".songOperator #start").css("background-position", "0 0");
            }
            console.log("移除后列表还有:" + songList.length + "首歌");
        });
    }

    function requestPlay(mid, node) {
        var mUrl = getPlayUrl(mid);
        $.ajax({
            type: "GET",
            url: mUrl,
            success: function(data) {
                var title = data.title;
                var album = data.album;
                var author = data.author;
                var url = data.url;
                var lrc = data.lrc;
                var pic = data.pic;
                console.log("url:" + url);
                console.log("lrc: " + lrc);
                console.log("pic: " + pic);
                // 将所点击的歌曲添加到歌曲列表中
                var titleAndAuthor = node.siblings(".titleAndAuthor").text();
                var time = node.siblings(".time").text();
                var albumName = node.siblings(".album").text();
                var songName = "<span class='songName'>" + title + "</span>";
                var songAuthor = "<span class='author'>" + author + "</span>";
                var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
                var songTime = "<span class='songTime'>" + time + "</span>";
                var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
                var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
                var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
                // 列表移除存在问题
                var removeSong = "<span class='removeSong'>X</span>";
                var song = "<div class='song'>" + songName + songAuthor + songTime + songLrc + songPic + songUrl + "</div>";
                var songJson = JSON.stringify({
                    title: title,
                    author: author,
                    titleAndAuthor: titleAndAuthor,
                    time: time,
                    albumName: albumName,
                    url: url,
                    pic: pic,
                    lrc: lrc
                });
                if (findSongIndex(url) === -1) {
                    $(song).appendTo($(".playerList"));
                    songList.push(songJson); //添加前校验是否存在这首歌曲
                    bakSongList.push(songJson);
                    if (url !== "" | url !== null || url !== undefined) {
                        $("#musicAudio").attr("src", url);
                        // 最大播放时间设置
                        $(".songTime #maxTime").text(time);
                        $(".songTime #songNameAndAuthor").text(titleAndAuthor);
                        // 设置当前播放歌名及歌手
                        $(".songTime #songNameAndSinger").text($(this).children(".songNameAndSinger").text());
                        // 专辑图片设置
                        $(".player .songPic").css("background-image", "url(" + pic + ")");
                        // 将播放图片置为暂停图片
                        $(".songOperator #start").css("background-position", "0 -42px");
                    } else {
                        layer.msg("播放地址无效", {
                            offset: "200px"
                        });
                    }
                } else {
                    layer.msg("歌曲已存在于列表中", {
                        offset: "200px"
                    });
                }
            },
            error: function() {
                layer.msg("服务访问异常", {
                    offset: "200px"
                });
            }
        });
        play();
        useTimer();
    }

    // 根据mid非静态拼接http请求
    function getPlayUrl(mid) {
        type = "song";
        id = mid;
        size = "hq";
        var url = apiPre + "?key=" + apiProviderQQ + "&cache=" + cache + "&type=" + type + "&id=" + id + "&size=" + size;
        return url;
    }

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

    // 暂停歌曲
    $(".songOperator #start").click(function() {
        var player = document.getElementById("musicAudio");
        if (!isPlaying) {
            if (songList.length === 0) {
                layer.msg("列表都没歌，你听个鬼哦", {
                    offset: "200px"
                });
            } else {
                player.play();
                isPlaying = true;
                // 设置暂停图片
                $(this).css("background-position", "0 -42px");
                // 转动唱片
                startRecordRoateTimer();
                // 启动定时器
                startAutoPlayTimer();
                // 启动歌词定位
            }
        } else {
            $(this).css("background-position", "0 0");
            player.pause();
            isPlaying = false;
            stopAutoPlayTimer();
            stopRecordRoateTimer();
        }
    });

    // 上一首
    $(".songOperator #last").click(function() {
        if (songList.length === 0) {
            layer.msg("列表都没歌，上一首会有用？", {
                offset: "200px"
            });
        } else {
            // 获得当前播放歌曲的url
            var curSongUrl = $("#musicAudio").attr("src");
            var curIndex = findSongIndex(curSongUrl);
            if (curIndex >= 0) {
                curIndex--;
                // 到列表的第一首歌了
                if (curIndex < 0) {
                    curIndex = songList.length - 1; // 跳到最后一首歌
                }
                var json = toJson(songList[curIndex]);
                var player = document.getElementById("musicAudio");
                player.src = json.url;
                currentLrc = json.lrc;
                // 歌曲信息的设置
                $(".player .songPic").css("background-image", "url(" + json.pic + ")");
                $(".songTime #maxTime").text(json.time);
                $(".songTime #songNameAndSinger").text(json.titleAndAuthor);
                // 歌词背景图片和唱片背景图片
                $(".musicLyric .lyricDivBack").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .songPic").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .right .songInfo .songName").text(json.title);
                $(".musicLyric .right .songInfo .singer").text(json.author);
                $(".musicLyric .right .songInfo .songAlbum").text(json.albumName);
                loadLyric(currentLrc);
                doubleClickPlay();
                removeListSong();
                play();
                useTimer();
            } else {
                layer.msg("为什么明明有一首以上的歌曲，但是没有切换? 当然是出bug了啊", {
                    offset: "200px"
                });
            }
        }
    });

    // 下一首
    $(".songOperator #next").click(function() {
        if (songList.length === 0) {
            layer.msg("列表都没歌，下一首会有用？", {
                offset: "200px"
            });
        } else {
            // 获得当前播放歌曲的url
            var curSongUrl = $("#musicAudio").attr("src");
            var curIndex = findSongIndex(curSongUrl);
            if (curIndex >= 0) {
                curIndex++;
                // 到列表的最后一首了
                if (curIndex === songList.length) {
                    curIndex = 0; // 跳到第一首
                }
                var json = toJson(songList[curIndex]);
                var player = document.getElementById("musicAudio");
                player.src = json.url;
                currentLrc = json.lrc;
                // 歌曲信息的设置
                $(".player .songPic").css("background-image", "url(" + json.pic + ")");
                $(".songTime #maxTime").text(json.time);
                $(".songTime #songNameAndSinger").text(json.titleAndAuthor);
                // 歌词背景图片和唱片背景图片
                $(".musicLyric .lyricDivBack").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .songPic").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .right .songInfo .songName").text(json.title);
                $(".musicLyric .right .songInfo .singer").text(json.author);
                $(".musicLyric .right .songInfo .songAlbum").text(json.albumName);
                loadLyric(currentLrc);
                doubleClickPlay();
                removeListSong();
                play();
                useTimer();
            } else {
                layer.msg("为什么明明有一首以上的歌曲，但是没有切换? 当然是出bug了啊", {
                    offset: "200px"
                });
            }
        }
    });

    // 终止歌曲
    $(".songOperator #end").click(function() {
        // 将歌曲的当前时间设置为0， 并将歌曲暂停播放
        var player = document.getElementById("musicAudio");
        player.currentTime = 0;
        player.pause();
        // 将暂停图片置为播放图片
        $(".songOperator #start").css("background-position", "0 0");
        isPlaying = false;
        stopAutoPlayTimer();
        stopRecordRoateTimer("end");
    });

    function findSongIndex(url) {
        for (var i = 0; i < songList.length; i++) {
            if (toJson(songList[i]).url === url) {
                return i;
            }
        }
        return -1;
    }

    function toJson(v) {
        return eval("(" + v + ")");
    }

    function isSongEnd() {
        var player = document.getElementById("musicAudio");
        var ended = player.ended;
        var currentTime = player.currentTime === 0;
        var isEnd = ended || currentTime;
        return isEnd;
    }

    // 切换播放方式
    $(".songOperator #playType").click(function() {
        var player = document.getElementById("musicAudio");
        // 0 列表循环 1 单曲循环 2 随机播放
        if (playType === 0) {
            player.loop = "loop";
            playType = 1;
            layer.msg("单曲循环图标被你点没了", {
                offset: "200px"
            });
            $(this).css("background-position", "-200px -200px");
        } else if (playType === 1) {
            player.loop = "";
            playType = 2;
            layer.msg("随机播放", {
                offset: "200px"
            });
            $(this).css("background-position", "0 -270px");
            // 随机列表
            shuffleSongList();
        } else if (playType === 2) {
            player.loop = "";
            playType = 0;
            layer.msg("列表循环", {
                offset: "200px"
            });
            $(this).css("background-position", "0 -290px");
            // 将列表还原
            resetSongList();
        }
    });

    function shuffleSongList() {
        // 洗牌原列表
        shuffleSwap(songList);
    }

    function shuffleSwap(arr) {
        if(arr.length == 1) return arr;
        //正向思路
        //  for(let i = 0, n = arr.length; i < arr.length - 1; i++, n--) {
        //  let j = i + Math.floor(Math.random() * n);
        //逆向思路
        let i = arr.length;
        while(--i > 1) {
          //Math.floor 和 parseInt 和 >>>0 和 ~~ 效果一样都是取整
          let j = Math.floor(Math.random() * (i+1));
          /*
          //原始写法
          let tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          */
          //es6的写法
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function resetSongList() {
        for (var i = 0; i < bakSongList.length; i++) {
            songList[i] = bakSongList[i];
        }
    }

    // 歌词部分
    $(".player .songPic .lrcShow .btn").click(function() {
        if (!showLyric) {
            // 每次点击歌词显示不会多次加载
            if (!isLoadLyric) {
                loadLyric(currentLrc);
                isLoadLyric = true;
            }
            startLyricTimer();
            $(".musicLyric").css("display", "");
            $(".notLyric").css("display", "none");
            $(".musicPlayer").css("top", "280px");
            // 歌曲的图片加载
            var curSongPic = $(this).parent().parent().css("background-image");
            $(".musicLyric .lyricDivBack").css("background-image", curSongPic);
            $(".musicLyric .songPic").css("background-image", curSongPic);
            showLyric = true;
        } else {
            // stopLyricTimer();
            $(".musicLyric").css("display", "none");
            $(".notLyric").css("display", "");
            $(".musicPlayer").css("top", "150px");
            showLyric = false;
        }
        doubleClickPlay();
        removeListSong();
    });

    // 解析歌词
    function loadLyric(lrc) {
        curLyricLocation = 0;
        $("#lyric").empty();
        lrcList = new Array();
        lrcTimeList = new Array();
        while (lrc.indexOf("\\r\\n") != -1) {
            lrc = lrc.replace("\\r\\n", "");
        }
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
        for ( var i = 0; i < lrcTimeList.length; i++) {
            if (i + 1 < lrcList.length) {
                if (currentTime >= timeStr2Second(lrcTimeList[i]) && currentTime <= timeStr2Second(lrcTimeList[i + 1])) {
                    $("#lyric #l" + i).addClass("lyricColor");
                    curLyricLocation = parseInt((i) * $("#lyric .line").css("height").replace("px", ""));
                    lyric.scrollTo(0, curLyricLocation);
                } else {
                    $("#lyric #l" + i).removeClass("lyricColor");
                }
            } else if (i + 1 === lrcList.length) {
                if (currentTime >= timeStr2Second(lrcTimeList[i])) {
                    $("#lyric #l" + i).addClass("lyricColor");
                    curLyricLocation = parseInt((i) * $("#lyric .line").css("height").replace("px", ""));
                    lyric.scrollTo(0, curLyricLocation);
                } else {
                    $("#lyric #l" + i).removeClass("lyricColor");
                }
            }
        }
    }

    function timeStr2Second(time) {
        var tmp = time.split(":");
        var minute = parseInt(tmp[0]);
        var second = parseInt(tmp[1]);
        return minute * 60 + second;
    }

    // 唱针旋转样式(包括了唱片的旋转)
    function startRecordRoateTimer() {
        if (isPlaying || !isSongEnd()) {
            $(".musicLyric .stylus").css("-webkit-transform", "rotate(65deg)");
            $(".musicLyric .stylus").css("-moz-transform", "rotate(65deg)");
            $(".musicLyric .stylus").css("-ms-transform", "rotate(65deg)");
            $(".musicLyric .stylus").css("transform", "rotate(65deg)");
            rotateTimer = setInterval(picRotate, 100);
        }
    }

    // 唱片的旋转
    function picRotate() {
        rotateCircle++;
        $(".musicLyric .songPicOutter").css("transform", "rotate(" + rotateCircle * 1.8 * 1 + "deg)");
        $(".musicLyric .songPicOutter").css("transition", ".1s linear");
        $(".musicLyric .songPic").css("transform", "rotate(" + rotateCircle * 1.8 * 1 + "deg)");
        $(".musicLyric .songPic").css("transition", ".1s linear");
    }

    // 停止旋转
    function stopRecordRoateTimer(type) {
        if (!isPlaying || isSongEnd()) {
            clearInterval(rotateTimer);
            rotateTimer = null;
            if (type === "end") {
                rotateCircle = 0;
                $(".musicLyric .songPicOutter").css("transform", "rotate(0)");
                $(".musicLyric .songPic").css("transform", "rotate(0)");
            }
            $(".musicLyric .stylus").css("-webkit-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("-moz-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("-ms-transform", "rotate(45deg)");
            $(".musicLyric .stylus").css("transform", "rotate(45deg)");
        }
    }

    // 歌单播放
    $(".hotSongLists .hotSongList").click(function() {
        var listId = $(this).children(".listId").text();
        if (listId === "" || listId === undefined || listId === null) {
            layer.msg("这个歌单就不给你听", {
                offset: "200px"
            });
            return;
        }
        var songs = getSongList(listId);
        addSongList(songs);
        doubleClickPlay();
        removeListSong();
        play();
        useTimer();
    });

    function getSongList(listId) {
        var songList = [
            // 最佳歌单保留
        ];
        return songList[listId].list;
    }

    // 歌手 (酷狗的接口)
    $(".authorLists .author").click(function() {
        var index = $(this).children(".authorPic").attr("id").replace("a", "");
        var songHash = $(this).children(".authorPic").children(".content").text();
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                songHash: songHash
            }),
            url: "/api/kugouMusic/getSongData",
            success: function(data) {
                data = toJson(data);
                if (data.err_code !== 0) {
                    remoteServerFail();
                } else {
                    var interval = Math.round(data.data.timelength / 1000);
                    var songName = data.data.song_name;
                    var authors = data.data.authors;
                    var singer = "";
                    for (var i = 0; i < authors.length; i++) {
                        singer += authors[i].author_name + "&";
                    }
                    if (singer.length > 0) {
                        singer = singer.substr(0, singer.length - 1);
                    }
                    var albumPic = data.data.img;
                    var albumName = data.data.album_name;
                    var lyric = data.data.lyrics;
                    var playUrl = data.data.play_url;
                    var vSongJson = JSON.stringify({
                        singer: singer,
                        songLrc: lyric,
                        songPic: albumPic,
                        songUrl: playUrl,
                        songName: songName,
                        interval: interval,
                        songAlbum: albumName
                    });
                    addSong(vSongJson);
                    play();
                    useTimer();
                    console.log("开始播放");
                }
            },
            error: function() {
                localServerFail();
            }
        });
    });

    // 单首歌导入歌曲列表(非静态根据具体的返回json修改key)
    function addSong(vSongJson) {
        vSongJson = toJson(vSongJson);
        var author = vSongJson.singer;
        var lrc = vSongJson.songLrc;
        var pic = vSongJson.songPic;
        var url = vSongJson.songUrl;
        var title = vSongJson.songName;
        var titleAndAuthor = title + "-" + author;
        var time = intervalFormat(vSongJson.interval);
        var albumName = vSongJson.songAlbum;

        var songName = "<span class='songName'>" + title + "</span>";
        var songAuthor = "<span class='author'>" + author + "</span>";
        var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
        var songTime = "<span class='songTime'>" + time + "</span>";
        var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
        var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
        var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
        // 列表移除存在问题
        var removeSong = "<span class='removeSong'>X</span>";
        var song = "<div class='song'>" + songName + songAuthor + songTime + songLrc + songPic + songUrl + "</div>";
        var songJson = JSON.stringify({
            title: title,
            author: author,
            titleAndAuthor: titleAndAuthor,
            time: time,
            albumName: albumName,
            url: url,
            pic: pic,
            lrc: lrc
        });
        if (findSongIndex(vSongJson.songUrl) === -1) {
            songList.push(songJson);
            bakSongList.push(songJson);
            $(song).appendTo($(".playerList"));
            if (url !== "" | url !== null || url !== undefined) {
                $("#musicAudio").attr("src", url);
                $(".player .songPic").css("background-image", "url(" + pic + ")");
                $(".songTime #maxTime").text(time);
                $(".songTime #songNameAndAuthor").text(titleAndAuthor);
                // 将播放图片置为暂停图片
                $(".songOperator #start").css("background-position", "0 -42px");
                $(".musicLyric .right .songInfo .songName").text(title);
                $(".musicLyric .right .songInfo .singer").text(author);
                $(".musicLyric .right .songInfo .songAlbum").text(albumName);
                currentLrc = lrc;
                loadLyric(currentLrc)
            } else {
                layer.msg("播放地址无效", {
                    offset: "200px"
                });
            }
        } else {
            layer.msg("歌曲已存在于列表中", {
                offset: "200px"
            });
        }
    }

    // 批量导入(顺序导入时限制了播放为导入首位的歌曲)(非静态根据具体的返回json修改key)
    function addSongList(songs) {
        for (var i = 0; i < songs.length; i++) {
            var author = "";
            var authors = songs[i].singer;
            if (authors !== undefined || authors !== null) {
                for (var a = 0; a < authors.length; a++) {
                    author += authors[a].name + "&";
                }
                if (author.length > 0) {
                    author = author.substr(0, author.length - 1);
                }
            }
            var lrc = "";
            var pic = songs[i].songPic;
            var url = songs[i].songUrl;
            var title = songs[i].songName;
            var titleAndAuthor = title + "-" + author;
            var time = intervalFormat(songs[i].interval);
            var albumName = "";
            var songName = "<span class='songName'>" + title + "</span>";
            var songAuthor = "<span class='author'>" + author + "</span>";
            var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
            var songTime = "<span class='songTime'>" + time + "</span>";
            var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
            var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
            var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
            // 列表移除存在问题
            var removeSong = "<span class='removeSong'>X</span>";
            var song = "<div class='song'>" + songName + songAuthor + songTime + songLrc + songPic + songUrl + "</div>";
            var songJson = JSON.stringify({
                title: title,
                author: author,
                titleAndAuthor: titleAndAuthor,
                time: time,
                albumName: albumName,
                url: url,
                pic: pic,
                lrc: lrc
            });
            if (findSongIndex(songs[i].songUrl) === -1) {
                songList.push(songJson);
                bakSongList.push(songJson);
                $(song).appendTo($(".playerList"));
                if (url !== "" | url !== null || url !== undefined) {
                    // 只设置第一首歌曲，即添加后默认播放第一首歌曲
                    if (i === 0) {
                        $("#musicAudio").attr("src", url);
                        $(".player .songPic").css("background-image", "url(" + pic + ")");
                        $(".songTime #maxTime").text(time);
                        $(".songTime #songNameAndAuthor").text(titleAndAuthor);
                    }
                    // 将播放图片置为暂停图片
                    $(".songOperator #start").css("background-position", "0 -42px");
                } else {
                    layer.msg("播放地址无效", {
                        offset: "200px"
                    });
                }
            } else {
                layer.msg("歌曲已存在于列表中", {
                    offset: "200px"
                });
            }
        }
    }

    function remoteServerFail() {
        layer.alert("远程服务访问失败", {
            offset: "200px"
        });
    }

    function localServerFail() {
        layer.alert("本地服务访问失败", {
            offset: "200px"
        });
    }
})