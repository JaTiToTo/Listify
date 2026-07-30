package com.jatitoto.listify_backend.filter;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.jatitoto.listify_backend.service.SpotifyAuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;

@ExtendWith(MockitoExtension.class)
class SpotifyTokenRefreshFilterTest {

    @Mock
    private SpotifyAuthService spotifyAuthService;

    @Mock
    private FilterChain filterChain;

    private SpotifyTokenRefreshFilter filter;

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        filter = new SpotifyTokenRefreshFilter(spotifyAuthService);
    }

    @Nested
    class DoFilterInternal {

        @Test
        void refreshesTokenWhenSessionExists() throws Exception {
            HttpServletRequest request = org.mockito.Mockito.mock(HttpServletRequest.class);
            HttpServletResponse response = new MockHttpServletResponse();
            HttpSession session = org.mockito.Mockito.mock(HttpSession.class);

            doReturn(session).when(request).getSession(false);

            filter.doFilter(request, response, filterChain);

            verify(spotifyAuthService).refreshSpotifyAccessTokenIfNeeded(session);
            verify(filterChain).doFilter(request, response);
        }

        @Test
        void skipsRefreshWhenSessionMissing() throws Exception {
            HttpServletRequest request = org.mockito.Mockito.mock(HttpServletRequest.class);
            HttpServletResponse response = new MockHttpServletResponse();

            doReturn(null).when(request).getSession(false);

            filter.doFilter(request, response, filterChain);

            verify(spotifyAuthService, never()).refreshSpotifyAccessTokenIfNeeded(org.mockito.Mockito.any());
            verify(filterChain).doFilter(request, response);
        }
    }
}