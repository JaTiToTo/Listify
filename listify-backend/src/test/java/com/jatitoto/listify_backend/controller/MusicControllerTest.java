package com.jatitoto.listify_backend.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import com.jatitoto.listify.model.SongSearchResponse;
import com.jatitoto.listify_backend.service.MusicService;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class MusicControllerTest {

    @Mock
    private MusicService musicService;

    @InjectMocks
    private MusicController musicController;

    @Nested
    class GetRecommendedSongs {

        @Test
        void delegatesToService() {
            SongSearchResponse expectedBody = new SongSearchResponse();
            ResponseEntity<SongSearchResponse> expected = ResponseEntity.ok(expectedBody);

            doReturn(expected).when(musicService).getRecommendedSongs(20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

            ResponseEntity<SongSearchResponse> response = musicController.getRecommendedSongs(
                20,
                0.1f,
                0.2f,
                0.3f,
                0.4f,
                0.5f,
                120f,
                0.6f);

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isSameAs(expectedBody);
            verify(musicService).getRecommendedSongs(20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);
        }
    }
}