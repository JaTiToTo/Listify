package com.jatitoto.listify_backend.service;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;


import com.jatitoto.listify.model.AlbumItem;
import com.jatitoto.listify.model.ArtistItem;
import com.jatitoto.listify.model.ExternalIdsItem;
import com.jatitoto.listify.model.ExternalUrlsItem;
import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;
import com.jatitoto.listify_backend.mapper.SliderTagMapper;
import com.jatitoto.listify_backend.mapper.SliderTagMapper.BucketWeight;
import com.jatitoto.listify_backend.mapper.SliderTagMapper.SliderAxis;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;


import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@SpringBootTest
class TagBasedRecommendationServiceTest {


    @Autowired
    private TagBasedRecommendationService recommendationService;


    @MockBean
    private TrackSearchProvider trackSearchProvider;


    @Test
    void interpolatesBucketsAtEdgesAndCenters() {
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.ENERGY, 0d));
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.ENERGY, 50d));
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.ENERGY, 100d));
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.TEMPO, 80d));
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.TEMPO, 130d));
        assertWeightsSumToOne(SliderTagMapper.interpolateBuckets(SliderAxis.TEMPO, 180d));


        List<BucketWeight> valleyWeights = SliderTagMapper.interpolateBuckets(SliderAxis.ENERGY, 50d);
        assertEquals(1, valleyWeights.size());
        assertEquals(50d, valleyWeights.get(0).bucket().center());
        assertEquals(1d, valleyWeights.get(0).weight(), 1e-9);
    }


    @Test
    void selectsDifferentSearchTagsForDifferentRandomDraws() {
        var axisValues = java.util.Map.of(
            SliderAxis.ENERGY, 0.65f,
            SliderAxis.VALENCE, 0.45f,
            SliderAxis.ACOUSTICNESS, 0.25f,
            SliderAxis.INSTRUMENTALNESS, 0.20f,
            SliderAxis.TEMPO, 124f
        );


        List<String> firstSelection = SliderTagMapper.selectSearchTags(axisValues, new Random(1));
        List<String> secondSelection = SliderTagMapper.selectSearchTags(axisValues, new Random(2));


        assertFalse(firstSelection.isEmpty());
        assertFalse(secondSelection.isEmpty());
        assertTrue(firstSelection.size() >= 2 && firstSelection.size() <= 3);
        assertTrue(secondSelection.size() >= 2 && secondSelection.size() <= 3);
        assertEquals(firstSelection.size(), firstSelection.stream().distinct().count());
        assertEquals(secondSelection.size(), secondSelection.stream().distinct().count());
        assertFalse(firstSelection.equals(secondSelection));
    }


    @Test
    void selectedTagsIncludeAtLeastTwoGenreTagsFromAThematicCluster() {
        var axisValues = java.util.Map.of(
            SliderAxis.ENERGY, 0.90f,
            SliderAxis.VALENCE, 0.70f,
            SliderAxis.ACOUSTICNESS, 0.10f,
            SliderAxis.INSTRUMENTALNESS, 0.55f,
            SliderAxis.TEMPO, 126f
        );


        List<String> selection = SliderTagMapper.selectSearchTags(axisValues, new Random(7));


        long genreTagCount = selection.stream().filter(SliderTagMapper::isGenreTag).count();
        assertTrue(genreTagCount >= 2, "expected at least 2 genre tags from the primary cluster, got: " + selection);
    }


    @Test
    void sameSeedAndAxisValuesProduceDeterministicSelection() {
        var axisValues = java.util.Map.of(
            SliderAxis.ENERGY, 0.30f,
            SliderAxis.VALENCE, 0.20f,
            SliderAxis.ACOUSTICNESS, 0.75f,
            SliderAxis.INSTRUMENTALNESS, 0.15f,
            SliderAxis.TEMPO, 90f
        );


        List<String> first = SliderTagMapper.selectSearchTags(axisValues, new Random(42));
        List<String> second = SliderTagMapper.selectSearchTags(axisValues, new Random(42));


        assertEquals(first, second);
    }


    @Test
    void deduplicatesByIsrcBeforeIdAndKeepsUniqueTitles() {
        SongItem first = song("one", "Shared Title", "ISRC-1");
        SongItem duplicateByIsrc = song("two", "Shared Title", "ISRC-1");
        SongItem duplicateByIdFallback = song("one", "Different Title", null);
        SongItem unique = song("three", "Unique Title", "ISRC-2");


        List<SongItem> deduplicated = recommendationService.deduplicateSongs(List.of(first, duplicateByIsrc, duplicateByIdFallback, unique));


        assertEquals(2, deduplicated.size());
        assertEquals("Shared Title", deduplicated.get(0).getName());
        assertEquals("Unique Title", deduplicated.get(1).getName());
    }


    @Test
    void returnsMockEndToEndResponseWithinRequestedLimit() {
        when(trackSearchProvider.searchTracksByTag(anyString(), anyString(), anyInt(), anyInt()))
            .thenAnswer(invocation -> songsForTag(invocation.getArgument(1, String.class), invocation.getArgument(3, Integer.class)));


        SongSearchResponse response = recommendationService.buildRecommendations(
            "access-token",
            6,
            0.55f,
            0.40f,
            0.75f,
            0.20f,
            -12f,
            124f,
            0.60f);


        assertNotNull(response);
        assertNotNull(response.getItems());
        assertFalse(response.getItems().isEmpty());
        assertTrue(response.getItems().size() <= 6);


        SongItem first = response.getItems().get(0);
        assertNotNull(first.getAlbum());
        assertNotNull(first.getArtists());
        assertNotNull(first.getExternalIds());
        assertNotNull(first.getExternalUrls());
        assertNotNull(first.getHref());
        assertNotNull(first.getId());
        assertNotNull(first.getName());
        assertNotNull(first.getUri());
        assertNotNull(first.getExternalIds().getIsrc());
    }


    private static void assertWeightsSumToOne(List<BucketWeight> weights) {
        assertFalse(weights.isEmpty());
        double sum = weights.stream().mapToDouble(BucketWeight::weight).sum();
        assertEquals(1d, sum, 1e-9);
    }


    private static SongItem song(String id, String name, String isrc) {
        SongItem song = new SongItem();
        song.setAlbum(album(id));
        song.setArtists(List.of(artist(id)));
        song.setDiscNumber(1);
        song.setDurationMs(120000);
        song.setExplicit(false);
        song.setExternalIds(isrc == null ? new ExternalIdsItem("") : new ExternalIdsItem(isrc));
        song.setExternalUrls(urls("https://open.spotify.com/track/" + id));
        song.setHref(URI.create("https://api.spotify.com/v1/tracks/" + id));
        song.setId(id);
        song.setIsLocal(false);
        song.setIsPlayable(true);
        song.setName(name);
        song.setTrackNumber(1);
        song.setType("track");
        song.setUri("spotify:track:" + id);
        return song;
    }


    private static List<SongItem> songsForTag(String tag, int offset) {
        List<SongItem> songs = new ArrayList<>();
        for (int index = 0; index < 10; index++) {
            String baseId = tag.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
            String id = baseId + "-" + (offset + index);
            String isrc = index % 3 == 0 ? baseId + "-isrc-" + (offset + index) : "";
            songs.add(song(id, tag + " Track " + (offset + index), isrc));
        }
        return songs;
    }


    private static AlbumItem album(String id) {
        AlbumItem album = new AlbumItem();
        album.setAlbumType("album");
        album.setArtists(List.of(artist(id)));
        album.setExternalUrls(urls("https://open.spotify.com/album/" + id));
        album.setHref(URI.create("https://api.spotify.com/v1/albums/" + id));
        album.setId(id);
        album.setImages(new ArrayList<>());
        album.setIsPlayable(true);
        album.setName("Album " + id);
        album.setReleaseDate("2024-01-01");
        album.setReleaseDatePrecision("day");
        album.setTotalTracks(1);
        album.setType("album");
        album.setUri("spotify:album:" + id);
        return album;
    }


    private static ArtistItem artist(String id) {
        ArtistItem artist = new ArtistItem();
        artist.setExternalUrls(urls("https://open.spotify.com/artist/" + id));
        artist.setHref(URI.create("https://api.spotify.com/v1/artists/" + id));
        artist.setId(id);
        artist.setName("Artist " + id);
        artist.setType("artist");
        artist.setUri("spotify:artist:" + id);
        return artist;
    }


    private static ExternalUrlsItem urls(String spotifyUrl) {
        ExternalUrlsItem externalUrls = new ExternalUrlsItem();
        externalUrls.setSpotify(URI.create(spotifyUrl));
        return externalUrls;
    }
}
