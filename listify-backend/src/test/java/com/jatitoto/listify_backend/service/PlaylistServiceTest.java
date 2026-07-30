package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jatitoto.listify.model.CreatePlaylistRequest;
import com.jatitoto.listify.model.PlaylistResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class PlaylistServiceTest {

    @Mock
    private SpotifyApiService spotifyApiService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private PlaylistService playlistService;

    @Nested
    class CreatePlaylist {

        @Test
        void returnsUnauthorizedWhenAccessTokenMissing() {
            CreatePlaylistRequest request = new CreatePlaylistRequest();
            request.setSongIds(List.of("track-1"));

            doReturn(null).when(session).getAttribute("spotify_access_token");

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<PlaylistResponse> response = playlistService.createPlaylist(request);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                verifyNoInteractions(spotifyApiService);
            }
        }

        @Test
        void returnsBadRequestWhenSongIdsMissing() {
            CreatePlaylistRequest request = new CreatePlaylistRequest();

            doReturn("token").when(session).getAttribute("spotify_access_token");

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<PlaylistResponse> response = playlistService.createPlaylist(request);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
                verifyNoInteractions(spotifyApiService);
            }
        }

        @Test
        void createsPlaylistAndAddsTracks() throws JsonProcessingException {
            CreatePlaylistRequest request = new CreatePlaylistRequest();
            request.setPlaylistName(" Road Trip ");
            request.setSongIds(List.of("track-1", "spotify:track:track-2"));

            doReturn("token").when(session).getAttribute("spotify_access_token");
            doReturn("playlist-123").when(spotifyApiService).createPlaylist("token", " Road Trip ");

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<PlaylistResponse> response = playlistService.createPlaylist(request);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
                assertThat(response.getBody()).isNotNull();
                assertThat(response.getBody().getPlaylistId()).isEqualTo("playlist-123");
                verify(spotifyApiService).createPlaylist("token", " Road Trip ");
                verify(spotifyApiService).addTracksToPlaylist("token", "playlist-123", request.getSongIds());
            }
        }
    }
}