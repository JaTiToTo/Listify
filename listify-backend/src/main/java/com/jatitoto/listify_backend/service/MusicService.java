package com.jatitoto.listify_backend.service;


import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
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
  private static final int DEFAULT_LIMIT = 20;
  private static final int SEARCH_RESULT_LIMIT = 1;
  private static final int MAX_RANDOM_OFFSET = 1000;
  private static final int MAX_ATTEMPT_MULTIPLIER = 10;
  private static final int ALPHABET_SIZE = 26;

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
    logger.info("Fetching recommended songs for session {}", session.getId());

    String accessToken = (String) session.getAttribute("spotify_access_token");
    if (accessToken == null || accessToken.isBlank()) {
      logger.warn("No Spotify access token found in session {}", session.getId());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    List<SongItem> songs;
    try {

      //songs = spotifyApiService.getRecommendations(
      songs = getRandomSongs(
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
    response.setItems(songs != null ? songs : new ArrayList<>());
    return ResponseEntity.ok(response);
  }

  private List<SongItem> getRandomSongs(
            String accessToken,
            Integer limit,
            Float acousticness,
            Float danceability,
            Float energy,
            Float instrumentalness,
            Float loudness,
            Float tempo,
            Float valence
  ) {
    List<SongItem> songs = new ArrayList<>();
    Set<String> seenSongIds = new HashSet<>();

    int requestedLimit = (limit == null || limit <= 0) ? DEFAULT_LIMIT : limit;
    int maxAttempts = requestedLimit * MAX_ATTEMPT_MULTIPLIER;
    int attempts = 0;

    while (songs.size() < requestedLimit && attempts < maxAttempts) {
      attempts++;

      String randomLetter = getRandomLowercaseLetter();
      int randomOffset = ThreadLocalRandom.current().nextInt(MAX_RANDOM_OFFSET + 1);

      List<SongItem> fetchedSongs = spotifyApiService.searchTracks(
          accessToken,
          randomLetter,
          randomOffset,
          SEARCH_RESULT_LIMIT);

      if (fetchedSongs.isEmpty()) {
        continue;
      }

      SongItem song = fetchedSongs.get(0);
      if (song.getId() == null || song.getId().isBlank()) {
        continue;
      }

      if (seenSongIds.add(song.getId())) {
        songs.add(song);
      }
    }

    if (songs.size() < requestedLimit) {
      logger.info(
          "Collected {} random songs out of requested {} after {} attempts",
          songs.size(),
          requestedLimit,
          attempts);
    }

    return songs;
  }

  private String getRandomLowercaseLetter() {
    int letterIndex = ThreadLocalRandom.current().nextInt(ALPHABET_SIZE);
    char randomLetter = (char) ('a' + letterIndex);
    return String.valueOf(randomLetter);
  }
}
