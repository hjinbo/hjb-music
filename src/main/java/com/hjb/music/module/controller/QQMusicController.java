package com.hjb.music.module.controller;

import com.hjb.music.module.service.QQMusicService;
import com.hjb.music.module.utils.MapUtils;
import com.hjb.music.module.utils.Result;
import com.hjb.music.module.utils.ResultUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qqMusic")
public class QQMusicController {

    private static Logger logger = LoggerFactory.getLogger(QQMusicController.class);

    @Autowired
    QQMusicService qqMusicService;

    @RequestMapping("/getMusicPlayUrl")
    public Result getMusicPlayUrl(@RequestBody Map<String, Object> map) throws IOException {
        String songMid = MapUtils.getStringFromMapNotNull(map, "songMid");
        String musicPlayUrl = qqMusicService.getMusicPlayUrl(songMid);
        Map<String, Object> result = new HashMap<>();
        result.put("musicPlayUrl", musicPlayUrl);
        return ResultUtils.success(result);
    }


}
