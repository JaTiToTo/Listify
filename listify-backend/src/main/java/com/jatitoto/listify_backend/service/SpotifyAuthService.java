package com.jatitoto.listify_backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class SpotifyAuthService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthService.class);
    private static final String SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
    private static final String SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
    private static final long TOKEN_REFRESH_LEEWAY_SECONDS = 60;
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${SPOTIFY_CLIENT_ID:}")
    private String clientId;
    @Value("${SPOTIFY_CLIENT_SECRET:}")
    private String clientSecret;
    @Value("${SPOTIFY_REDIRECT_URI:http://127.0.0.1:8081/api/auth/callback}")
    private String redirectUri;
    @Value("${SPOTIFY_FRONTEND_REDIRECT_URI:http://127.0.0.1:5173/callback}")
    private String frontendRedirectUri;
    @Value("${SPOTIFY_SCOPES:playlist-read-private playlist-modify-public playlist-modify-private user-read-email user-read-private}")
    private String scopes;

	private Map <String, String> stateToCodeVerifierMap = new ConcurrentHashMap<>();

    public void refreshSpotifyAccessTokenIfNeeded(HttpSession session) {
        if (session == null) {
            return;
        }

        String accessToken = (String) session.getAttribute("spotify_access_token");
        String refreshToken = (String) session.getAttribute("spotify_refresh_token");
        Long expiresAt = getTokenExpiresAt(session);

        if (accessToken == null || accessToken.isBlank() || refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        if (!isTokenExpired(expiresAt)) {
            return;
        }

        logger.info("Refreshing expired Spotify access token for session {}", session.getId());

        try {
            JsonNode tokenResponse = exchangeRefreshToken(refreshToken);
            if (tokenResponse == null || tokenResponse.has("error")) {
                logger.warn("Spotify token refresh failed for session {}", session.getId());
                clearSpotifyTokenSessionAttributes(session);
                return;
            }

            storeTokenResponse(session, tokenResponse, refreshToken);
            logger.info("Refreshed Spotify access token for session {}", session.getId());
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("Spotify token refresh was interrupted or failed for session {}", session.getId(), e);
            clearSpotifyTokenSessionAttributes(session);
        }
    }

    public ResponseEntity<String> initiateSpotifyLogin() {
        logger.info("Initiating Spotify login without creating a session");

        if (clientId.isBlank() || clientSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Spotify credentials are not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.");
        }

        String state = randomString(16);
        String codeVerifier = randomString(64);
        String codeChallenge = createCodeChallenge(codeVerifier);
		stateToCodeVerifierMap.put(state, codeVerifier);

        String authUrl = SPOTIFY_AUTH_URL
                + "?response_type=code"
                + "&client_id=" + encode(clientId)
                + "&scope=" + encode(scopes)
                + "&redirect_uri=" + encode(redirectUri)
                + "&state=" + encode(state)
                + "&code_challenge_method=S256"
                + "&code_challenge=" + encode(codeChallenge);

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .body(authUrl);
    }

    public ResponseEntity<Void> logout() {
        HttpSession session = UtilService.getCurrentSession();

        session.removeAttribute("spotify_state");
        session.removeAttribute("spotify_code_verifier");
        session.removeAttribute("spotify_access_token");
        session.removeAttribute("spotify_refresh_token");
        session.removeAttribute("spotify_token_expires_in");
        session.removeAttribute("spotify_token_expires_at");
        session.invalidate();

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> handleSpotifyCallback(String code, String state, String error) {
        try {
            if (error != null || code == null || state == null) {
                return redirectToFrontend("error=" + encode(error != null ? error : "invalid_request"));
            }

			String codeVerifier = stateToCodeVerifierMap.get(state);
            HttpSession session = UtilService.getCurrentSession(true);
            logger.info("Handling Spotify callback for session {}", session.getId());

            if (codeVerifier == null || codeVerifier.isBlank()) {
                return redirectToFrontend("error=no matching codeVerifier for state: " + state);
            }

            JsonNode tokenResponse = exchangeAuthorizationCode(code, codeVerifier);
            if (tokenResponse == null || tokenResponse.has("error")) {
                return redirectToFrontend("error=token_exchange_failed");
            }

            storeTokenResponse(session, tokenResponse, null);
            logger.info("Stored Spotify tokens in session {}", session.getId());

			stateToCodeVerifierMap.remove(state);

            return redirectToFrontend("authorized=true");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return redirectToFrontend("error=token_exchange_failed");
        } catch (IOException e) {
            return redirectToFrontend("error=token_exchange_failed");
        }
    }

    private JsonNode exchangeAuthorizationCode(String code, String codeVerifier) throws IOException, InterruptedException {
        String body = "grant_type=authorization_code"
                + "&code=" + encode(code)
                + "&redirect_uri=" + encode(redirectUri)
				+ "&client_id=" + encode(clientId)
                + "&code_verifier=" + encode(codeVerifier);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SPOTIFY_TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)))
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            return null;
        }

        return OBJECT_MAPPER.readTree(response.body());
    }

    private JsonNode exchangeRefreshToken(String refreshToken) throws IOException, InterruptedException {
        String body = "grant_type=refresh_token"
                + "&refresh_token=" + encode(refreshToken)
                + "&client_id=" + encode(clientId);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(SPOTIFY_TOKEN_URL))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .header("Authorization", "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8)))
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            return null;
        }

        return OBJECT_MAPPER.readTree(response.body());
    }

    private void storeTokenResponse(HttpSession session, JsonNode tokenResponse, String fallbackRefreshToken) {
        String accessToken = tokenResponse.path("access_token").asText("");
        String refreshToken = tokenResponse.path("refresh_token").asText(fallbackRefreshToken != null ? fallbackRefreshToken : "");
        long expiresInSeconds = tokenResponse.path("expires_in").asLong(3600L);
        long expiresAt = Instant.now().plusSeconds(expiresInSeconds).toEpochMilli();

        session.setAttribute("spotify_access_token", accessToken);
        session.setAttribute("spotify_refresh_token", refreshToken);
        session.setAttribute("spotify_token_expires_in", String.valueOf(expiresInSeconds));
        session.setAttribute("spotify_token_expires_at", expiresAt);
    }

    private void clearSpotifyTokenSessionAttributes(HttpSession session) {
        session.removeAttribute("spotify_access_token");
        session.removeAttribute("spotify_refresh_token");
        session.removeAttribute("spotify_token_expires_in");
        session.removeAttribute("spotify_token_expires_at");
    }

    private Long getTokenExpiresAt(HttpSession session) {
        Object expiresAtAttribute = session.getAttribute("spotify_token_expires_at");
        if (expiresAtAttribute instanceof Long expiresAt) {
            return expiresAt;
        }

        if (expiresAtAttribute instanceof String expiresAtString && !expiresAtString.isBlank()) {
            try {
                return Long.parseLong(expiresAtString);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        return null;
    }

    private boolean isTokenExpired(Long expiresAt) {
        if (expiresAt == null) {
            return true;
        }

        return Instant.now().toEpochMilli() >= (expiresAt - (TOKEN_REFRESH_LEEWAY_SECONDS * 1000L));
    }

    private ResponseEntity<Void> redirectToFrontend(String queryString) {
        String redirectUrl = frontendRedirectUri;
        if (queryString != null && !queryString.isBlank()) {
            redirectUrl = frontendRedirectUri + (frontendRedirectUri.contains("?") ? "&" : "?") + queryString;
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }



    private String createCodeChallenge(String codeVerifier) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(codeVerifier.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        } catch (Exception e) {
            throw new IllegalStateException("Unable to create PKCE challenge", e);
        }
    }

    private String randomString(int length) {
        byte[] bytes = new byte[length];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).substring(0, length);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
