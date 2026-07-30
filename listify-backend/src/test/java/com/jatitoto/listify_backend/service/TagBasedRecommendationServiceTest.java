package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import com.jatitoto.listify.model.ExternalIdsItem;
import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;
import com.jatitoto.listify_backend.mapper.SliderTagMapper.SliderAxis;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Random;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class TagBasedRecommendationServiceTest {

    @Mock
    private TrackSearchProvider trackSearchProvider;

    @InjectMocks
    private TagBasedRecommendationService recommendationService;

    @Nested
    class BuildRecommendations {

        @Test
        void clampsLimitAndReturnsSelectedTags() {
            SongItem first = song("Song A", "id-a", "isrc-a");
            SongItem duplicateByName = song("Song A", "id-b", "isrc-b");
            SongItem second = song("Song B", "id-c", "isrc-c");

            try (var mockedMapper = mockStatic(com.jatitoto.listify_backend.mapper.SliderTagMapper.class)) {
                mockedMapper.when(() -> com.jatitoto.listify_backend.mapper.SliderTagMapper.selectSearchTags(org.mockito.ArgumentMatchers.anyMap(), org.mockito.ArgumentMatchers.any(Random.class)))
                    .thenReturn(List.of("indie pop", "dream pop"));

                doReturn(List.of(first, duplicateByName, second))
                    .when(trackSearchProvider)
                    .searchTracksByTag("token", "indie pop", 10, 0);
                doReturn(List.of())
                    .when(trackSearchProvider)
                    .searchTracksByTag("token", "dream pop", 10, 0);

                SongSearchResponse response = recommendationService.buildRecommendations("token", 500, 0.1f, 0.2f, 0.3f, 0.4f, 0.5f, 120f, 0.6f);

                assertThat(response.getSelectedTags()).containsExactly("indie pop", "dream pop");
                assertThat(response.getItems()).hasSize(2);
                verify(trackSearchProvider).searchTracksByTag("token", "indie pop", 10, 0);
            }
        }
    }

    @Nested
    class CollectCandidateTracks {

        @Test
        void returnsEmptyListWhenNoTagsSelected() {
            List<SongItem> items = recommendationService.collectCandidateTracks("token", List.of(), 20);

            assertThat(items).isEmpty();
            verifyNoInteractions(trackSearchProvider);
        }

        @Test
        void gathersTracksAcrossPages() {
            SongItem song = song("Song A", "id-a", "isrc-a");
            doReturn(List.of(song)).when(trackSearchProvider).searchTracksByTag("token", "indie pop", 10, 0);
            doReturn(List.of()).when(trackSearchProvider).searchTracksByTag("token", "indie pop", 10, 10);

            List<SongItem> items = recommendationService.collectCandidateTracks("token", List.of("indie pop"), 15);

            assertThat(items).containsExactly(song);
            verify(trackSearchProvider).searchTracksByTag("token", "indie pop", 10, 0);
        }
    }

    @Nested
    class DeduplicateSongs {

        @Test
        void keepsUniqueTracksAndDropsDuplicatesByNameAndIsrc() {
            SongItem first = song("Song A", "id-a", "isrc-a");
            SongItem duplicateName = song("Song A", "id-b", "isrc-b");
            SongItem duplicateIsrc = song("Song B", "id-c", "isrc-a");
            SongItem unique = song("Song C", "id-d", "isrc-d");

            List<SongItem> items = recommendationService.deduplicateSongs(List.of(first, duplicateName, duplicateIsrc, unique));

            assertThat(items).containsExactly(first, unique);
        }

        @Test
        void ignoresTracksWithoutNameOrId() {
            SongItem blank = new SongItem();

            List<SongItem> items = recommendationService.deduplicateSongs(new ArrayList<>(Arrays.asList(blank, null)));

            assertThat(items).isEmpty();
        }
    }

    private static SongItem song(String name, String id, String isrc) {
        SongItem item = new SongItem();
        item.setName(name);
        item.setId(id);
        ExternalIdsItem externalIds = new ExternalIdsItem();
        externalIds.setIsrc(isrc);
        item.setExternalIds(externalIds);
        return item;
    }
}