package com.jatitoto.listify_backend.controller;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        System.setProperty("SPOTIFY_CLIENT_ID", "client-id");
        System.setProperty("SPOTIFY_CLIENT_SECRET", "client-secret");
        System.setProperty("SPOTIFY_REDIRECT_URI", "http://localhost:8081/auth/callback");
        System.setProperty("SPOTIFY_FRONTEND_REDIRECT_URI", "http://localhost:5173/callback");
    }

    @AfterEach
    void tearDown() {
        System.clearProperty("SPOTIFY_CLIENT_ID");
        System.clearProperty("SPOTIFY_CLIENT_SECRET");
        System.clearProperty("SPOTIFY_REDIRECT_URI");
        System.clearProperty("SPOTIFY_FRONTEND_REDIRECT_URI");
    }

    @Test
    void spotifyLoginEndpointReturnsAuthorizationUrl() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(get("/auth/login/spotify").session(session))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.TEXT_PLAIN));
				//todo: make a sensible test
    }

    @Test
    void spotifyCallbackEndpointRedirectsToFrontendOnError() throws Exception {
        mockMvc.perform(get("/auth/callback").param("error", "access_denied"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("http://127.0.0.1:5173/callback?error=access_denied"));
    }
}
