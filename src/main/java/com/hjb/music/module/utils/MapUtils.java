package com.hjb.music.module.utils;

import java.util.Map;

public class MapUtils {

    public static String getStringFromMap(Map<String, Object> map, String key, String defaultValue) {
        if (map.get(key) == null) {
            return defaultValue;
        }
        return String.valueOf(map.get(key));
    }

    public static String getStringFromMapNotNull(Map<String, Object> map, String key) {
        if (map.get(key) == null) {
            throw new RuntimeException("从map中获取的【" + key + "】为空");
        }
        return String.valueOf(map.get(key));
    }

    public static Integer getIntegerFromMap(Map<String, Object> map, String key, Integer defaultValue) {
        if (map.get(key) == null) {
            return defaultValue;
        }
        return Integer.parseInt(String.valueOf(map.get(key)));
    }

    public static Integer getIntegerFromMapNotNull(Map<String, Object> map, String key) {
        if (map.get(key) == null) {
            throw new RuntimeException("从map中获取的【" + key + "】为空");
        }
        return Integer.parseInt(String.valueOf(map.get(key)));
    }
}
