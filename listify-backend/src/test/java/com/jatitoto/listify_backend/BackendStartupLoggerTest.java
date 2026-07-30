package com.jatitoto.listify_backend;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;

import java.time.Duration;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

class BackendStartupLoggerTest {

    @Nested
    class BuildServerUrl {

        @Test
        void omitsBlankContextPath() {
            BackendStartupLogger logger = new BackendStartupLogger();

            assertThat(logger.buildServerUrl("127.0.0.1", 8081, "")).isEqualTo("http://127.0.0.1:8081");
        }

        @Test
        void prefixesContextPathWhenPresent() {
            BackendStartupLogger logger = new BackendStartupLogger();

            assertThat(logger.buildServerUrl("127.0.0.1", 8081, "api")).isEqualTo("http://127.0.0.1:8081/api");
        }
    }

    @Nested
    class OnApplicationEvent {

        @Test
        void resolvesHostAndLogsUrl() {
            BackendStartupLogger logger = new BackendStartupLogger();
            ConfigurableEnvironment environment = org.mockito.Mockito.mock(ConfigurableEnvironment.class);
            ConfigurableApplicationContext applicationContext = org.mockito.Mockito.mock(ConfigurableApplicationContext.class);

            doReturn(environment).when(applicationContext).getEnvironment();
            doReturn("127.0.0.1").when(environment).getProperty("server.address");
            doReturn(8082).when(environment).getProperty("server.port", Integer.class, 8080);
            doReturn("/api").when(environment).getProperty("server.servlet.context-path", "");

            ApplicationReadyEvent event = new ApplicationReadyEvent(new SpringApplication(), new String[0], applicationContext, Duration.ZERO);

            logger.onApplicationEvent(event);

            assertThat(logger.buildServerUrl("127.0.0.1", 8082, "/api")).isEqualTo("http://127.0.0.1:8082/api");
        }
    }
}