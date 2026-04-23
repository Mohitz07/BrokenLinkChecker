package utils;

import io.restassured.RestAssured;
import io.restassured.response.Response;

public class LinkValidator {

    public static int getStatusCode(String url) {

        int timeout = Integer.parseInt(ConfigReader.get("link.timeout"));

        try {
            Response response = RestAssured
                    .given()
                    .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
                    .relaxedHTTPSValidation()
                    .config(RestAssured.config()
                            .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                                    .setParam("http.connection.timeout", timeout)
                                    .setParam("http.socket.timeout", timeout)))
                    .head(url);

            int statusCode = response.getStatusCode();

            // Fallback to GET if HEAD fails or blocked
            if (statusCode == 0) {
                response = RestAssured
                        .given()
                        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
                        .relaxedHTTPSValidation()
                        .get(url);

                statusCode = response.getStatusCode();
            }

            return statusCode;

        } catch (Exception e) {
            return 500;
        }
    }
}