package com.jatitoto.listify_backend.controller;

import java.util.Objects;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.jatitoto.listify.api.AuthApi;

@RestController
public class AuthController implements AuthApi {
	@Override
	public ResponseEntity<String> initiateSpotifyLogin() {
	return ResponseEntity.ok()
		.contentType(Objects.requireNonNull(MediaType.TEXT_PLAIN))
		.body("https://spotify.com");
	}
}
