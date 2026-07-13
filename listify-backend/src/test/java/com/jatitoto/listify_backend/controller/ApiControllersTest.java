package com.jatitoto.listify_backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ApiControllersTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void musicRecommendationsEndpointReturnsDummySongs() throws Exception {
        mockMvc.perform(get("/api/songs/recommendations").param("limit", "5"))
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
