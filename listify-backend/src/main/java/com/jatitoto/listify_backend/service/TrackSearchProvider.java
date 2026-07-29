package com.jatitoto.listify_backend.service;

import com.jatitoto.listify.model.SongItem;
import java.util.List;

public interface TrackSearchProvider {

    List<SongItem> searchTracksByTag(String accessToken, String tag, int limit, int offset);
}