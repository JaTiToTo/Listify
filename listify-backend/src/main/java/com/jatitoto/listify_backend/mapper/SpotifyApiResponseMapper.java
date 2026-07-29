package com.jatitoto.listify_backend.mapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import com.jatitoto.listify.model.AlbumItem;
import com.jatitoto.listify.model.ArtistItem;
import com.jatitoto.listify.model.ExternalIdsItem;
import com.jatitoto.listify.model.ExternalUrlsItem;
import com.jatitoto.listify.model.ImageItem;
import com.jatitoto.listify.model.SongItem;

public class SpotifyApiResponseMapper {
	
	    public static List<SongItem> mapTracksToSongItems(JsonNode tracks) {
        List<SongItem> songs = new ArrayList<>();
        if (!tracks.isArray()) {
            return songs;
        }

        for (JsonNode track : tracks) {
            SongItem songItem = new SongItem();
            songItem.setAlbum(mapAlbum(track.path("album")));
            songItem.setArtists(mapArtists(track.path("artists")));
            songItem.setDiscNumber(track.path("disc_number").asInt(0));
            songItem.setDurationMs(track.path("duration_ms").asInt(0));
            songItem.setExplicit(track.path("explicit").asBoolean(false));
            songItem.setExternalIds(mapExternalIds(track.path("external_ids")));
            songItem.setExternalUrls(mapExternalUrls(track.path("external_urls")));
            songItem.setHref(parseUriOrDefault(track.path("href").asText(""), "https://api.spotify.com"));
            songItem.setId(track.path("id").asText(""));
            songItem.setIsLocal(track.path("is_local").asBoolean(false));
            songItem.setIsPlayable(track.path("is_playable").asBoolean(false));
            songItem.setName(track.path("name").asText(""));
            songItem.setTrackNumber(track.path("track_number").asInt(0));
            songItem.setType(track.path("type").asText("track"));
            songItem.setUri(track.path("uri").asText(""));

            songs.add(songItem);
        }

        return songs;
    }

    private static AlbumItem mapAlbum(JsonNode albumNode) {
        AlbumItem albumItem = new AlbumItem();
        albumItem.setAlbumType(albumNode.path("album_type").asText(""));
        albumItem.setArtists(mapArtists(albumNode.path("artists")));
        albumItem.setExternalUrls(mapExternalUrls(albumNode.path("external_urls")));
        albumItem.setHref(parseUriOrDefault(albumNode.path("href").asText(""), "https://api.spotify.com"));
        albumItem.setId(albumNode.path("id").asText(""));
        albumItem.setImages(mapImages(albumNode.path("images")));
        albumItem.setIsPlayable(albumNode.path("is_playable").asBoolean(false));
        albumItem.setName(albumNode.path("name").asText(""));
        albumItem.setReleaseDate(albumNode.path("release_date").asText(""));
        albumItem.setReleaseDatePrecision(albumNode.path("release_date_precision").asText(""));
        albumItem.setTotalTracks(albumNode.path("total_tracks").asInt(0));
        albumItem.setType(albumNode.path("type").asText("album"));
        albumItem.setUri(albumNode.path("uri").asText(""));
        return albumItem;
    }

    private static List<ArtistItem> mapArtists(JsonNode artistsNode) {
        List<ArtistItem> artists = new ArrayList<>();
        if (!artistsNode.isArray()) {
            return artists;
        }

        for (JsonNode artistNode : artistsNode) {
            ArtistItem artistItem = new ArtistItem();
            artistItem.setExternalUrls(mapExternalUrls(artistNode.path("external_urls")));
            artistItem.setHref(parseUriOrDefault(artistNode.path("href").asText(""), "https://api.spotify.com"));
            artistItem.setId(artistNode.path("id").asText(""));
            artistItem.setName(artistNode.path("name").asText(""));
            artistItem.setType(artistNode.path("type").asText("artist"));
            artistItem.setUri(artistNode.path("uri").asText(""));
            artists.add(artistItem);
        }

        return artists;
    }

    private static List<ImageItem> mapImages(JsonNode imagesNode) {
        List<ImageItem> images = new ArrayList<>();
        if (!imagesNode.isArray()) {
            return images;
        }

        for (JsonNode imageNode : imagesNode) {
            ImageItem imageItem = new ImageItem();
            imageItem.setHeight(imageNode.path("height").asInt(0));
            imageItem.setWidth(imageNode.path("width").asInt(0));
            imageItem.setUrl(parseUriOrDefault(imageNode.path("url").asText(""), "https://open.spotify.com"));
            images.add(imageItem);
        }

        return images;
    }

    private static ExternalIdsItem mapExternalIds(JsonNode externalIdsNode) {
        ExternalIdsItem externalIdsItem = new ExternalIdsItem();
        externalIdsItem.setIsrc(externalIdsNode.path("isrc").asText(""));
        return externalIdsItem;
    }

    private static ExternalUrlsItem mapExternalUrls(JsonNode externalUrlsNode) {
        ExternalUrlsItem externalUrlsItem = new ExternalUrlsItem();
        externalUrlsItem.setSpotify(
                parseUriOrDefault(externalUrlsNode.path("spotify").asText(""), "https://open.spotify.com"));
        return externalUrlsItem;
    }

    private static URI parseUriOrDefault(String value, String fallback) {
        try {
            if (value == null || value.isBlank()) {
                return URI.create(fallback);
            }
            return URI.create(value);
        } catch (IllegalArgumentException ex) {
            return URI.create(fallback);
        }
    }
	
}
