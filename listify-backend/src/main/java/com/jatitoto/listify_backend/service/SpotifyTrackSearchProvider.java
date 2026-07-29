package com.jatitoto.listify_backend.service;

import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify_backend.mapper.SliderTagMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SpotifyTrackSearchProvider implements TrackSearchProvider {

    private static final int MAX_SEARCH_LIMIT = 10;

    private final SpotifyApiService spotifyApiService;

    @Override
    public List<SongItem> searchTracksByTag(String accessToken, String tag, int limit, int offset) {
        int safeLimit = Math.max(1, Math.min(MAX_SEARCH_LIMIT, limit));
        int safeOffset = Math.max(0, offset);
        String query = buildTagQuery(tag);
        return spotifyApiService.searchTracks(accessToken, query, safeOffset, safeLimit);
    }

    private String buildTagQuery(String tag) {
        String normalizedTag = tag == null ? "" : tag.trim();
        if (normalizedTag.isBlank()) {
            return "";
        }

        String sanitizedTag = normalizedTag.replace("\"", "");
        if (SliderTagMapper.isGenreTag(sanitizedTag)) {
            return "genre:" + quoteIfMultiWord(sanitizedTag);
        }
        return sanitizedTag;
    }

    private String quoteIfMultiWord(String value) {
        return value.contains(" ") ? "\"" + value + "\"" : value;
    }
}