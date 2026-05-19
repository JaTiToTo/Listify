package com.jatitoto.listify_backend.controller;

import com.jatitoto.listify.api.GreetingApi;
import com.jatitoto.listify.model.GreetingResponse;
import com.jatitoto.listify_backend.service.GreetingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController implements GreetingApi {

    private final GreetingService greetingService;

    public GreetingController(GreetingService greetingService) {
        this.greetingService = greetingService;
    }

    @Override
    public ResponseEntity<GreetingResponse> hello(String name) {
        return ResponseEntity.ok(greetingService.buildGreeting(name));
    }
}