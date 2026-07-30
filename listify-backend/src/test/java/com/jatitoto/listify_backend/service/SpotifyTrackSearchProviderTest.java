package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.verify;

import com.jatitoto.listify.model.SongItem;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SpotifyTrackSearchProviderTest {

    @Mock
    private SpotifyApiService spotifyApiService;

    @InjectMocks
    private SpotifyTrackSearchProvider provider;

    @Nested
    class SearchTracksByTag {

        @Test
        void buildsGenreQueryForMultiWordGenreTags() {
            doReturn(List.<SongItem>of()).when(spotifyApiService).searchTracks("token", "genre:\"indie pop\"", 0, 2);

            List<SongItem> items = provider.searchTracksByTag("token", "indie pop", 2, 0);

            assertThat(items).isEmpty();
            verify(spotifyApiService).searchTracks("token", "genre:\"indie pop\"", 0, 2);
        }

        @Test
        void sanitizesQuotesAndClampsPagination() {
            doReturn(List.<SongItem>of()).when(spotifyApiService).searchTracks("token", "raw tag", 0, 10);

            List<SongItem> items = provider.searchTracksByTag("token", " raw \"tag\" ", 25, -4);

            assertThat(items).isEmpty();
            verify(spotifyApiService).searchTracks("token", "raw tag", 0, 10);
        }

        @Test
        void returnsBlankQueryForBlankTag() {
            doReturn(List.<SongItem>of()).when(spotifyApiService).searchTracks("token", "", 3, 5);

            List<SongItem> items = provider.searchTracksByTag("token", "   ", 5, 3);

            assertThat(items).isEmpty();
            verify(spotifyApiService).searchTracks("token", "", 3, 5);
        }
    }
}