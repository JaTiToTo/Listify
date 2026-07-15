package com.jatitoto.listify_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.jatitoto.listify.api.PlaylistsApi;
import com.jatitoto.listify.model.CreatePlaylistRequest;
import com.jatitoto.listify.model.PlaylistResponse;
import com.jatitoto.listify_backend.service.PlaylistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class PlaylistsController implements PlaylistsApi {

    private final PlaylistService playlistService;

    @Override
    public ResponseEntity<PlaylistResponse> createPlaylist(CreatePlaylistRequest createPlaylistRequest) {
        return playlistService.createPlaylist(createPlaylistRequest);
    }
}
