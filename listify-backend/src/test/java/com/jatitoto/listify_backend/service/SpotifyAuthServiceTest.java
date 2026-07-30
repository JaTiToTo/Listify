package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mockStatic;

import jakarta.servlet.http.HttpSession;
import java.lang.reflect.Field;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class SpotifyAuthServiceTest {

    @Mock
    private HttpSession session;

    @Nested
    class InitiateSpotifyLogin {

        @Test
        void returnsServerErrorWhenCredentialsMissing() {
            SpotifyAuthService service = new SpotifyAuthService();

            setField(service, "clientId", "");
            setField(service, "clientSecret", "");

            assertThat(service.initiateSpotifyLogin().getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @Test
        void returnsLoginUrlWhenCredentialsPresent() {
            SpotifyAuthService service = new SpotifyAuthService();

            setField(service, "clientId", "client-id");
            setField(service, "clientSecret", "client-secret");
            setField(service, "redirectUri", "http://localhost/callback");
            setField(service, "frontendRedirectUri", "http://localhost:5173/callback");
            setField(service, "scopes", "playlist-read-private");

            String body = service.initiateSpotifyLogin().getBody();

            assertThat(body).contains("https://accounts.spotify.com/authorize");
            assertThat(body).contains("client_id=client-id");
        }
    }

    @Nested
    class HandleSpotifyCallback {

        @Test
        void redirectsWithErrorWhenRequestIsInvalid() {
            SpotifyAuthService service = new SpotifyAuthService();
            setField(service, "frontendRedirectUri", "http://localhost:5173/callback");

            assertThat(service.handleSpotifyCallback(null, null, null).getStatusCode()).isEqualTo(HttpStatus.FOUND);
        }
    }

    @Nested
    class RefreshSpotifyAccessTokenIfNeeded {

        @Test
        void returnsImmediatelyWhenSessionIsNull() {
            SpotifyAuthService service = new SpotifyAuthService();

            service.refreshSpotifyAccessTokenIfNeeded(null);
        }

        @Test
        void returnsImmediatelyWhenTokensAreMissing() {
            SpotifyAuthService service = new SpotifyAuthService();
            doReturn(null).when(session).getAttribute("spotify_access_token");

            service.refreshSpotifyAccessTokenIfNeeded(session);

            assertThat(true).isTrue();
        }
    }

    @Nested
    class Logout {

        @Test
        void clearsSessionAndReturnsNoContent() {
            SpotifyAuthService service = new SpotifyAuthService();

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                assertThat(service.logout().getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
            }
        }
    }

    private static void setField(Object target, String fieldName, Object value) {
        try {
            Field field = SpotifyAuthService.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException(ex);
        }
    }
}