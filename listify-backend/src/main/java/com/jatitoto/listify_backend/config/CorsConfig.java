package com.jatitoto.listify_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${CORS_CONFIG_ORIGINS:}")
    private String originString;

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        var origins = parseArray(originString);
        for(String s : origins) {
            System.out.println("CORS ORIGIN ARRAY: " + s);
        }
        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }

    private String[] parseArray(String input) {
        System.out.println("CORS INPUT: " + input);
        var split = input.split(",");
        return split;
    }
}
