package com.jatitoto.listify_backend;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class BackendStartupLogger implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger logger = LoggerFactory.getLogger(BackendStartupLogger.class);

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Environment environment = event.getApplicationContext().getEnvironment();
        String host = resolveHost(environment);
        int port = environment.getProperty("server.port", Integer.class, 8080);
        String contextPath = environment.getProperty("server.servlet.context-path", "");

        logger.info("Backend server available at {}", buildServerUrl(host, port, contextPath));
    }

    String buildServerUrl(String host, int port, String contextPath) {
        String normalizedContextPath = contextPath == null ? "" : contextPath;
        if (normalizedContextPath.isBlank()) {
            return String.format("http://%s:%d", host, port);
        }

        return String.format("http://%s:%d%s", host, port, normalizedContextPath.startsWith("/") ? normalizedContextPath : "/" + normalizedContextPath);
    }

    private String resolveHost(Environment environment) {
        String configuredHost = environment.getProperty("server.address");
        if (configuredHost != null && !configuredHost.isBlank()) {
            return configuredHost;
        }

        try {
            return InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException ex) {
            return "localhost";
        }
    }
}
