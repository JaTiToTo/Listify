package com.jatitoto.listify_backend.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

class MockResultControllerTest {

    @Test
    void readsMockResultFile() throws Exception {
        MockResultController controller = new MockResultController();

        assertThat(Files.exists(Path.of("src/main/java/com/jatitoto/structure/mockResult.json"))).isTrue();

        var response = controller.mockResult();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getHeaders().getContentType().toString()).isEqualTo("application/json");
        assertThat(response.getBody()).isEqualTo(Files.readString(Path.of("src/main/java/com/jatitoto/structure/mockResult.json"), StandardCharsets.UTF_8));
    }
}