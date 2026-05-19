package com.jatitoto.listify_backend.service;

import org.springframework.stereotype.Service;

import com.jatitoto.listify.model.GreetingResponse;

@Service
public class GreetingService {

    public GreetingResponse buildGreeting(String name) {
        GreetingResponse response = new GreetingResponse();
        response.setMessage("Hello, " + name + "!");
        return response;
    }
}