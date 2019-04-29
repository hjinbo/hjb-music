$(function() {

    // 新歌首发
    var newSongsNum = 8;
    // 最新歌曲TOP100
    var newSongsUrl = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923";
    // 专辑的封面图片
    // var albumImg = "http://imgcache.qq.com/music/photo/album_300/%i/300_albumpic_%i_0.jpg", albumid%100, albumid;
    // 轮播图地址
    var sliderUrl = "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
    // 热门歌单数量
    var hotSongListNum = 7;
    // 歌手数量
    var authorListNum = 5;
    // MV数量
    var mvListNum = 8;
    // MV是否被点击过
    var isVideoPlaying = [false, false, false, false, false, false, false, false];

    init();

    // 页面加载后完成各个部分的加载
    function init() {
        // getSliderImg();
        getNewSongs();
        getHotSongList();
        getAuthorList();
        getMVList();
    }

    // 时间格式化
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

    // 回到顶部
    $("#toTop").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, 500);
    });

    // 获得轮播图
    function getSliderImg() {
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                url: sliderUrl
            }),
            url: "/api/handleCORS",
            success: function(data) {
                if (data.errorNo !== 0) {
                    layer.alert("代理服务器异常（异常代码: ）" + data.errorNo + "原因:" + data.errorInfo, {
                        offset: "200px"
                    });
                } else {
                    var urlResponse = data.result.response;
                    var jsonResponse = eval("(" + urlResponse + ")");
                    if (jsonResponse.code === 0) {

                    } else {
                        layer.alert("服务异常(异常代码)：" + urlResponse.code, {
                            offset: "200px"
                        });
                    }
                }
            },
            error: function() {
                layer.alert("服务调用异常", {
                    offset: "200px"
                });
            }
        });
    }

    // 获得新歌
    function getNewSongs() {
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                url: newSongsUrl
            }),
            url: "/api/handleCORS",
            success: function(data) {
                if (data.errorNo !== 0) {
                    layer.alert("代理服务器异常（异常代码: ）" + data.errorNo + "原因:" + data.errorInfo, {
                        offset: "200px"
                    });
                } else {
                    var urlResponse = data.result.response;
                    var jsonResponse = eval("(" + urlResponse + ")");
                    if (jsonResponse.code === 0) {
                        for (i = 0; i < newSongsNum; i++) {
                            var album = jsonResponse.songlist[i].data.albumname;
                            // singer的结构是一个数组
                            var singers = jsonResponse.songlist[i].data.singer;
                            var author = "";
                            for (var s = 0; s < singers.length; s++) {
                                author += singers[s].name + "&";
                            }
                            if (author.length > 0) {
                                author = author.substr(0, author.length - 1);
                            }
                            var albumid = jsonResponse.songlist[i].data.albumid;
                            var albumImg = "http://imgcache.qq.com/music/photo/album_300/" + albumid % 100 + "/300_albumpic_" + albumid + "_0.jpg";
                            var title = jsonResponse.songlist[i].data.songname;
                            var mid = jsonResponse.songlist[i].data.songmid;
                            var time = jsonResponse.songlist[i].data.interval;
                            $("#ns" + i + " .content .titleAndAuthor").text(title + "-" + author);
                            $("#ns" + i + " .content .time").text(intervalFormat(time));
                            $("#ns" + i + " .content .album").text(album);
                            $("#ns" + i + " .content .mid").text(mid);
                            $("#ns" + i).css("background-image", "url(" + albumImg + ")");
                        }
                    } else {
                        layer.alert("远程服务异常(异常代码)：" + urlResponse.code, {
                            offset: "200px"
                        });
                    }
                }
            },
            error: function() {
                layer.alert("本地代理服务访问失败", {
                    offset: "200px"
                });
            }
        });
    }

    // 获得歌单
    function getHotSongList() {

    }

    // 获得歌手
    function getAuthorList() {
        // 给出一些固定的hash(酷狗)
        var authorList = [
            {pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000", name: "周杰伦", songHash: ""},
            {pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001BLpXF2DyJe2.jpg?max_age=2592000", name: "林俊杰", songHash: "e249d9b4a6f0353856c2cf3a520fc5ea"},
            {pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001JDzPT3JdvqK.jpg?max_age=2592000", name: "王力宏", songHash: "8fbf3d555f7c27f5f7a2227624731807"},
            {pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001fNHEf1SFEFN.jpg?max_age=2592000", name: "邓紫棋", songHash: "8749feb84f4e9dbf50ca80a0b2b9a89a"},
            {pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000002BrFgT47yIOO.jpg?max_age=2592000", name: "茶太", songHash: "464c607c5baef1831267db77a06efeaa"}
        ];
        // 将固定hash记载到html
        for (var i = 0; i < authorList.length; i++) {
            $(".authorLists .author #a" + i).css("background-image", "url(" + authorList[i].pic + ")");
            $(".authorLists .author #a" + i).children(".content").text(authorList[i].songHash);
            $(".authorLists .author #a" + i).siblings(".authorName").text(authorList[i].name);
        }
    }

    // 获得MV
    function getMVList() {

    }

    // MV部分
    $(".hotMVListsDiv .hotMVLists .hotMV .content").mouseover(function() {
        $(this).css("opacity", "1");
        $(this).css("background", "rgba(0, 0, 0, .5)");
        $(this).css("transition", ".5s");
        $(this).css("-webkit-transition", ".5s");
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