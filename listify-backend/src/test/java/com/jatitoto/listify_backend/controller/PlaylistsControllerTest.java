package com.jatitoto.listify_backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import com.jatitoto.listify.model.CreatePlaylistRequest;
import com.jatitoto.listify.model.PlaylistResponse;
import com.jatitoto.listify_backend.service.PlaylistService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class PlaylistsControllerTest {

    @Mock
    private PlaylistService playlistService;

    @InjectMocks
    private PlaylistsController playlistsController;

    @Nested
    class CreatePlaylist {

        @Test
        void delegatesToService() {
            CreatePlaylistRequest request = new CreatePlaylistRequest();
            PlaylistResponse playlistResponse = new PlaylistResponse();
            playlistResponse.setPlaylistId("playlist-123");
            ResponseEntity<PlaylistResponse> expected = ResponseEntity.status(HttpStatus.CREATED).body(playlistResponse);

            doReturn(expected).when(playlistService).createPlaylist(request);

            ResponseEntity<PlaylistResponse> response = playlistsController.createPlaylist(request);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
            assertThat(response.getBody()).isSameAs(playlistResponse);
            verify(playlistService).createPlaylist(request);
        }
    }
}