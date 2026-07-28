package com.jatitoto.listify_backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify_backend.service.SpotifyApiService;

@SpringBootTest
@AutoConfigureMockMvc
class ApiControllersTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SpotifyApiService spotifyApiService;

    @Test
    void musicRecommendationsEndpointReturnsDummySongs() throws Exception {
        SongItem songItem = new SongItem();
        songItem.setTitle("Midnight City");
        songItem.setArtist("M83");
        songItem.setLength("03:43");
        songItem.setSongId("song-dummy-1");
        songItem.setSongIcon(URI.create("https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"));

        when(spotifyApiService.getRecommendations(anyString(), any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(List.of(songItem));

        MockHttpSession session = new MockHttpSession();
        session.setAttribute("spotify_access_token", "token");

        mockMvc.perform(get("/api/songs/recommendations").param("limit", "5").session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.songs[0].title").value("Midnight City"));
    }

    @Test
    void playlistsEndpointReturnsDummyPlaylistResponse() throws Exception {
        mockMvc.perform(post("/api/playlists")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"songIds\":[\"song-1\"]}"))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.playlistId").value("pl_dummy_123"));
    }
}
