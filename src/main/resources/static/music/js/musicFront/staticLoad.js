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
        getSliderImg();
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
        // 采用本地图片
    }

    // 获得新歌
    function getNewSongs() {
        var newSongList = [
            {albumId: "36062", albumName: "魔杰座", singer: [{name: "周杰伦"}], songName: "稻香", songMid: "004FetLy2zme0O", interval: "223"},
            {albumId: "8217", albumName: "范特西", singer: [{name: "周杰伦"}], songName: "简单爱", songMid: "000qeAhg2Lj8sH", interval: "271"},
            {albumId: "36062", albumName: "魔杰座", singer: [{name: "周杰伦"}], songName: "给我一首歌的时间", songMid: "004BhQke4adHcf", interval: "253"},
            {albumId: "194021", albumName: "十二新作", singer: [{name: "周杰伦"}], songName: "明明就", songMid: "0001Xmx74KWEvK", interval: "258"},
            {albumId: "36062", albumName: "魔杰座", singer: [{name: "周杰伦"}], songName: "说好的幸福呢", songMid: "0042QMDR1VzSsx", interval: "256"},
            {albumId: "20612", albumName: "七里香", singer: [{name: "周杰伦"}], songName: "借口", songMid: "001MfKU24eYVIc", interval: "260"},
            {albumId: "20612", albumName: "七里香", singer: [{name: "周杰伦"}], songName: "搁浅", songMid: "001Bbywq2gicae", interval: "240"},
            {albumId: "852856", albumName: "哎呦，不错哦", singer: [{name: "周杰伦"}], songName: "手写的从前", songMid: "002u8ZOM4C7QF4", interval: "297"},
            {albumId: "1458791", albumName: "周杰伦的床边故事", singer: [{name: "周杰伦"}], songName: "一点点", songMid: "002lW4Yl3ylM02", interval: "221"},
            {albumId: "194021", albumName: "十二新作", singer: [{name: "周杰伦"}], songName: "红尘客栈", songMid: "003xv4w313tZHV", interval: "274"},
            {albumId: "56705", albumName: "跨时代", singer: [{name: "周杰伦"}], songName: "说了再见", songMid: "00265Jxe3JzXOJ", interval: "282"}
        ];

        for (var i = 0; i < newSongList.length; i++) {
            var album = newSongList[i].albumName;
            // singer的结构是一个数组
            var singers = newSongList[i].singer;
            var author = "";
            for (var s = 0; s < singers.length; s++) {
                author += singers[s].name + "&";
            }
            if (author.length > 0) {
                author = author.substr(0, author.length - 1);
            }
            var albumId = newSongList[i].albumId;
            var albumImg = "http://imgcache.qq.com/music/photo/album_300/" + albumId % 100 + "/300_albumpic_" + albumId + "_0.jpg";
            var title = newSongList[i].songName;
            var mid = newSongList[i].songMid;
            var time = newSongList[i].interval;
            $("#ns" + i + " .content .titleAndAuthor").text(title + "-" + author);
            $("#ns" + i + " .content .time").text(intervalFormat(time));
            $("#ns" + i + " .content .album").text(album);
            $("#ns" + i + " .content .mid").text(mid);
            $("#ns" + i).css("background-image", "url(" + albumImg + ")");
        }
    }

    // 获得歌单
    function getHotSongList() {
        var hotSongListList = [
            {listId: "0", listName: "", listPic: ""},
            {listId: "1", listName: "校园广播站 • 经典励志曲", listPic: "https://p.qpic.cn/music_cover/AhbCa0vazSRDjEJhYwthgiaicOJR0gBcgGibPlRJK7Vy2fsSWQ9EQcOyQ/300?n=1"},
            {listId: "2", listName: "不同的声音", listPic: "https://y.gtimg.cn/music/photo_new/T002R300x300M000002rWc0539KOwa.jpg?n=1"}
        ];

        for (var i = 1; i < hotSongListList.length; i++) {
            $(".hotSongList .picBack #sl" + i).css("background-image", "url(" + hotSongListList[i].listPic + ")");
            $(".hotSongList .picBack #sl" + i).parent().siblings(".info").text(hotSongListList[i].listName);
            $(".hotSongList .picBack #sl" + i).parent().siblings(".listId").text(hotSongListList[i].listId);
        }
    }

    // 获得歌手
    function getAuthorList() {
        var authorList = [
            {singerId: "0", name: "周杰伦", pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000"},
            {singerId: "1", name: "林俊杰", pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001BLpXF2DyJe2.jpg?max_age=2592000"},
            {singerId: "2", name: "王力宏", pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001JDzPT3JdvqK.jpg?max_age=2592000"},
            {singerId: "3", name: "邓紫棋", pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000001fNHEf1SFEFN.jpg?max_age=2592000"},
            {singerId: "4", name: "ちゃた", pic: "https://y.gtimg.cn/music/photo_new/T001R300x300M000002BrFgT47yIOO.jpg?max_age=2592000"}
        ];
        for (var i = 0; i < authorList.length; i++) {
            $(".authorListsDiv .authorLists .author #a" + i).css("background-image", "url(" + authorList[i].pic + ")");
            $(".authorListsDiv .authorLists .author #a" + i).siblings(".authorName").text(authorList[i].name);
        }
    }
    
    // 加载MV
    function getMVList() {
        var demoMVList = [
            {
                mvName: "不能说的秘密",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M101001CN55Q1kOac5.jpg",
                mvSrcList: [
                    "http://183.232.63.156/vcloud1049.tc.qq.com/1049_M2100726003n5HIv043vbG1001540750.f20.mp4?vkey=FF425CD8C3EFCB6FD5A99A0A85885D91F79F225E48D5E3B54FDDAD8611BF7933A931DFB3B1A43AFE8013F4DF7B803B78CA1CF9C38652B8F71AE8B98F29379544879F337D7E9E3C755459095851750AE968B1F9E16B818BA9",
                    "http://183.232.63.187/vcloud1049.tc.qq.com/1049_M2100726003n5HIv043vbG1001540750.f20.mp4?vkey=9CC0C52910E1D631EE756394EFCC6B9CFCBB92A03ACB33C3BD54893B16D3AD23C2ED8DDBFE670A036414DF688854F36F7575E8839FAA2E48E541C5D31F758EADC4DD5F1880E6EA0B2B6ABA6C67A8196F35EC6C046F2D49FE",
                    "http://183.232.83.16/vcloud1049.tc.qq.com/1049_M2100726003n5HIv043vbG1001540750.f20.mp4?vkey=758FB5CAF5F90E1C1D52BEC4D019178E31106F3680086951415E7C06DF92C4A3F4B878519B278981C6012BBDC7719FA72C2CD2854C5FDAD402412A7BFEB5CBCD4CF389DA8300BF1645303BCD3A99E6E959B7CA8977B0F84C",
                    "http://183.240.120.14/vcloud1049.tc.qq.com/1049_M2100726003n5HIv043vbG1001540750.f10.mp4?vkey=D52ACE788F9333C8A58B68CFD466C3D1C97204173698DD331560D05530FBCEDF3990CE62B25B2C898BD645568C60840FF748F3DF1FFBDAC1A48533D833CB70D8BD12CF7DA07A4A79939620F271E31CB42CBCC62424BC4077"
                ]
            },
            {
                mvName: "蒲公英的约定",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M101004ATS4F46slaL.jpg",
                mvSrcList: [
                    "http://183.240.141.13/vcloud1049.tc.qq.com/1049_M21003580021t52M0LsWW11001544384.f20.mp4?vkey=34C995D21A35F4DC0D58AF696D4CA10CA977285637225AE8A4DED06CC980210B428004C285A8EB7B8C95FFB2ECA01492E8E37DAA3BB559B03BCC87EA5AEB318ABD98C35A414DBE9E750119167EBE545B666CDA285AA6FCAB",
                    "http://120.233.37.152/vcloud1049.tc.qq.com/1049_M21003580021t52M0LsWW11001544384.f20.mp4?vkey=78F74043CCED602982F7E3FD4543C2A2E04355CCA3DF90E28904CA17110FEBCFC13CB37471898C2FB8B3136ED0006D436928AFE0B40B9C52086AA72387E84A22B4069D57A8A37C036F0DBCA11F2BE65074A9029A03AD8904",
                    "http://120.233.37.155/vcloud1049.tc.qq.com/1049_M21003580021t52M0LsWW11001544384.f20.mp4?vkey=CAB1CFBED4C1355F4E89B0A603E7CA80D2602C9B8C426893BA4B3C0B734891BB0031E5D33D21CCD7E1402CCF4163D68ADDCD6A1066A4CBD11C2F75116BD632895B77151ED9594300BED2BD8FABECE469EA995B85B25E1CB6",
                    "http://183.240.120.29/vcloud1049.tc.qq.com/1049_M21003580021t52M0LsWW11001544384.f10.mp4?vkey=482F222CE12D8F803264A786DCA7B238420DF126294460A56FC7316EFD8FDC882C7118C00B7074BDF4C3A6F5CA466980766F3D174133CB095A6774D2E1F4503E2D289E9D424F480B87CA8AD8CFC110A331F87678601BA043"
                ]
            },
            {
                mvName: "听见下雨的声音",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M000003QDLcC3hr0qE.jpg",
                mvSrcList: [
                    "http://183.240.120.20/vcloud1049.tc.qq.com/1049_M2111600002tOiKf03y4Dh1001539300.f40.mp4?vkey=4FE0102BA0D99A4EAD117FD8D56601DA3B95A5FC5BA7E2C6C7A583CF43A0096C5DD53DDC8273F3E533416140B12A0D817F76DD87300591BA0AECF7E10FA4505538F84E0DB3E17B94DD991A19D4E317AA2055FB177E3D82BF",
                    "http://183.240.141.16/vcloud1049.tc.qq.com/1049_M2111600002tOiKf03y4Dh1001539300.f30.mp4?vkey=672593EB2B0A1ED4F06327D303EAEB522CB03833144635CBDFD45486F2F634C8FBCC7B6618B496A5D57B9B4E3FF15D51F77E45A1E50DDC7DFB8FC5688B75D5B4A3E5F51903C75F12B960714721A8A871CF8712281B82F270",
                    "http://183.240.141.27/vcloud1049.tc.qq.com/1049_M2111600002tOiKf03y4Dh1001539300.f20.mp4?vkey=AF3E4D43C44AF269E788CAB4EB4DCD692CF67F335AD405E6A8718AAF22A89A66080C8FB0BDD1EA5C2B6DD1A63E6145EB74B15749B9EAC71629159B4331F6C5453DD13C509FE585BC3502285C52F88BF61A47B8D85EF374CE",
                    "http://183.232.254.144/vcloud1049.tc.qq.com/1049_M2111600002tOiKf03y4Dh1001539300.f10.mp4?vkey=D01A2E1BD7E11A57FAE6A08D2317D5397400085397FCB371654B0F78391898DD6F3C57117EF7A61E9E95845663DF5D5941D4BCAA228098CAF424D9F91EC50CB89801DE9D09374855CB576AB0FF79D2849D6BCD4BBB8B4FF1"
                ]
            },
            {
                mvName: "晴天",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M10100061J2t0b0PPW.jpg",
                mvSrcList: [
                    "http://183.232.248.15/vcloud1049.tc.qq.com/1049_M0101155002LybLl3CXY3b1001551691.f20.mp4?vkey=F09FFBB30E9FD564F5B81147E50F3375C744F56C0DE1C03B298BCD39EB2185234BD32E0239C6D8275AB8FB69D8DECB04FC9C3DC0B3429F05FDC19CC6C5B1EADEA2E860740FE4112D0FBAE73B478C712668712A885F7D10DA",
                    "http://183.240.120.15/vcloud1049.tc.qq.com/1049_M0101155002LybLl3CXY3b1001551691.f30.mp4?vkey=66DB2F0702F3ABB1ED89F7C4991833BC4226B526556322B8517259BA711F5BCA03B19622706D142718F6A5B36715530671A90F0BBD79BAEFB8B8296F17D3052A81B35C1838526990D1838FC9AE9D847910F8078118C88FC2",
                    "http://183.240.141.19/vcloud1049.tc.qq.com/1049_M0101155002LybLl3CXY3b1001551691.f20.mp4?vkey=43068FE11875F0C30F950E2A8609DADC3603D9371A20945C66A3E54D5CCC948074D8E7F08E4D9EDF27860AF0963EB0E70609E373454D302CB277717F97F7C1CAB2A1433FB1625618EFED01F7EB091D0675A089A5CB321DB9",
                    "http://183.240.141.17/vcloud1049.tc.qq.com/1049_M0101155002LybLl3CXY3b1001551691.f20.mp4?vkey=1993B5FF72FC337BC0DEC9B895ACC7754EDF44C89CA25AABB7E0291B4E0874AB53756F8F5A926C0BB7A491661566FFBF2FD7D1C415AE74919621A3CC6E127DE38F9C2F732F78D0288E81CD163A277A17727A26706C2E5815"
                ]
            },
            {
                mvName: "安静",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M101002HF9Oz1ioJAw.jpg",
                mvSrcList: [
                    "http://183.232.83.19/vcloud1049.tc.qq.com/1049_M21038720015FzSc3B1M201001543425.f20.mp4?vkey=4A6E60BC8FD6311C527A86365AC62DD9261BB50A2D866F718BBCD79734F151A4DFB968B229C10D621C75B50297DC6373CF78F32A33B9784B41FBF3FE5823BB59EF7FED373E9A10A59C5642A8B3C8F0F32C0D948724BE9CC7",
                    "http://183.240.120.24/vcloud1049.tc.qq.com/1049_M21038720015FzSc3B1M201001543425.f30.mp4?vkey=5A18C89AC6FE62C74E4A7D905150F38C328AC9EA06CE7A3289900391F2673F2F7EF6AAF75197C71A6F5945E9AA253C487B28B9308D8ADE26BB46287A00E42438BAE8A208FB31860DA6E5B5637A408027E0A2709C850D3CFF",
                    "http://183.232.83.21/vcloud1049.tc.qq.com/1049_M21038720015FzSc3B1M201001543425.f20.mp4?vkey=12C29FDB25B8268A3137B184EAA8C907A6A64D18E8C13C81E4784F4C389C1E9F7F02F59D660AE80001228287BCA809EF4084948E7D024BD50B738B7AE1F50D94AB77BA15CE88C085B07664AEEB355D8015985D8D6385CC12",
                    "http://183.232.254.145/vcloud1049.tc.qq.com/1049_M21038720015FzSc3B1M201001543425.f10.mp4?vkey=BE82DD60A0FA41DA0829A0ED3BB043D710EF60EA878045D46CA8AFA97DC6F399C28411A330E3369F8E095F090FA75D907A89217F14A97D5B5299F8BFBA1538BA59F0AAE492025624E6950EFD4CD87B7AD5F243BACB8EFA24"
                ]
            },
            {
                mvName: "退后",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M101000fas3p24RIyD.jpg",
                mvSrcList: [
                    "http://183.240.141.16/vcloud1049.tc.qq.com/1049_M2101659000pcz950yMIrm1001542705.f20.mp4?vkey=50E5E8E619EB6AEFFDC6D5E1FF6A2BB54372268EB65E8D7876E049BC380F92B45D2BA4FC7B6A44EB1BAE1B8E49BBA9FF3136ACA09B975352EEC458270884CEC9DAD6AAB602089A669B17F5C0366AA024EE76205615A44BD7",
                    "http://120.233.37.155/vcloud1049.tc.qq.com/1049_M2101659000pcz950yMIrm1001542705.f20.mp4?vkey=DC593ECD47A3C620C309B7D5AD4A94ADF00A11C21EEA9022717649A9DCE5A41FD7C71E613BDE96798E851022EE6EEC8DF019B24935685738CBA5DBADFB6E1A7DA94E9A7562B90BB07F736BB79E1FD119232C49F40EFC680D",
                    "http://183.232.83.15/vcloud1049.tc.qq.com/1049_M2101659000pcz950yMIrm1001542705.f20.mp4?vkey=62F3EE53B8682607BE7494786891845D50A53EA39D08FDE06FF53A7F123CBB3C0C167F508E9B5B1425FE68F5F167AEBAE8851B81072C879B1BDEA51078931F188A90F9B710436925DD5DEA8AFB1DA8BF17F2B928CF4D8A60",
                    "http://120.233.37.146/vcloud1049.tc.qq.com/1049_M2101659000pcz950yMIrm1001542705.f10.mp4?vkey=93B26289AB037695B3308564CE28F453EC8D1EDB8A50DA2E41B8752456AC39EFA560E0D862C3003115BBF2D34775F8A2A583F6C2B8AD04938CD6FD43278D1ED16B7B2302B3AA07EB58767E48A2E2D9C389F3EE26A393AF8E"
                ]
            },
            {
                mvName: "花海",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M101000o8suF4BZ0vX.jpg",
                mvSrcList: [
                    "http://183.240.120.22/vcloud1049.tc.qq.com/1049_F2100732004T2cb32yMiiZ1001543235.f20.mp4?vkey=81B98CCF4581AA862DFACAFC9ED936BD51DA4CE4823F8B7D45A010653152934E26A4C101B648E419BCD11A566E2244F8D40DFB3C938F03ADCC2119AD575FA07663BA50FAD722BE1A89E4F43ECE9D476F04E283736E4CC411",
                    "http://183.240.141.23/vcloud1049.tc.qq.com/1049_F2100732004T2cb32yMiiZ1001543235.f20.mp4?vkey=CA0A8D611492EE6286671B670D70CBD9C768D576211FAAC3BAB5E8DE8EF905C1DF49591E28E19A0965A0293038A1137CCE70668A67442108D2C0B22E4F874586C96ECB545850DDC6CFF07457C623A89A08B94A5FADA6AF64",
                    "http://183.232.83.15/vcloud1049.tc.qq.com/1049_F2100732004T2cb32yMiiZ1001543235.f20.mp4?vkey=AA9D7757299DD6A221144694DA4C5B271A38FAFBB9BEB768402E987B05F723DF635F2BE7100A47150B8F7223B9248E658414B58E23F011F1EEF3EDA8CDB2571BEF11BF3FACA4CBC230E12CEA9674FFC73673CE03F48EDC35",
                    "http://120.233.37.143/vcloud1049.tc.qq.com/1049_F2100732004T2cb32yMiiZ1001543235.f10.mp4?vkey=5398173A3652A182E177B6D799762DED9DB43B5F30FDEED74B3A94244EA2EBB76E7D46D6448AF2AEC40BF7FD66C0C2C9AED9643A2F7B71CFD1ED6F6DEF159A058887FF4C7D3F63B8119535370E87AF08E9F25DD07422E527"
                ]
            },
            {
                mvName: "The Last",
                mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M0000037Lsaw2bhp0Y.jpg?max_age=2592000",
                // mvPicUrl: "http://y.gtimg.cn/music/photo_new/T015R640x360M107003kh3yd1xMXnX.jpg",
                mvSrcList: [
                    "http://58.250.11.18/vcloud1049.tc.qq.com/1049_F01017170037Lsaw2bhp0Y1000905146.f40.mp4?sha=93FA879995205007F11150522F2760724DC7FF81&vkey=66C7369C5AA4CCF566603A7922BA28BD97B18AF19264C7F6872A14A4C7040576E297DDE4B199E94AD31F962CB2E66DC464D22695DF05A1E40846A0E00611134C4C85B72A8FDFC4AF819E91321F723F1F799819B1F117FB9A&ocid=2531136428&ocid=336356105&ocid=2828170596"
                    // "http://183.240.120.17/vcloud1049.tc.qq.com/1049_M2161200002lV9zR3IEtDr1001541753.f40.mp4?vkey=02473D6FC4CDE70D54E4141105167F77831DC8AA442840766BC1684A7816AECF28906B0D638A14F7D503AEFEE3EE2E0440602513E2EE671150098231AF85AE557E358764305C2944E79B64A6DC9C496C7BD89375330721A8",
                    // "http://183.240.118.182/vcloud1049.tc.qq.com/1049_M2161200002lV9zR3IEtDr1001541753.f30.mp4?vkey=2F8E747F27C039DFF27442485EA41CB9253E2E65E0F8224D7DDF9E9EF852CDFE7C51FB2AFA818E95B95E3FDB9FD6887F15D98EABCC6F7F2ECBD4E5FA0C7013BF07AD378DBFC0161B6FF3A91AC0C21E81930FF99A59ADBB7A",
                    // "http://183.232.248.18/vcloud1049.tc.qq.com/1049_M2161200002lV9zR3IEtDr1001541753.f20.mp4?vkey=CAFF23CF0C2067161B753962E4BD6F49D23B93E7AF420427D6B3DF10C1E64BC75A133A2D5850B8E2A4CE745F4F49C9C008B8ECCD645EE9C6D83FEC439C65DA7BCD228CF1D6A9782330E0E12DFE5BE7C2C6C390F59A43B419",
                    // "http://183.232.248.13/vcloud1049.tc.qq.com/1049_M2161200002lV9zR3IEtDr1001541753.f20.mp4?vkey=04E0E6E8C0D8F6046ED858233A1B862B6F09D81A9CF35AF2B3218C16D0A780B17ECB8BF5FE255BB1180170896798C3D9FD2BA32E45CE4E86B8FEFCD6033580F312F4752A4EFA9007973B6E1B59D25501A1097DED8DB47CD6"
                ]
            }
        ];
        for (var i = 0 ; i < mvListNum; i++) {
            // 背景静态图片加载
            $(".hotMVListsDiv .hotMVLists .hotMV #mv" + i).css("background-image", "url(" + demoMVList[i].mvPicUrl + ")");
            // video属性poster图片加载
            $(".hotMVListsDiv .hotMVLists .hotMV #mv" + i + " video").attr("poster", demoMVList[i].mvPicUrl);
            // 视频播放源加载
            var src;
            for (var j = 0; j < demoMVList[i].mvSrcList.length; j++) {
                src = "<source src='" + demoMVList[i].mvSrcList[j] + "' type='video/mp4'>";
                $(src).appendTo($(".hotMVListsDiv .hotMVLists .hotMV #mv" + i + " video"));
            }
            // MV名称加载
            $(".hotMVListsDiv .hotMVLists .hotMV #mv" + i).parent().siblings(".MVName").text(demoMVList[i].mvName);
        }
    }

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