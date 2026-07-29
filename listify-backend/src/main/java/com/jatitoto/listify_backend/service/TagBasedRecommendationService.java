package com.jatitoto.listify_backend.service;

import com.jatitoto.listify.model.SongItem;
import com.jatitoto.listify.model.SongSearchResponse;
import com.jatitoto.listify_backend.mapper.SliderTagMapper;
import com.jatitoto.listify_backend.mapper.SliderTagMapper.SliderAxis;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Service;

@Service
public class TagBasedRecommendationService {

    private static final int DEFAULT_LIMIT = 20;
    private static final int MAX_LIMIT = 100;
    private static final int SEARCH_LIMIT_PER_CALL = 10;
    private static final int MAX_PAGES_PER_TAG = 3;

    private final TrackSearchProvider trackSearchProvider;

    public TagBasedRecommendationService(TrackSearchProvider trackSearchProvider) {
        this.trackSearchProvider = trackSearchProvider;
    }

    public SongSearchResponse buildRecommendations(
        String accessToken,
        Integer limit,
        Float acousticness,
        Float danceability,
        Float energy,
        Float instrumentalness,
        Float loudness,
        Float tempo,
        Float valence
    ) {
        int requestedLimit = clampLimit(limit);
        Random random = ThreadLocalRandom.current();

        Map<SliderAxis, Float> axisValues = new LinkedHashMap<>();
        axisValues.put(SliderAxis.ENERGY, energy);
        axisValues.put(SliderAxis.VALENCE, valence);
        axisValues.put(SliderAxis.ACOUSTICNESS, acousticness);
        axisValues.put(SliderAxis.INSTRUMENTALNESS, instrumentalness);
        axisValues.put(SliderAxis.TEMPO, tempo);

        List<String> selectedTags = SliderTagMapper.selectSearchTags(axisValues, random);
        List<SongItem> candidateTracks = collectCandidateTracks(accessToken, selectedTags, requestedLimit);
        List<SongItem> deduplicatedTracks = deduplicateSongs(candidateTracks);

        Collections.shuffle(deduplicatedTracks, random);

        SongSearchResponse response = new SongSearchResponse();
        response.setItems(deduplicatedTracks.size() > requestedLimit
            ? new ArrayList<>(deduplicatedTracks.subList(0, requestedLimit))
            : new ArrayList<>(deduplicatedTracks));
        response.setSelectedTags(selectedTags);
        return response;
    }

    public List<SongItem> collectCandidateTracks(String accessToken, List<String> selectedTags, int requestedLimit) {
        List<SongItem> candidateTracks = new ArrayList<>();
        if (selectedTags.isEmpty()) {
            return candidateTracks;
        }

        int candidateTarget = Math.max(requestedLimit * 2, 20);
        int pagesPerTag = Math.max(1, Math.min(MAX_PAGES_PER_TAG, (requestedLimit + SEARCH_LIMIT_PER_CALL - 1) / SEARCH_LIMIT_PER_CALL));

        for (int pageIndex = 0; pageIndex < pagesPerTag; pageIndex++) {
            int offset = pageIndex * SEARCH_LIMIT_PER_CALL;
            for (String tag : selectedTags) {
                candidateTracks.addAll(trackSearchProvider.searchTracksByTag(accessToken, tag, SEARCH_LIMIT_PER_CALL, offset));
            }
            if (deduplicateSongs(candidateTracks).size() >= candidateTarget) {
                break;
            }
        }

        return candidateTracks;
    }

    public List<SongItem> deduplicateSongs(List<SongItem> tracks) {
        List<SongItem> uniqueTracks = new ArrayList<>();
        Set<String> seenIsrcs = new HashSet<>();
        Set<String> seenIds = new HashSet<>();
        Set<String> seenNames = new HashSet<>();

        for (SongItem track : tracks) {
            if (track == null) {
                continue;
            }

            String trackName = normalize(track.getName());
            if (trackName.isBlank() || !seenNames.add(trackName)) {
                continue;
            }

            String trackId = normalize(track.getId());
            String isrc = track.getExternalIds() == null ? "" : normalize(track.getExternalIds().getIsrc());

            if (!isrc.isBlank()) {
                if (seenIsrcs.contains(isrc) || seenIds.contains(trackId)) {
                    continue;
                }
                seenIsrcs.add(isrc);
                if (!trackId.isBlank()) {
                    seenIds.add(trackId);
                }
            } else {
                if (trackId.isBlank() || !seenIds.add(trackId)) {
                    continue;
                }
            }

            uniqueTracks.add(track);
        }

        return uniqueTracks;
    }

    private static int clampLimit(Integer limit) {
        if (limit == null || limit <= 0) {
            return DEFAULT_LIMIT;
        }

        return Math.min(MAX_LIMIT, limit);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}