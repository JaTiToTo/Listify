package com.jatitoto.listify_backend.filter;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jatitoto.listify_backend.service.SpotifyAuthService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SpotifyTokenRefreshFilter extends OncePerRequestFilter {

    private final SpotifyAuthService spotifyAuthService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            spotifyAuthService.refreshSpotifyAccessTokenIfNeeded(session);
        }

        filterChain.doFilter(request, response);
    }
}
