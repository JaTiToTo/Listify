package com.jatitoto.listify_backend.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class MusicService {
    private static final Logger logger = LoggerFactory.getLogger(SpotifyAuthService.class);


    public ResponseEntity<SongSearchResponse> getRecommendedSongs(
            Integer limit,
            Float acousticness,
            Float danceability,
            Integer durationMs,
            Float energy,
            Float instrumentalness,
            Integer key,
            Float liveness,
            Float loudness,
            Integer mode,
            Integer popularity,
            Float speechiness,
            Float tempo,
            Integer timeSignature,
            Float valence) {
        HttpSession session = UtilService.getCurrentSession();
        logger.info("\nSession ID: {}", session.getId());
        SongItem song1 = new SongItem();
        song1.setTitle("Midnight City");
        song1.setArtist("M83");
        song1.setLength("03:43");
        song1.setSongId("song-dummy-1");
        song1.setSongIcon(URI.create("https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"));
		song1.setPreviewUrl(URI.create("https://audio-ssl.itunes.apple.com/apple-assets-us-ipv4/p123456789/vod/123456789.mp4"));
		SongItem song2 = new SongItem();
		song2.setTitle("Electric Feel");
		song2.setArtist("MGMT");
		song2.setLength("03:50");
		song2.setSongId("song-dummy-2");
		song2.setSongIcon(URI.create("https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"));


        SongSearchResponse response = new SongSearchResponse();
        response.setSongs(List.of(song1, song2));
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<Resource> getTrackPreview(String trackId) {
        byte[] previewBytes = ("dummy preview for " + trackId).getBytes(StandardCharsets.UTF_8);
        ByteArrayResource resource = new ByteArrayResource(previewBytes);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .body(resource);
    }
}
