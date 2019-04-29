package com.hjb.music.module.utils;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

public class HttpUtils {

    public static String doGet(String url) throws IOException {
        // 创建Httpclient对象,相当于打开了浏览器
        CloseableHttpClient httpclient = HttpClients.createDefault();
        // 创建HttpGet请求，相当于在浏览器输入地址
        HttpGet httpGet = new HttpGet(url);
        CloseableHttpResponse response = null;
        try {
            // 执行请求，相当于敲完地址后按下回车。获取响应
            response = httpclient.execute(httpGet);
            // 判断返回状态是否为200
            if (response.getStatusLine().getStatusCode() == 200) {
                // 解析响应，获取数据
                String content = EntityUtils.toString(response.getEntity(), "UTF-8");
                return content;
            }
        } finally {
            if (response != null) {
                // 关闭资源
                response.close();
            }
            // 关闭浏览器
            httpclient.close();
        }
        return "";
    }

//    public static void execUrl(String path) throws IOException {
//        //请求的webservice的url
//        URL url = new URL(path);
//        //创建http链接
//        HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
//
//        //设置请求的方法类型
//        httpURLConnection.setRequestMethod("POST");
//
//        //设置请求的内容类型
//        httpURLConnection.setRequestProperty("Content-type", "application/x-www-form-urlencoded");
//
//        //设置发送数据
//        httpURLConnection.setDoOutput(true);
//        //设置接受数据
//        httpURLConnection.setDoInput(true);
//
//        //发送数据,使用输出流
//        OutputStream outputStream = httpURLConnection.getOutputStream();
//        //发送的soap协议的数据
//        String content = "user_id="+ URLEncoder.encode("123", "gbk");
//
//        //发送数据
////        outputStream.write(content.getBytes());
//
//        //接收数据
//        InputStream inputStream = httpURLConnection.getInputStream();
//
//        //定义字节数组
//        byte[] b = new byte[1024];
//
//        //定义一个输出流存储接收到的数据
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//
//        //开始接收数据
//        int len = 0;
//        while (true) {
//            len = inputStream.read(b);
//            if (len == -1) {
//                //数据读完
//                break;
//            }
//            byteArrayOutputStream.write(b, 0, len);
//        }
//
//        //从输出流中获取读取到数据(服务端返回的)
//        String response = byteArrayOutputStream.toString();
//        System.out.println(response);
//    }
}
