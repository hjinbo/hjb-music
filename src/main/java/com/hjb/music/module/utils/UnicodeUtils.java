package com.hjb.music.module.utils;

import java.util.ArrayList;
import java.util.List;

public class UnicodeUtils {

    public static String decode(String input) {
        input = input.trim().replaceAll("(?i)\\\\u", "%u");
        return unescape(input);
    }

    public static String unescape(String input) {
        int len = input.length();
        StringBuffer result = new StringBuffer();
        result.ensureCapacity(len);
        int lastPos = 0, pos = 0;
        char ch;
        while (lastPos < len) {
            pos = input.indexOf("%", lastPos);
            if (pos == lastPos) {
                if (input.charAt(pos + 1) == 'u') {
                    ch = (char) Integer.parseInt(input.substring(pos + 2, pos + 6), 16);
                    result.append(ch);
                    lastPos = pos + 6;
                } else {
                    ch = (char) Integer.parseInt(input.substring(pos + 1, pos + 3), 16);
                    result.append(ch);
                    lastPos = pos + 3;
                }
            } else {
                if (pos == -1) {
                    result.append(input.substring(lastPos));
                    lastPos = len;
                } else {
                    result.append(input.substring(lastPos, pos));
                    lastPos = pos;
                }
            }
        }
        return result.toString();
    }
}
