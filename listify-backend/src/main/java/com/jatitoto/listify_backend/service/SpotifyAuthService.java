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
import java.util.Base64;
import java.util.Objects;

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

@Service
public class SpotifyAuthService {
    private static final String SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
    private static final String SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${SPOTIFY_CLIENT_ID:}")
    private String clientId;

    @Value("${SPOTIFY_CLIENT_SECRET:}")
    private String clientSecret;

    @Value("${SPOTIFY_REDIRECT_URI:http://localhost:8081/auth/callback}")
    private String redirectUri;

    @Value("${SPOTIFY_FRONTEND_REDIRECT_URI:http://localhost:5173/callback}")
    private String frontendRedirectUri;

    @Value("${SPOTIFY_SCOPES:playlist-read-private playlist-modify-public playlist-modify-private user-read-email user-read-private}")
    private String scopes;

    public ResponseEntity<String> initiateSpotifyLogin() {
        HttpSession session = getCurrentSession();

        if (clientId.isBlank() || clientSecret.isBlank()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("Spotify credentials are not configured. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.");
        }

        String state = randomString(16);
        String codeVerifier = randomString(64);
        String codeChallenge = createCodeChallenge(codeVerifier);

        session.setAttribute("spotify_state", state);
        session.setAttribute("spotify_code_verifier", codeVerifier);

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

    public ResponseEntity<Void> handleSpotifyCallback(String code, String state, String error) {
        try {
            HttpSession session = getCurrentSession();
            String expectedState = (String) session.getAttribute("spotify_state");

            if (error != null || code == null || state == null || !Objects.equals(expectedState, state)) {
                return redirectToFrontend("error=" + encode(error != null ? error : "invalid_request"));
            }

            String codeVerifier = (String) session.getAttribute("spotify_code_verifier");
            if (codeVerifier == null || codeVerifier.isBlank()) {
                return redirectToFrontend("error=missing_code_verifier");
            }

            JsonNode tokenResponse = exchangeAuthorizationCode(code, codeVerifier);
            if (tokenResponse == null || tokenResponse.has("error")) {
                return redirectToFrontend("error=token_exchange_failed");
            }

            String accessToken = tokenResponse.path("access_token").asText("");
            String refreshToken = tokenResponse.path("refresh_token").asText("");
            String expiresIn = tokenResponse.path("expires_in").asText("");

            session.setAttribute("spotify_access_token", accessToken);
            session.setAttribute("spotify_refresh_token", refreshToken);
            session.setAttribute("spotify_token_expires_in", expiresIn);

            return redirectToFrontend("authorized=true");
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            return redirectToFrontend("error=token_exchange_failed");
        }
    }

    private JsonNode exchangeAuthorizationCode(String code, String codeVerifier) throws IOException, InterruptedException {
        String body = "grant_type=authorization_code"
                + "&code=" + encode(code)
                + "&redirect_uri=" + encode(redirectUri)
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

    private ResponseEntity<Void> redirectToFrontend(String queryString) {
        String redirectUrl = frontendRedirectUri;
        if (queryString != null && !queryString.isBlank()) {
            redirectUrl = frontendRedirectUri + (frontendRedirectUri.contains("?") ? "&" : "?") + queryString;
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }

    private HttpSession getCurrentSession() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new IllegalStateException("No request context available");
        }

        HttpServletRequest request = attributes.getRequest();
        return request.getSession(true);
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
