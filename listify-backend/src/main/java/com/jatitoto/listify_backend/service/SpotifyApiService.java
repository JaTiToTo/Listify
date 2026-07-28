package com.jatitoto.listify_backend.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jatitoto.listify.model.SongItem;

@Service
public class SpotifyApiService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyApiService.class);
    private static final String SPOTIFY_RECOMMENDATIONS_URL = "https://api.spotify.com/v1/recommendations";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Value("${SPOTIFY_RECOMMENDATION_SEED_GENRES:pop}")
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

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(requestUrl))
                .header("Authorization", "Bearer " + accessToken)
                .GET()
                .build();

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

        StringBuilder urlBuilder = new StringBuilder(SPOTIFY_RECOMMENDATIONS_URL);
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

    private List<SongItem> mapTracksToSongItems(JsonNode tracks) {
        List<SongItem> songs = new ArrayList<>();
        if (!tracks.isArray()) {
            return songs;
        }

        for (JsonNode track : tracks) {
            SongItem songItem = new SongItem();
            songItem.setTitle(track.path("name").asText(""));
            songItem.setArtist(extractArtists(track.path("artists")));
            songItem.setLength(formatTrackLength(track.path("duration_ms").asLong(0L)));
            songItem.setSongId(track.path("id").asText(""));

            String iconUrl = track.path("album").path("images").path(0).path("url").asText("");
            if (iconUrl.isBlank()) {
                iconUrl = "https://open.spotify.com";
            }
            songItem.setSongIcon(URI.create(iconUrl));

            String previewUrl = track.path("preview_url").asText("");
            if (!previewUrl.isBlank()) {
                songItem.setPreviewUrl(URI.create(previewUrl));
            }

            songs.add(songItem);
        }

        return songs;
    }

    private String extractArtists(JsonNode artistsNode) {
        if (!artistsNode.isArray()) {
            return "";
        }

        List<String> artistNames = new ArrayList<>();
        for (JsonNode artistNode : artistsNode) {
            String name = artistNode.path("name").asText("");
            if (!name.isBlank()) {
                artistNames.add(name);
            }
        }

        return String.join(", ", artistNames);
    }

    private String formatTrackLength(long durationMs) {
        long totalSeconds = durationMs / 1000;
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;
        return String.format("%02d:%02d", minutes, seconds);
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}


