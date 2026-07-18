package com.jatitoto.listify_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.jatitoto.listify.api.AuthApi;
import com.jatitoto.listify_backend.service.SpotifyAuthService;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class AuthController implements AuthApi {
    private final SpotifyAuthService spotifyAuthService;

    public AuthController(SpotifyAuthService spotifyAuthService) {
        this.spotifyAuthService = spotifyAuthService;
    }

    @Override
    public ResponseEntity<String> initiateSpotifyLogin() {
        return spotifyAuthService.initiateSpotifyLogin();
    }

    @Override
    public ResponseEntity<Void> spotifyCallback(String code, String state, String error) {
        return spotifyAuthService.handleSpotifyCallback(code, state, error);
    }
}
