$(function() {
    
    var useAnimation = false;
    // 例子"https://api.mlwei.com/music/api/?key=523077333&cache=1&type=song&id=000GOW8F2cdcyv&size=hq";
    const apiPre = "https://api.mlwei.com/music/api/";
    const apiProviderQQ = "523077333";
    var id = ""; // 歌曲/歌单的id，当type=so(搜索音乐)时，id的值为关键词，必须对中文进行URL编码
    var cache = 1; // 默认=0不缓存，当cache=1时开启缓存，提高解析速度70%，数据不更新时，可把参数值改成cache=0访问一次即可清除缓存
    var type = "song"; // 解析类型：song 单曲，songlist 歌单，so 搜索，url 链接，pic 专辑图，lrc 歌词
    var nu = 100; // 当type=so(搜索音乐)时有效，定义搜索结果数量，默认100
    var size = "hq"; // 音质，默认高清。参数值可为：m4a 压缩音质，mp3 高清，hq 高品质，ape 无损，flac 超级无损
    // 默认生成20条搜索记录(后续提供分页功能)
    var num = 20;

    function init() {
        
    }

    $(".searchBtn").click(function() {
        search();
    });

    function search() {
        var searchText = $("#search").val();
        type = "so";
        id = encodeURIComponent(searchText); // 必须对搜索关键URL编码
        console.log("编码后的关键字:" + id);
        var url = apiPre + "?key=" + apiProviderQQ + "&cache=" + cache + "&type=" + type + "&id=" + id + "&size=" + size;
        console.log("生成的url:" + url);
        // 每次搜索前将上次上搜结果清空
        $(".list-ul").empty();
        $.ajax({
            type: "GET",
            url: url,
            success: function(data) {
                if (data.Code != "OK") {
                    layer.alert("调用异常(异常代码):" + data.Code);
                } else {
                    console.log("搜索关键字:" + unescape(data.keyword));
                    console.log("songNum:" + data.songnum);

                    for (var i = 0; i < num; i++) {
                        var titleTmp;
                        if (data.Body[i].title === "" || data.Body[i].title === null) {
                            titleTmp = "<span class='title'><span>-</span></span>";
                        } else {
                            titleTmp = "<span class='title'><span>" + data.Body[i].title + "</span></span>";
                        }
                        var authorTmp;
                        if (data.Body[i].author === "" || data.Body[i].author === null) {
                            authorTmp = "<span class='author'><span>-</span></span>";
                        } else {
                            authorTmp = "<span class='author'><span>" + data.Body[i].author + "</span></span>";
                        }
                        var albumTmp;
                        if (data.Body[i].album === "" || data.Body[i].album === null) {
                            albumTmp = "<span class='album'><span>-</span></span>";
                        } else {
                            albumTmp = "<span class='album'><span>" + data.Body[i].album + "</span></span>";
                        }
                        var timeTmp;
                        // if () {
                        //     timeTmp = "<span class='time'><span>-</span></span>";
                        // } else {
                        //     timeTmp = "<span class='time'><span>-</span></span>";
                        // }
                        timeTmp = "<span class='time'><span>-</span></span>";
                        type = "song";
                        id = data.Body[i].mid;
                        size = "hq";
                        var musicUrl = apiPre + "?key=" + apiProviderQQ + "&cache=" + cache + "&type=" + type + "&id=" + id + "&size=" + size;
                        var mUrlTmp = "<span class='mUrl' style='display: none;'>" + musicUrl + "</span>";
                        var musicLi = "<li class='music-li play' id=" + i + "></li>";
                        $(musicLi).appendTo($(".list-ul"));
                        $(titleTmp).appendTo($("#" + i));
                        $(authorTmp).appendTo($("#" + i));
                        $(albumTmp).appendTo($("#" + i));
                        $(timeTmp).appendTo($("#" + i));
                        $(mUrlTmp).appendTo($("#" + i));
                    }
                    // 搜索结果双击即播放
                    $(".play").dblclick(function() {
                        var mUrl = $(this).children(".mUrl").text();
                        console.log("musicUrl:" + mUrl);
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
                                console.log("lrc: " + lrc);
                                console.log("pic: " + pic);
                                if (url !== "" | url !== null || url !== undefined) {
                                    console.log("播放地址:" + url);
                                    $("#musicAudio").attr("src", url);
                                    var player = document.getElementById("musicAudio");
                                    player.play();
                                } else {
                                    layer.msg("播放失败");
                                }
                            },
                            error: function() {
                                layer.msg("服务访问异常");
                            }
                        });
                    });
                }
            },
            error: function(data) {
                layer.msg("服务访问异常");
            }
        });
    }
})