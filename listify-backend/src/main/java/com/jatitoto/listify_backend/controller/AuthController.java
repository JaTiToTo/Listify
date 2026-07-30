package com.jatitoto.listify_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jatitoto.listify.api.AuthApi;
import com.jatitoto.listify_backend.service.SpotifyAuthService;
import com.jatitoto.listify_backend.service.UtilService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {
    private final SpotifyAuthService spotifyAuthService;

    @GetMapping("/api/auth/session")
    public ResponseEntity<Void> hasActiveSession() {
        return UtilService.getCurrentSession(false) != null
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(401).build();
    }

    @Override
    public ResponseEntity<String> initiateSpotifyLogin() {
        return spotifyAuthService.initiateSpotifyLogin();
    }

    @Override
    public ResponseEntity<Void> spotifyCallback(String code, String state, String error) {
        return spotifyAuthService.handleSpotifyCallback(code, state, error);
    }

    @Override
    public ResponseEntity<Void> logout() {
        return spotifyAuthService.logout();
    }
}
