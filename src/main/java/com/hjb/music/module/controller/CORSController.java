package com.hjb.music.module.controller;

import com.hjb.music.module.utils.HttpUtils;
import com.hjb.music.module.utils.MapUtils;
import com.hjb.music.module.utils.Result;
import com.hjb.music.module.utils.ResultUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CORSController {

    private static Logger logger = LoggerFactory.getLogger(CORSController.class);

    @RequestMapping("/handleCORS")
    public Result handleRequest(@RequestBody Map<String, Object> map) {
        String url = MapUtils.getStringFromMapNotNull(map, "url");
        String response = "";
        try {
            response = HttpUtils.doGet(url);
        } catch (Exception e) {
            logger.error("http调用异常: " + e.getMessage());
        }
        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        return ResultUtils.success(result);
    }
}
