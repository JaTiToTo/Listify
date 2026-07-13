package com.jatitoto.listify_backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jatitoto.listify.model.CreatePlaylistRequest;
import com.jatitoto.listify.model.PlaylistResponse;

@Service
public class PlaylistService {

    public ResponseEntity<PlaylistResponse> createPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        PlaylistResponse response = new PlaylistResponse();
        response.setPlaylistId("pl_dummy_123");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
