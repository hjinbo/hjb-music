package com.hjb.music.module.service;

import com.hjb.music.module.utils.HttpUtils;
import com.hjb.music.module.utils.UnicodeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

@Service
public class KugouMusicService {

    private static Logger logger = LoggerFactory.getLogger(KugouMusicService.class);

    private static String searchRequest = "http://mobilecdn.kugou.com/api/v3/search/song";
    private static String format = "json";
    private static int page = 1;
    private static int pageSize = 20;
    private static String showType = "1";

    private static String songDataRequest = "http://www.kugou.com/yy/index.php?r=play/getdata&hash=";

    public String getSongDataByHash(String songHash) throws IOException {
        String jsonResponse = HttpUtils.doGet(songDataRequest + songHash);
        return UnicodeUtils.decode(jsonResponse);
    }

    public String search(String searchText) throws IOException {
        String searchUrl = setSearchUrl(searchText);
        String jsonResponse = HttpUtils.doGet(searchUrl);
        return UnicodeUtils.decode(jsonResponse);
    }

    private String setSearchUrl(String searchText) throws UnsupportedEncodingException {
        String keyWord = URLEncoder.encode(searchText, "UTF-8");
        String searchUrl = searchRequest + "?format=" + format + "&keyword=" + keyWord
                + "&page=" + page + "&pagesize=" + pageSize + "&showtype=" + showType;
        return searchUrl;
    }
}
