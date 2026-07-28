package com.jatitoto.listify_backend.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.jatitoto.listify.api.MusicApi;
import com.jatitoto.listify.model.SongSearchResponse;
import com.jatitoto.listify_backend.service.MusicService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MusicController implements MusicApi {

    private final MusicService musicService;

    @Override
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
        return musicService.getRecommendedSongs(
                limit,
                acousticness,
                danceability,
                durationMs,
                energy,
                instrumentalness,
                key,
                liveness,
                loudness,
                mode,
                popularity,
                speechiness,
                tempo,
                timeSignature,
                valence);
    }
}
