package com.jatitoto.listify_backend.service;

import com.jatitoto.listify.model.SongSearchResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicService {

  private static final Logger logger = LoggerFactory.getLogger(MusicService.class);

  private final TagBasedRecommendationService recommendationService;

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

    try {
      SongSearchResponse response = recommendationService.buildRecommendations(
          accessToken,
          limit,
          acousticness,
          danceability,
          energy,
          instrumentalness,
          loudness,
          tempo,
          valence);
      return ResponseEntity.ok(response);
    } catch (RuntimeException ex) {
      logger.error("Failed to build tag-based recommendations", ex);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
