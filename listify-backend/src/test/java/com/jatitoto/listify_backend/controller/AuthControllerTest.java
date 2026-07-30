package com.jatitoto.listify_backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import com.jatitoto.listify_backend.service.SpotifyAuthService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private SpotifyAuthService spotifyAuthService;

    @InjectMocks
    private AuthController authController;

    @Nested
    class InitiateSpotifyLogin {

        @Test
        void delegatesToService() {
            ResponseEntity<String> expected = ResponseEntity.ok("login-url");

            doReturn(expected).when(spotifyAuthService).initiateSpotifyLogin();

            ResponseEntity<String> response = authController.initiateSpotifyLogin();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isEqualTo("login-url");
            verify(spotifyAuthService).initiateSpotifyLogin();
        }
    }

    @Nested
    class SpotifyCallback {

        @Test
        void delegatesToService() {
            ResponseEntity<Void> expected = ResponseEntity.ok().build();

            doReturn(expected).when(spotifyAuthService).handleSpotifyCallback("code", "state", "error");

            ResponseEntity<Void> response = authController.spotifyCallback("code", "state", "error");

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            verify(spotifyAuthService).handleSpotifyCallback("code", "state", "error");
        }
    }

    @Nested
    class Logout {

        @Test
        void delegatesToService() {
            ResponseEntity<Void> expected = ResponseEntity.noContent().build();

            doReturn(expected).when(spotifyAuthService).logout();

            ResponseEntity<Void> response = authController.logout();

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            verify(spotifyAuthService).logout();
        }
    }
}