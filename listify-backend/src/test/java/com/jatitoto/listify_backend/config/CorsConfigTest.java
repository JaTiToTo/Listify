package com.jatitoto.listify_backend.config;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

class CorsConfigTest {

    @Nested
    class AddCorsMappings {

        @Test
        void configuresAllowedOrigins() {
            CorsConfig corsConfig = new CorsConfig();
            ReflectionTestUtils.setField(corsConfig, "originString", "http://localhost:5173,https://example.com");

            CorsRegistry registry = mock(CorsRegistry.class);
            CorsRegistration registration = mock(CorsRegistration.class);

            doReturn(registration).when(registry).addMapping("/**");
            doReturn(registration).when(registration).allowedOrigins("http://localhost:5173", "https://example.com");
            doReturn(registration).when(registration).allowCredentials(true);
            doReturn(registration).when(registration).allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            doReturn(registration).when(registration).allowedHeaders("*");

            corsConfig.addCorsMappings(registry);

            verify(registry).addMapping("/**");
            verify(registration).allowedOrigins("http://localhost:5173", "https://example.com");
        }

        @Test
        void failsWhenOriginsAreMissing() {
            CorsConfig corsConfig = new CorsConfig();
            ReflectionTestUtils.setField(corsConfig, "originString", null);

            CorsRegistry registry = mock(CorsRegistry.class);

            assertThatThrownBy(() -> corsConfig.addCorsMappings(registry))
                .isInstanceOf(NullPointerException.class);
        }
    }
}