package com.jatitoto.listify_backend.service;

import static com.jatitoto.listify_backend.mapper.SpotifyApiResponseMapper.mapTracksToSongItems;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jatitoto.listify.model.SongItem;

@Service
public class SpotifyApiService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyApiService.class);
    private static final String SPOTIFY_API_BASE_URL = "https://api.spotify.com";
    private static final String SPOTIFY_RECOMMENDATIONS_PATH = "/v1/recommendations";
    private static final String SPOTIFY_SEARCH_PATH = "/v1/search";
    private static final String SPOTIFY_CREATE_PLAYLIST_PATH = "/v1/me/playlists";
    private static final String SPOTIFY_TRACK_URI_PREFIX = "spotify:track:";
    private static final String SPOTIFY_RECOMMENDATIONS_URL = SPOTIFY_API_BASE_URL + SPOTIFY_RECOMMENDATIONS_PATH;
    private static final String QUERY_PARAM_Q = "q";
    private static final String QUERY_PARAM_TYPE = "type";
    private static final String QUERY_PARAM_OFFSET = "offset";
    private static final String QUERY_PARAM_LIMIT = "limit";
    private static final String SEARCH_TYPE_TRACK = "track";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Value("pop")
    private String recommendationSeedGenres;

    public List<SongItem> getRecommendations(
            String accessToken,
            Integer limit,
            Float acousticness,
            Float danceability,
            Float energy,
            Float instrumentalness,
            Float loudness,
            Float tempo,
            Float valence) {
        String requestUrl = buildRecommendationsUrl(limit, acousticness, danceability, energy, instrumentalness, loudness, tempo,
                valence);

        logger.info("Fetching Spotify recommendations with access token: {}", accessToken);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();
        logger.info("Sending Spotify recommendations request to URL: {}", requestUrl);

        try {
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                logger.warn("Spotify recommendations request failed with status {} and body {}", response.statusCode(),
                        response.body());
                throw new IllegalStateException("Spotify recommendations request failed with status " + response.statusCode());
            }

            JsonNode jsonResponse = OBJECT_MAPPER.readTree(response.body());
            return mapTracksToSongItems(jsonResponse.path("tracks"));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Spotify recommendations request was interrupted", e);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to parse Spotify recommendations response", e);
        }
    }

    public List<SongItem> searchTracks(String accessToken, String query, Integer offset, Integer limit) {
        String requestUrl = buildSearchTracksUrl(query, offset, limit);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();
        logger.info("Sending Spotify search request to URL: {}", requestUrl);

        try {
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                logger.warn("Spotify search request failed with status {} and body {}", response.statusCode(),
                        response.body());
                throw new IllegalStateException("Spotify search request failed with status " + response.statusCode());
            }

            JsonNode jsonResponse = OBJECT_MAPPER.readTree(response.body());
            return mapTracksToSongItems(jsonResponse.path("tracks").path("items"));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Spotify search request was interrupted", e);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to parse Spotify search response", e);
        }
    }

    public String createPlaylist(String accessToken, String playlistName) throws JsonProcessingException {
        String requestUrl = SPOTIFY_API_BASE_URL + SPOTIFY_CREATE_PLAYLIST_PATH;

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("name", playlistName);
        requestBody.put("public", false);
        requestBody.put("description", "");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(OBJECT_MAPPER.writeValueAsString(requestBody)))
                .build();

        try {
            logger.info("Sending Spotify create playlist request to URL: {}", request.uri());
            logger.info("Request body: {}", OBJECT_MAPPER.writeValueAsString(requestBody));
            logger.info("Access token: {}", accessToken);
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                logger.warn("Spotify create playlist request failed with status {} and body {}", response.statusCode(),
                        response.body());
                throw new IllegalStateException("Spotify create playlist request failed with status " + response.statusCode());
            }

            JsonNode jsonResponse = OBJECT_MAPPER.readTree(response.body());
            String playlistId = jsonResponse.path("id").asText("");
            if (playlistId.isBlank()) {
                throw new IllegalStateException("Spotify create playlist response did not contain a playlist id");
            }
            logger.info("Successfully created Spotify playlist with id: {}", playlistId);
            return playlistId;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Spotify create playlist request was interrupted", e);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to parse Spotify create playlist response", e);
        }
    }

    public void addTracksToPlaylist(String accessToken, String playlistId, List<String> songIds) throws JsonProcessingException {
        if (songIds == null || songIds.isEmpty()) {
            return;
        }

        logger.info("songIds to add to playlist {}: {}", playlistId, songIds);

        List<String> trackUris = songIds.stream()
                .filter(songId -> songId != null && !songId.isBlank())
                .map(songId -> songId.startsWith(SPOTIFY_TRACK_URI_PREFIX) ? songId : SPOTIFY_TRACK_URI_PREFIX + songId)
                .collect(Collectors.toList());

                logger.info("Track URIs to add to playlist {}: {}", playlistId, trackUris);
        if (trackUris.isEmpty()) {
            return;
        }

        String requestUrl = SPOTIFY_API_BASE_URL + "/v1/playlists/" + encode(playlistId) + "/items";
        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("uris", trackUris);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(OBJECT_MAPPER.writeValueAsString(requestBody)))
                .build();

        try {
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                logger.warn("Spotify add tracks request failed with status {} and body {}", response.statusCode(),
                        response.body());
                throw new IllegalStateException("Spotify add tracks request failed with status " + response.statusCode());
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Spotify add tracks request was interrupted", e);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to parse Spotify add tracks response", e);
        }
    }

    private String buildRecommendationsUrl(
            Integer limit,
            Float acousticness,
            Float danceability,
            Float energy,
            Float instrumentalness,
            Float loudness,
            Float tempo,
            Float valence) {
        Map<String, String> queryParams = new LinkedHashMap<>();
        queryParams.put("seed_genres", recommendationSeedGenres);
        queryParams.put("limit", String.valueOf(limit));
        putIfNotNull(queryParams, "target_acousticness", acousticness);
        putIfNotNull(queryParams, "target_danceability", danceability);
        putIfNotNull(queryParams, "target_energy", energy);
        putIfNotNull(queryParams, "target_instrumentalness", instrumentalness);
        putIfNotNull(queryParams, "target_loudness", loudness);
        putIfNotNull(queryParams, "target_tempo", tempo);
        putIfNotNull(queryParams, "target_valence", valence);

        return buildUrl(SPOTIFY_RECOMMENDATIONS_URL, queryParams);
    }

    private String buildSearchTracksUrl(String query, Integer offset, Integer limit) {
        Map<String, String> queryParams = new LinkedHashMap<>();
        queryParams.put(QUERY_PARAM_Q, query);
        queryParams.put(QUERY_PARAM_TYPE, SEARCH_TYPE_TRACK);
        queryParams.put(QUERY_PARAM_OFFSET, String.valueOf(offset));
        queryParams.put(QUERY_PARAM_LIMIT, String.valueOf(limit));

        String baseUrl = SPOTIFY_API_BASE_URL + SPOTIFY_SEARCH_PATH;
        return buildUrl(baseUrl, queryParams);
    }

    private String buildUrl(String baseUrl, Map<String, String> queryParams) {
        StringBuilder urlBuilder = new StringBuilder(baseUrl);
        urlBuilder.append("?");

        boolean isFirst = true;
        for (Map.Entry<String, String> queryParam : queryParams.entrySet()) {
            if (!isFirst) {
                urlBuilder.append("&");
            }
            urlBuilder.append(encode(queryParam.getKey()))
                    .append("=")
                    .append(encode(queryParam.getValue()));
            isFirst = false;
        }

        return urlBuilder.toString();
    }

    private void putIfNotNull(Map<String, String> queryParams, String key, Float value) {
        if (value != null) {
            queryParams.put(key, value.toString());
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}


