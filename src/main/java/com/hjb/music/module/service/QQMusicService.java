package com.hjb.music.module.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hjb.music.module.utils.GameException;
import com.hjb.music.module.utils.HttpUtils;
import com.hjb.music.module.utils.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class QQMusicService {

    private static Logger logger = LoggerFactory.getLogger(QQMusicService.class);

    private static String hotSongsUrl = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg" +
            "?g_tk=5381&uin=0&format=json&inCharset=utf-8" +
            "&outCharset=utf-8¬ice=0&platform=h5&needNewCode=1&tpl=3" +
            "&page=detail&type=top&topid=27&_=1519963122923";

    private static String fileNamePrefix = "C400";
    private static String fileNameSuffix = ".m4a";
    private static String keyUrl = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg";
    private static String format = "json205361747";
    private static String platform = "yqq";
    private static String cid = "205361747";
    private static String guid = "126548448";
    private static String songUrlPrefix = "http://ws.stream.qqmusic.qq.com/";
    private static String fromTag = "0";

    /**
     * 根据songMid获得播放地址
     * @param songMid
     * @return
     * @throws IOException
     */
    public String getMusicPlayUrl(String songMid) throws IOException {
        String keyUrl = getKeyUrl(songMid);
        String jsonResponse = HttpUtils.doGet(keyUrl);
        String vkey = getVkey(jsonResponse);
        return songUrlPrefix + fileNamePrefix + songMid + fileNameSuffix
                + "?fromtag=" + fromTag + "&guid=" + guid + "&vkey=" + vkey;
    }

    /**
     * 根据songMid拼接获得vkey的url
     * @param songMid
     * @return
     */
    private static String getKeyUrl(String songMid) {
        return keyUrl + "?format=" + format + "&platform=" + platform
                + "&cid=" + cid + "&guid=" + guid + "&songmid=" + songMid
                + "&filename=" + fileNamePrefix + songMid + fileNameSuffix;
    }

    /**
     * 解析相应json中的vkey字段
     * @param jsonResponse
     * @return
     */
    private static String getVkey(String jsonResponse) {
        JSONObject json = JSONObject.parseObject(jsonResponse);
        JSONArray array = JSONObject.parseObject(json.getString("data"))
                .getJSONArray("items");
        String vkey = "";
        for (int i = 0; i < array.size(); i++) {
            vkey = array.getJSONObject(i).getString("vkey");
        }
        if (StringUtils.isNull(vkey)) {
            throw new GameException(-99, "获取【vkey】字段失败，没有该字段或字段为空");
        }
        logger.info("解析得到的vkey: {}", vkey);
        return vkey;
    }
}
