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
            Float energy,
            Float instrumentalness,
            Float loudness,
            Float tempo,
            Float valence) {
        return musicService.getRecommendedSongs(
                limit,
                acousticness,
                danceability,
                energy,
                instrumentalness,
                loudness,
                tempo,
                valence);
    }
}
