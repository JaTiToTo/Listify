package com.jatitoto.listify_backend.service;


import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;
import jakarta.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicService {
  private static final Logger logger = LoggerFactory.getLogger(MusicService.class);

  private final SpotifyApiService spotifyApiService;


  public ResponseEntity<SongSearchResponse> getRecommendedSongs(
      Integer limit,
      Float acousticness,
      Float danceability,
      Float energy,
      Float instrumentalness,
      Float loudness,
      Float tempo,
      Float valence) {
    HttpSession session = UtilService.getCurrentSession();

    String accessToken = (String) session.getAttribute("spotify_access_token");
    if (accessToken == null || accessToken.isBlank()) {
      logger.warn("No Spotify access token found in session {}", session.getId());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    List<SongItem> songs;
    try {
      songs = spotifyApiService.getRecommendations(
          accessToken,
          limit,
          acousticness,
          danceability,
          energy,
          instrumentalness,
          loudness,
          tempo,
          valence);
    } catch (RuntimeException ex) {
      logger.error("Failed to fetch Spotify recommendations", ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    SongSearchResponse response = new SongSearchResponse();
    response.setSongs(songs != null ? songs : new ArrayList<>());
    return ResponseEntity.ok(response);
  }

  public ResponseEntity<Resource> getTrackPreview(String trackId) {
    byte[] previewBytes = ("dummy preview for " + trackId).getBytes(StandardCharsets.UTF_8);
    ByteArrayResource resource = new ByteArrayResource(previewBytes);

    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType("audio/mpeg"))
        .body(resource);
  }
}
