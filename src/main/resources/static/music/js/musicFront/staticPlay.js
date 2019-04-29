$(function() {

    var songList = new Array(); // 存放歌曲列表中的歌曲
    var bakSongList = new Array(); // 备份歌曲列表
    var isPlaying = false;
    var syncStatus = 0; // 双击列表播放歌曲时会触发多个标签的点击事件，引发播放器短时间内多次调用play()或是设置播放源，导致控制台报错
    var timer; // 改变syncStatus的定时器
    var songChangeTimer; 
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
    var canPlay = false;
    /*
    0 列表循环  
    1 单曲循环
    2 随机播放
    */
    var playType = 0;

    startSyncStatusTimer();

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

    function startSyncStatusTimer() {
        timer = setInterval(changeSyncStatus, 500);
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
            clearInterval(rotateTimer);
            rotateTimer = null;
            if (playType === 1) {
                clearInterval(songChangeTimer);
                songChangeTimer = null;
            } else {
                if (songChangeTimer === null) {
                    songChangeTimer = setInterval(autoPlayNext, 300);
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
        canPlay = true;
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
            {id: "0", name: "火影原声", list: [
                {
                    singer: [{name: "Akeboshi"}], 
                    songUrl: "http://157.255.154.151/amobile.music.tc.qq.com/C400002isdZN3mMiik.m4a?guid=7068177850&vkey=DA58226DAA1F34CD34E72D653E0A2714976BC98B79E0A181C8A01114A0390B4FFF711806545B5F33D8CC25B11404A592379AE0641E80EE42&uin=5875&fromtag=66", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004MqAwD15KeWx.jpg?max_age=2592000", 
                    songName: "Wind", 
                    interval: "222"
                },
                {
                    singer: [{name: "AZU"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400002MOUyv1ogW2w.m4a?vkey=9DF5EA02C87AACDF47493B299C5E58DE0FA5AB80ACD4D626725A4DBFB02D589868F930827FA4B064A878EFA9DB6DE2D97F53BE21BDBFEC22&guid=479503354&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001CczYM1PrYPs.jpg?max_age=2592000", 
                    songName: "For You", 
                    interval: "257"
                },
                {
                    singer: [{name: "高梨康治"}, {name: "刃-yaiba-"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400000fS9Gy27TZSX.m4a?vkey=5E6FC8C988FA2F3AAA351CAA79F55F28DD6BD0A86DDA0C4BB8B1B7C2CA721743154A0495A48D601E053E5276CAE0928DE27A899863F03EF4&guid=318210357&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001eAFPP0AFhYh.jpg?max_age=2592000", 
                    songName: "落葉船", 
                    interval: "130"
                },
                {
                    singer: [{name: "増田俊郎"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400003hbVPP1HcDjb.m4a?vkey=8DA7C42347DFA20878A907746F778ECAF4F6071C4D1406F71EC3274B25305D0952564BC9F31B0A7409CD987C83D2EE39C87B0B40BE3EAF01&guid=50781687&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004MqAwD15KeWx.jpg?max_age=2592000", 
                    songName: "ひとり", 
                    interval: "103"
                },
                {
                    singer: [{name: "石崎ひゅーい"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400002E1nYb1YJ6Jc.m4a?vkey=69483A017927D24CC3D80A60D154DC25A22B4F889F2A9C09BF796531E6F7DF43694D5942EFD7A96AB7B32D78D158D3EF56D405CB9914BFB4&guid=73158275&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M0000016WBhm0zjMjA.jpg?max_age=2592000", 
                    songName: "ピノとアメリ", 
                    interval: "271"
                },
                // {
                //     singer: [{name: "六三四"}], 
                //     songUrl: "https://dl.stream.qqmusic.qq.com/C400003LPSKS28dwVH.m4a?vkey=164625BA7093A8911B56E374CD7E252A548BBA6374B6143C42D5BF0E2776F96E44178076C06624BC2A002FCFA8E61B53D333D8BA8E1D1145&guid=1211845657&uin=0&fromtag=38", 
                //     songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002wtHpn4WvR4g.jpg?max_age=2592000", 
                //     songName: "Naruto Main Theme", 
                //     interval: "266"
                // },
                {
                    singer: [{name: "スキマスイッチ"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400000a5qKl049ZSq.m4a?vkey=4C94D1210C3755BF4B2395B4F9AFB976D78F50DC51A55B472316F99CC8E2F465B33BB814C4C7C91C6A11740E57F5A4BE87C6247938149554&guid=1227621519&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001CJE971ev5fd.jpg?max_age=2592000", 
                    songName: "星のうつわ", 
                    interval: "338"
                }
            ]},
            {id: "1", name: "轻音乐", list: [
                {
                    singer: [{name: "Ayasa"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400000rEXFy3W2We1.m4a?vkey=B24FF0CF961361B50B1018F9701509FC5187DF1FB14CD5629448717693535861624FD0C0FE19F73D0B366D25BD5B06B02999D71FFB6400F0&guid=520138824&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003kgM6R21GM7Y.jpg?max_age=2592000", 
                    songName: "告白の夜", 
                    interval: "289"
                },
                {
                    singer: [{name: "広橋真紀子"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400004J9zC301A51y.m4a?vkey=7D3AFF6DD2F82F531CC9807602E71A1E064CC896E6DB979CCABF46358477ED05976049D88DB54BC7B383AEEEA3649A319D3620637A6BF3C3&guid=877578267&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003gyGib30T3BQ.jpg?max_age=2592000", 
                    songName: "いのちの名前 (生命之名)", 
                    interval: "349"
                },
                {
                    singer: [{name: "Key Sounds Label"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400002sXbjS1qsmbh.m4a?vkey=A2A57B0F67403C5488AA7B457B7F0E6450FEE6B13AFB3E1E025BDC87F7FD8234583DBA4088E3A0DBF6816AC056FF18C53112F94D3AD852AB&guid=265239354&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001f2I4I3jRTAY.jpg?max_age=2592000", 
                    songName: "Bloom of Youth", 
                    interval: "148"
                },
                {
                    singer: [{name: "Piano Squall"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400004cjBDF1mIFda.m4a?vkey=425A728D0FAB5551DEDD7C3BE5EFF99934CBAB84363873EC906A4E3CB595C9D51915189391615A57CA50B4ADD90B43434EE4481307A0D30C&guid=246442393&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001THSEv3MoXZx.jpg?max_age=2592000", 
                    songName: "Sadness And Sorrow", 
                    interval: "173"
                }
            ]},
            {id: "2", name: "二次元", list: [
                {
                    singer: [{name: "とあ/nameless"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400002lNU8S1Hyld2.m4a?vkey=9973513A356FFCF76E8B50859EB61C6D75DDB32EDF97A4D6BFC01BF4FB04659EADEF5C37AE012603635F243B6551B84003F404B5B30A6C21&guid=982307569&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001WP7KJ2dqKGi.jpg?max_age=2592000", 
                    songName: "リグレット", 
                    interval: "282"
                },
                {
                    singer: [{name: "とあ/nameless"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400004aeAVG0kfhCL.m4a?vkey=85D7D1BD9E61E33A7F2288DC6B159510D266A9B39DE5CF140268C2BE15CC7D6ADD6725B96FAF52D763FDD1852D70B5006D3FBF5E50AF28A3&guid=1053729799&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000001WP7KJ2dqKGi.jpg?max_age=2592000", 
                    songName: "恋の才能", 
                    interval: "267"
                },
                {
                    singer: [{name: "majiko (まじ娘)"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400004SlTZQ3NWbAO.m4a?vkey=FC5131E6FDFCE565DD1AAB9DD493E70CA2BE941F432CF8B5BFA63DC28B2DBFD7F44B2F7428389F7E25CC6A0D7B7F323E1DC3B9E6AFF353B8&guid=788849075&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002FzKSY0FcypL.jpg?max_age=2592000", 
                    songName: "アイロニ", 
                    interval: "244"
                },
                {
                    singer: [{name: "花たん"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C4000008wYUz3bbhc0.m4a?vkey=3C723BE48A6BDDEA32238B3F248AFF79A75FEC1A1CB5EE55F6478A12D3520823D9A2F85914C927B154A51AC63FBB14FDF4E13C9360C2CA79&guid=1681781604&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000000UxMkW4RxpBD.jpg?max_age=2592000", 
                    songName: "心做し", 
                    interval: "268"
                },
                {
                    singer: [{name: "鎖那"}], 
                    songUrl: "https://dl.stream.qqmusic.qq.com/C400001GpLxv49FO3X.m4a?vkey=85789CCAF994EB6BE6BDBF14810B7B2084E3D29CEB26CCCAADBEA83F5BA5FE4B403C2151ECC648937DC1B8A51F7F8722510554BF500AB1B4&guid=371786930&uin=0&fromtag=38", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M0000016f2u03s50MX.jpg?max_age=2592000", 
                    songName: "言葉のいらない約束", 
                    interval: "254"
                }
            ]},
            {id: "3", name: "蝎", list: [
                // {
                //     singer: [{name: "高梨康治"}, {name: "刃-yaiba-"}], 
                //     songUrl: "http://157.255.154.145/amobile.music.tc.qq.com/C4000003erJ00gnllE.m4a?guid=7068177850&vkey=AB155592DF705A06B94A86014AEAD409D0A48C433F4EA26902A694092B544D19EEB09D5EB22EF725ADAEACE7A2B1E4FEC66C6F52BB1A4213&uin=5875&fromtag=66", 
                //     songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003xst1Y138xyW.jpg?max_age=2592000", 
                //     songName: "失意", 
                //     interval: "120"
                // },
                {
                    singer: [{name: "花粥"}, {name: "马雨阳"}], 
                    songUrl: "http://www.ytmp3.cn/down/48303.mp3", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000003iJBH73UYvmi.jpg?max_age=2592000", 
                    songName: "盗将行", 
                    interval: "198"
                }
                
            ]},
            {id: "4", name: "鼬", list: [
                {
                    singer: [{name: "FLOW"}], 
                    songUrl: "http://112.90.152.146/amobile.music.tc.qq.com/C400000y1RuM0DPQpj.m4a?guid=7068177850&vkey=3D6823917C8DD2B5F99EE78CE5AB83A1EB56E17BCA1AAA33454007AE7A1CEBC5EFC5EB9A14222C2B8D21F9A29DDFCAFBDCCA85ECCC989272&uin=5875&fromtag=66", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M0000014XLHX0FQZHQ.jpg?max_age=2592000", 
                    songName: "Sign", 
                    interval: "236"
                },
                {
                    singer: [{name: "HALCALI"}], 
                    songUrl: "http://27.36.118.29/amobile.music.tc.qq.com/C400003ztNHP00LOu3.m4a?guid=7068177850&vkey=8CD356E74BA7EF3B4C0CD4FFD718873A55A2DB00085AA2BD2A5338F099F615C82C48AD5231AE749D6E02B5402B733CAAF9C8B6E041A14EDD&uin=5875&fromtag=66", 
                    songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000000ihzmW0sGNWt.jpg?max_age=2592000", 
                    songName: "Long Kiss Good Bye", 
                    interval: "246"
                }
            ]}
        ];
        return sliderList[id].list;
    }


    // 新歌播放
    $(".newSong .playIcon").click(function() {
        doubleClickPlay();
        removeListSong();
        var index = $(this).parent().parent().attr("id").replace("ns", "");
        staticPlay(index, $(this));
    });
    
    
    // 双击列表歌曲播放歌曲
    function doubleClickPlay() {
        $(".playerDiv .playerList .song").dblclick(function() {
            var toPlayUrl = $(this).children(".songUrl").text();
            var songPic = $(this).children(".songPic").text();
            var player = document.getElementById("musicAudio");
            if (syncStatus !== 0) {
                return;
            }
            player.src = toPlayUrl;
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

    // 静态模拟
    function staticPlay(index, node) {
        var mUrl = getStaticUrl(index);
        var url = mUrl;
        var lrc = "测试音乐歌词地址";
        // 采用专辑图片代替
        var pic = node.parent().parent().css("background-image").split('(')[1].split(')')[0];
        // 将所点击的歌曲添加到歌曲列表中
        var titleAndAuthor = node.siblings(".titleAndAuthor").text();
        var time = node.siblings(".time").text();
        var albumName = node.siblings(".album").text();
        var songNameAndSinger = "<span class='songNameAndSinger'>" + titleAndAuthor + "</span>";
        // 专辑暂不显示在列表里
        var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
        var songTime = "<span class='songTime'>" + time + "</span>";
        var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
        var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
        var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
        // 列表移除暂时有问题
        var removeSong = "<span class='removeSong'>X</span>";
        var song = "<div class='song'>" + songNameAndSinger + songTime + songLrc + songPic + songUrl + "</div>";
        var songJson = JSON.stringify({
            titleAndAuthor: titleAndAuthor,
            time: time,
            albumName: albumName,
            url: url,
            pic: pic,
            lrc: lrc
        });
        if (findSongIndex(url) === -1) {
            $(song).appendTo($(".playerList"));
            songList.push(songJson); // 添加前校验是否存在这首歌曲
            if (url !== "" | url !== null || url !== undefined) {
                $("#musicAudio").attr("src", url);
                $(".songTime #maxTime").text(time);
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
        play();
        useTimer();
    }

    function getStaticUrl(index) {
        var mUrlList = [
            "http://www.ytmp3.cn/down/48303.mp3",
            "http://ws.stream.qqmusic.qq.com/C400002Dshdj3DPGqg.m4a?fromtag=0&guid=126548448&vkey=4460A0287903DF035C9D4CAB3A75CAD38D4AFE1256D73884889DEC55D525D2144846C1ADEA9BB7E6F87E7A56572F1CF61219E50185BDB952",
            "https://dl.stream.qqmusic.qq.com/C400004BhQke4adHcf.m4a?vkey=2BF8FEC80E035E0C94BE4D56750C91AE6C1CEC0FE700600FC53B2B59EFCEAE0525CE952EF344BADE318020513AC9795E5D8E2AE30CC00352&guid=1263638456&uin=0&fromtag=38",
            "https://dl.stream.qqmusic.qq.com/C400000oW8J53xPhZA.m4a?vkey=910E7CC6B5A188621C11F78034B3068E7C99767C0F7C51C63369E417D699DA2C93921A6AC4FB74EB9631CA81344A384FA1CCCAD227915A18&guid=1854285730&uin=0&fromtag=38",
            "https://dl.stream.qqmusic.qq.com/C4000042QMDR1VzSsx.m4a?vkey=0B5B45DF4852D052F832BFD71C73AFD6BCAEE921F000D982C82636C952D5530C45E84348594B29D9294707E0FECD766B262449D9AA8A0408&guid=519909382&uin=0&fromtag=38",
            "https://dl.stream.qqmusic.qq.com/C400002XWgfo0IKPOH.m4a?vkey=98576503ABB48E8256DAEB4C8FA1D9FD203B8B14330DBDE0256E46A08B0C1F6B860D777BE3440E3E42E9AF8CF16ACFCDA6C2FC4E932F4E94&guid=1508467482&uin=0&fromtag=38",
            "https://dl.stream.qqmusic.qq.com/C400001Bbywq2gicae.m4a?vkey=059C8FC6C991A8D4C209FCB98B1572639B191A6B77759E36DE293DE9B3084AF389C6C38D2361ECC99B79A29985B820A50F3A4FDB755C6129&guid=1713079396&uin=0&fromtag=38",
            "https://dl.stream.qqmusic.qq.com/C400002u8ZOM4C7QF4.m4a?vkey=40F29C24DDD0817FBA8BD86F0B637EDDC832E1739D75DADC4388926604862D9E094AF19BE81A77545F7FDE9702B5AEF2194304B17A5C8751&guid=1922159596&uin=0&fromtag=38"
        ];
        return mUrlList[index];
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
                // 歌曲信息的设置
                $(".player .songPic").css("background-image", "url(" + json.pic + ")");
                $(".songTime #maxTime").text(json.time);
                $(".songTime #songNameAndSinger").text(json.titleAndAuthor);
                // 歌词背景图片和唱片背景图片
                $(".musicLyric .lyricDivBack").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .songPic").css("background-image", "url(" + json.pic + ")");
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
                // 歌曲信息的设置
                $(".player .songPic").css("background-image", "url(" + json.pic + ")");
                $(".songTime #maxTime").text(json.time);
                $(".songTime #songNameAndSinger").text(json.titleAndAuthor);
                // 歌词背景图片和唱片背景图片
                $(".musicLyric .lyricDivBack").css("background-image", "url(" + json.pic + ")");
                $(".musicLyric .songPic").css("background-image", "url(" + json.pic + ")");
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
        let i = arr.length;
        while(--i > 1) {
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
            stopLyricTimer();
            $(".musicLyric").css("display", "none");
            $(".notLyric").css("display", "");
            $(".musicPlayer").css("top", "150px");
            showLyric = false;
        }
    });

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
            {},
            {listId: "1", list: [
                {songId: "", songUrl: "https://dl.stream.qqmusic.qq.com/C400000jgeta4Havfd.m4a?vkey=DE72F814A09D0AA3661BC841B5C9B1402E5BC8A4E013AC63C2491490CC13117E812A72239FF0F4BEFD6C8378A919C369271589C427FD3457&guid=2134845233&uin=0&fromtag=38", songName: "淋雨一直走", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000004NbEqF406qjd.jpg?max_age=2592000", singer: [{name: "张韶涵"}], interval: "204"}, 
                {songId: "", songUrl: "https://dl.stream.qqmusic.qq.com/C400002h62C40NbkWI.m4a?vkey=AED0CFD74CE79F30CF40C72F5567518E47C8BF643F7679A63D2E9D972D79DBA0A0F8C46C0CBA9BC2C16D314CE33F06EE742152F61FE765A5&guid=295901027&uin=0&fromtag=38", songName: "改变自己", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002Zwh5p4HgecI.jpg?max_age=2592000", singer: [{name: "王力宏"}], interval: "194"}, 
                {songId: "", songUrl: "https://dl.stream.qqmusic.qq.com/C400002nSbe63rrXQR.m4a?vkey=55234E0E082685DDB84FC999ABDB74BC82828219E5ED65096E72F38523DA28F8D248DC5A9409619328BB88F7D60BCB7123F1DB09762D628D&guid=527210072&uin=0&fromtag=38", songName: "最美的太阳 (Live)", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M0000005U37G22CFDL.jpg?max_age=2592000", singer: [{name: "张杰"}], interval: "256"}
            ]},
            {listId: "2", list: [
                {songId: "", songUrl: "https://dl.stream.qqmusic.qq.com/C400000fVqPH1RjwS3.m4a?vkey=A48CFE5D60D6E6617FEEEB28CBFB9D93E354A6733B6233BB6F4510DAF5A881B9ED1AB93F2449E5F472487C8122D0E5F9822EF43DA9ED1DDE&guid=1927271813&uin=0&fromtag=38", songName: "飞云之下", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000000XAvOz4exGKL.jpg?max_age=2592000", singer: [{name: "韩红"}, {name: "林俊杰"}], interval: "266"}, 
                {songId: "", songUrl: "https://dl.stream.qqmusic.qq.com/C400002pX7tP0EkCtr.m4a?vkey=6B5CFB6ED28C53613562C4D96B7E1BCA8084BA0DD95332CC57B189EAE2B26F709624FE8C9EF910E284B2E7550BAEDFBA16679A440F80F356&guid=462296247&uin=0&fromtag=38", songName: "月牙湾", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002rWc0539KOwa.jpg?max_age=2592000", singer: [{name: "刘至佳"}], interval: "245"}
            ]}
        ];
        return songList[listId].list;
    }

    // 歌手
    $(".authorLists .author").click(function() {
        var singerId = $(this).children(".authorPic").attr("id").replace("a", "");
        addSong(getSong(singerId));
        doubleClickPlay();
        removeListSong();
        play();
        useTimer();
    });

    function getSong(singerId) {
        var songs = [
            {singer: [{name: "周杰伦"}], songUrl: "https://dl.stream.qqmusic.qq.com/C400003cI52o4daJJL.m4a?vkey=00B09348FC3AE5B8649CA14BE3AD3B2D8C8FEC1325B18C6C1EF93C87ECFF81EC55F6641458AC4A04B0859D4ADF9B2D9E8466B954ECB6A4B1&guid=147929556&uin=0&fromtag=38", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002Neh8l0uciQZ.jpg?max_age=2592000", songName: "花海", interval: "264"},
            {singer: [{name: "林俊杰"}], songUrl: "https://dl.stream.qqmusic.qq.com/C400003UTRfZ12wGOs.m4a?vkey=A31434AD8FE06B181999C46AE090B6A91BCDFB9D097ED172753E8C510B7A8DFA00CF7093FD7A0D24ECF7E33BE1F1FA78B05D6DE6CBA2BE08&guid=586826447&uin=0&fromtag=38", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002g6zv02X7SNi.jpg?max_age=2592000", songName: "醉赤壁", interval: "281"},
            {singer: [{name: "王力宏"}], songUrl: "https://dl.stream.qqmusic.qq.com/C400004AeIvh4ML0Bz.m4a?vkey=1EAFDC6873473ED9D4407541EE690FCF9EB3D977BF9A99873344FAF93344F034A8152890AD40C843B189FC494011BEDE830668B5BC4DE331&guid=1711120943&uin=0&fromtag=38", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002iWU6B2ZvA8V.jpg?max_age=2592000", songName: "需要人陪", interval: "251"},
            {singer: [{name: "邓紫棋"}], songUrl: "https://dl.stream.qqmusic.qq.com/C400002DDrk12IuwUW.m4a?vkey=7DC0DDCA6798256ADF84621860F1D5BBA7910AA4917A5E7C5D94C30029D8544E2A3693B80C7E07047BD5F247A05BE067254F1D92EE5337ED&guid=154045986&uin=0&fromtag=38", songPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002F059l1kCcdr.jpg?max_age=2592000", songName: "我的秘密", interval: "252"},
            {singer: [{name: "ちゃた"}], songUrl: "https://dl.stream.qqmusic.qq.com/C400003he1nl3uufhe.m4a?vkey=825C5972DCE0383E483321256AA14797192B9A7F9496E65400F8FB267DCBB54AC87CB5C6EDF29186F4BFEB53A212003DF5B689FD0127FBFD&guid=1571054023&uin=0&fromtag=38", songPic: "http://y.gtimg.cn/music/photo_new/T002R300x300M000004OHYfb34IrnF.jpg?max_age=2592000", songName: "Secret", interval: "276"}
        ];
        return songs[singerId];
    }

    function addSong(vSongJson) {
        var author = "";
        var authors = vSongJson.singer;
        if (authors !== undefined || authors !== null) {
            for (var a = 0; a < authors.length; a++) {
                author += authors[a].name + "&";
            }
            if (author.length > 0) {
                author = author.substr(0, author.length - 1);
            }
        }
        var lrc = "";
        var pic = vSongJson.songPic;
        var url = vSongJson.songUrl;
        var title = vSongJson.songName;
        var titleAndAuthor = title + "-" + author;
        var time = intervalFormat(vSongJson.interval);
        var albumName = "";
        var songNameAndSinger = "<span class='songNameAndSinger'>" + titleAndAuthor + "</span>";
        var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
        var songTime = "<span class='songTime'>" + time + "</span>";
        var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
        var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
        var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
        // 列表移除存在问题
        var removeSong = "<span class='removeSong'>X</span>";
        var song = "<div class='song'>" + songNameAndSinger + songTime + songLrc + songPic + songUrl + "</div>";
        var songJson = JSON.stringify({
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
                var player = document.getElementById("musicAudio");
                player.src = url;
                $(".player .songPic").css("background-image", "url(" + pic + ")");
                $(".songTime #maxTime").text(time);
                $(".songTime #songNameAndSinger").text(titleAndAuthor);
                // currentLrc = lrc;
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

    // 批量导入(顺序导入时限制了播放为导入首位的歌曲)
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
            var songNameAndSinger = "<span class='songNameAndSinger'>" + titleAndAuthor + "</span>";
            var songAlbum = "<span class='songAlbum'>" + albumName + "</span>";
            var songTime = "<span class='songTime'>" + time + "</span>";
            var songLrc = "<span class='songLrc' style='display: none;'>" + lrc + "</span>";
            var songPic = "<span class='songPic' style='display: none;'>" + pic + "</span>";
            var songUrl = "<span class='songUrl' style='display: none;'>" + url + "</span>";
            // 列表移除存在问题
            var removeSong = "<span class='removeSong'>X</span>";
            var song = "<div class='song'>" + songNameAndSinger + songTime + songLrc + songPic + songUrl + "</div>";
            var songJson = JSON.stringify({
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
                        var player = document.getElementById("musicAudio");
                        player.src = url;
                        $(".player .songPic").css("background-image", "url(" + pic + ")");
                        $(".songTime #maxTime").text(time);
                        $(".songTime #songNameAndAuthor").text(titleAndAuthor);
                        // currentLrc = lrc;
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
})