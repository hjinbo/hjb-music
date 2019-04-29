package com.hjb.music.module.controller;

import com.hjb.music.module.service.KugouMusicService;
import com.hjb.music.module.utils.MapUtils;
import com.hjb.music.module.utils.Result;
import com.hjb.music.module.utils.ResultUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/kugouMusic")
public class KugouMusicController {

    private static Logger logger = LoggerFactory.getLogger(KugouMusicController.class);

    @Autowired
    KugouMusicService kugouMusicService;

    @RequestMapping("/getSongData")
    public String getSongData(@RequestBody Map<String, Object> map) throws IOException {
        String songHash = MapUtils.getStringFromMapNotNull(map, "songHash");
        String response = kugouMusicService.getSongDataByHash(songHash);
        return response;
    }

    @RequestMapping("/search")
    public String search(@RequestBody Map<String, Object> map) throws IOException {
        String keyWord = MapUtils.getStringFromMapNotNull(map, "keyWord");
        String response = kugouMusicService.search(keyWord);
        return response;
    }
}
