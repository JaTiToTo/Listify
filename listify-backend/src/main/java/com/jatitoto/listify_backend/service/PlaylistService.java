package com.jatitoto.listify_backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jatitoto.listify.model.CreatePlaylistRequest;
import com.jatitoto.listify.model.PlaylistResponse;

@Service
@RequiredArgsConstructor
public class PlaylistService {
    private static final Logger logger = LoggerFactory.getLogger(PlaylistService.class);

    private final SpotifyApiService spotifyApiService;

    public ResponseEntity<PlaylistResponse> createPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        HttpSession session = UtilService.getCurrentSession();
        logger.info("Creating Spotify playlist for session {}", session.getId());

        String accessToken = (String) session.getAttribute("spotify_access_token");
        if (accessToken == null || accessToken.isBlank()) {
            logger.warn("No Spotify access token found in session {}", session.getId());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (createPlaylistRequest == null || createPlaylistRequest.getSongIds() == null
                || createPlaylistRequest.getSongIds().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String playlistId;
        try {
            playlistId = spotifyApiService.createPlaylist(accessToken, createPlaylistRequest.getPlaylistName());
            spotifyApiService.addTracksToPlaylist(accessToken, playlistId, createPlaylistRequest.getSongIds());
        } catch (RuntimeException ex) {
            logger.error("Failed to create Spotify playlist", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (JsonProcessingException ex) {
            logger.error("Failed to process JSON while creating Spotify playlist", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }


        PlaylistResponse response = new PlaylistResponse();
        response.setPlaylistId(playlistId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
