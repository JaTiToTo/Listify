package com.jatitoto.listify_backend.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MockResultController {

    @GetMapping(value = "/api/mock-result", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> mockResult() throws IOException {
        Path mockResultPath = Path.of("src/main/java/com/jatitoto/structure/mockResult.json");
        String body = Files.readString(mockResultPath, StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }
}
