package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import com.jatitoto.listify.model.SongSearchResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class MusicServiceTest {

    @Mock
    private TagBasedRecommendationService recommendationService;

    @Mock
    private HttpSession session;

    @InjectMocks
    private MusicService musicService;

    @Nested
    class GetRecommendedSongs {

        @Test
        void returnsUnauthorizedWhenAccessTokenMissing() {
            doReturn(null).when(session).getAttribute("spotify_access_token");

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<SongSearchResponse> response = musicService.getRecommendedSongs(20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
                verifyNoInteractions(recommendationService);
            }
        }

        @Test
        void returnsRecommendationsWhenServiceSucceeds() {
            SongSearchResponse body = new SongSearchResponse();
            doReturn("token").when(session).getAttribute("spotify_access_token");
            doReturn(body).when(recommendationService).buildRecommendations("token", 20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<SongSearchResponse> response = musicService.getRecommendedSongs(20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(response.getBody()).isSameAs(body);
                verify(recommendationService).buildRecommendations("token", 20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);
            }
        }

        @Test
        void returnsServerErrorWhenRecommendationServiceThrows() {
            doReturn("token").when(session).getAttribute("spotify_access_token");
            org.mockito.Mockito.doThrow(new RuntimeException("boom"))
                .when(recommendationService)
                .buildRecommendations("token", 20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

            try (var mockedUtilService = mockStatic(UtilService.class)) {
                mockedUtilService.when(UtilService::getCurrentSession).thenReturn(session);

                ResponseEntity<SongSearchResponse> response = musicService.getRecommendedSongs(20, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

                assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}