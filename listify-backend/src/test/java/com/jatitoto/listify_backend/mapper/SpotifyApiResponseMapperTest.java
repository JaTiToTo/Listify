package com.jatitoto.listify_backend.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class SpotifyApiResponseMapperTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Nested
    class MapTracksToSongItems {

        @Test
        void mapsEmptyArrayToEmptyList() throws Exception {
            JsonNode tracks = OBJECT_MAPPER.readTree("[]");

            List<com.jatitoto.listify.model.SongItem> items = SpotifyApiResponseMapper.mapTracksToSongItems(tracks);

            assertThat(items).isEmpty();
        }

        @Test
        void mapsTrackFieldsAndNestedObjects() throws Exception {
            JsonNode tracks = OBJECT_MAPPER.readTree("""
                [{
                  "album": {
                    "album_type": "album",
                    "artists": [{"name": "Artist", "type": "artist", "uri": "spotify:artist:1", "href": "https://api.spotify.com/v1/artists/1", "id": "artist-1", "external_urls": {"spotify": "https://open.spotify.com/artist/1"}}],
                    "external_urls": {"spotify": "https://open.spotify.com/album/1"},
                    "href": "https://api.spotify.com/v1/albums/1",
                    "id": "album-1",
                    "images": [{"height": 640, "width": 640, "url": "https://i.scdn.co/image/1"}],
                    "is_playable": true,
                    "name": "Album",
                    "release_date": "2026-01-01",
                    "release_date_precision": "day",
                    "total_tracks": 10,
                    "type": "album",
                    "uri": "spotify:album:1"
                  },
                  "artists": [{"name": "Artist", "type": "artist", "uri": "spotify:artist:1", "href": "https://api.spotify.com/v1/artists/1", "id": "artist-1", "external_urls": {"spotify": "https://open.spotify.com/artist/1"}}],
                  "disc_number": 1,
                  "duration_ms": 200000,
                  "explicit": false,
                  "external_ids": {"isrc": "isrc-1"},
                  "external_urls": {"spotify": "https://open.spotify.com/track/1"},
                  "href": "https://api.spotify.com/v1/tracks/1",
                  "id": "track-1",
                  "is_local": false,
                  "is_playable": true,
                  "name": "Track",
                  "track_number": 1,
                  "type": "track",
                  "uri": "spotify:track:1"
                }]
                """);

            List<com.jatitoto.listify.model.SongItem> items = SpotifyApiResponseMapper.mapTracksToSongItems(tracks);

            assertThat(items).hasSize(1);
            assertThat(items.get(0).getName()).isEqualTo("Track");
            assertThat(items.get(0).getAlbum().getName()).isEqualTo("Album");
            assertThat(items.get(0).getArtists()).hasSize(1);
            assertThat(items.get(0).getExternalIds().getIsrc()).isEqualTo("isrc-1");
        }
    }
}