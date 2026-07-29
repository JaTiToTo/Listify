package com.jatitoto.listify_backend.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;

public final class SliderTagMapper {

    public enum SliderAxis {
        ENERGY,
        VALENCE,
        ACOUSTICNESS,
        INSTRUMENTALNESS,
        TEMPO
    }

    public record TagBucket(double center, List<String> genres, List<String> moods) {
        public TagBucket(double center, List<String> genres) {
            this(center, genres, List.of());
        }

        public List<String> tags() {
            LinkedHashSet<String> tags = new LinkedHashSet<>();
            tags.addAll(genres);
            tags.addAll(moods);
            return List.copyOf(tags);
        }
    }

    public record BucketWeight(TagBucket bucket, double weight) {
    }

    public record TagWeight(String tag, double weight) {
    }

    private static final Map<SliderAxis, List<TagBucket>> AXIS_BUCKETS = Map.of(
        SliderAxis.ENERGY, List.of(
            new TagBucket(15, List.of("ambient", "chillout", "downtempo", "lo-fi", "new age", "acoustic"), List.of("calm", "relaxing", "peaceful", "chill", "soft")),
            new TagBucket(50, List.of("indie pop", "pop", "soft rock", "dream pop", "alternative", "folk pop"), List.of("mellow", "laid-back", "easygoing", "smooth")),
            new TagBucket(85, List.of("edm", "house", "electropop", "pop punk", "dance", "big room"), List.of("energetic", "hype", "upbeat", "power", "workout"))
        ),
        SliderAxis.VALENCE, List.of(
            new TagBucket(15, List.of("sad songs", "emo", "blues", "slowcore", "singer-songwriter"), List.of("sad", "melancholic", "moody", "heartbreak", "lonely")),
            new TagBucket(50, List.of("indie", "alternative rock", "folk pop", "bedroom pop"), List.of("bittersweet", "reflective", "nostalgic")),
            new TagBucket(85, List.of("pop", "tropical house", "funk", "disco", "afrobeats"), List.of("happy", "feelgood", "sunny", "summer", "fun"))
        ),
        SliderAxis.ACOUSTICNESS, List.of(
            new TagBucket(15, List.of("edm", "synth-pop", "techno", "electro", "future bass", "electronica")),
            new TagBucket(50, List.of("pop", "indie pop", "pop rock", "alternative")),
            new TagBucket(85, List.of("acoustic", "folk", "singer-songwriter", "unplugged", "bossa nova", "americana"))
        ),
        SliderAxis.INSTRUMENTALNESS, List.of(
            new TagBucket(15, List.of("pop", "hip-hop", "r&b", "singer-songwriter", "rap")),
            new TagBucket(50, List.of("indie rock", "alternative", "post-punk")),
            new TagBucket(85, List.of("instrumental", "classical", "soundtrack", "post-rock", "lo-fi beats", "jazz instrumental"))
        ),
        SliderAxis.TEMPO, List.of(
            new TagBucket(80, List.of("ballad", "downtempo", "soul", "r&b", "slow jam")),
            new TagBucket(130, List.of("pop", "indie rock", "funk", "disco", "afrobeats")),
            new TagBucket(180, List.of("drum and bass", "techno", "hardstyle", "punk", "hyperpop", "speedcore"))
        )
    );

    private static final Set<String> ALL_GENRE_TAGS = buildGenreTagIndex();

    private static Set<String> buildGenreTagIndex() {
    Set<String> genreTags = new LinkedHashSet<>();
    for (List<TagBucket> buckets : AXIS_BUCKETS.values()) {
        for (TagBucket bucket : buckets) {
            for (String genre : bucket.genres()) {
                genreTags.add(genre.toLowerCase(Locale.ROOT));
            }
        }
    }
    return genreTags;
}

    public static boolean isGenreTag(String tag) {
        return tag != null && ALL_GENRE_TAGS.contains(tag.trim().toLowerCase(Locale.ROOT));
    }

    private SliderTagMapper() {
    }

    public static List<TagBucket> bucketsFor(SliderAxis axis) {
        return AXIS_BUCKETS.getOrDefault(axis, List.of());
    }

    public static double normalizeSliderValue(SliderAxis axis, Float value) {
        double fallback = axis == SliderAxis.TEMPO ? 130d : 50d;
        double numericValue = value == null ? fallback : value.doubleValue();
        if (axis == SliderAxis.TEMPO) {
            return clamp(numericValue, 60d, 200d);
        }

        if (numericValue <= 1d) {
            numericValue *= 100d;
        }

        return clamp(numericValue, 0d, 100d);
    }

    public static List<BucketWeight> interpolateBuckets(SliderAxis axis, double value) {
        List<TagBucket> buckets = new ArrayList<>(bucketsFor(axis));
        buckets.sort((left, right) -> Double.compare(left.center(), right.center()));

        if (buckets.isEmpty()) {
            return List.of();
        }

        if (value <= buckets.get(0).center()) {
            return List.of(new BucketWeight(buckets.get(0), 1d));
        }

        TagBucket lastBucket = buckets.get(buckets.size() - 1);
        if (value >= lastBucket.center()) {
            return List.of(new BucketWeight(lastBucket, 1d));
        }

        for (int index = 0; index < buckets.size() - 1; index++) {
            TagBucket lowerBucket = buckets.get(index);
            TagBucket upperBucket = buckets.get(index + 1);
            if (value < lowerBucket.center() || value > upperBucket.center()) {
                continue;
            }

            if (value == upperBucket.center()) {
                return List.of(new BucketWeight(upperBucket, 1d));
            }

            double span = upperBucket.center() - lowerBucket.center();
            double upperWeight = (value - lowerBucket.center()) / span;
            double lowerWeight = 1d - upperWeight;
            return List.of(new BucketWeight(lowerBucket, lowerWeight), new BucketWeight(upperBucket, upperWeight));
        }

        return List.of(new BucketWeight(lastBucket, 1d));
    }

    public static List<TagWeight> buildWeightedTagPool(SliderAxis axis, double value) {
        Map<String, Double> weightsByTag = new LinkedHashMap<>();

        for (BucketWeight bucketWeight : interpolateBuckets(axis, value)) {
            List<String> tags = bucketWeight.bucket().tags();
            if (tags.isEmpty() || bucketWeight.weight() <= 0d) {
                continue;
            }

            double perTagWeight = bucketWeight.weight() / tags.size();
            for (String tag : tags) {
                if (tag == null || tag.isBlank()) {
                    continue;
                }
                weightsByTag.merge(tag, perTagWeight, Double::sum);
            }
        }

        List<TagWeight> weightedTags = new ArrayList<>();
        for (Map.Entry<String, Double> entry : weightsByTag.entrySet()) {
            weightedTags.add(new TagWeight(entry.getKey(), entry.getValue()));
        }
        return weightedTags;
    }

    public static List<String> selectAxisTags(SliderAxis axis, Float value, Random random) {
        List<TagWeight> weightedTags = buildWeightedTagPool(axis, normalizeSliderValue(axis, value));
        return selectWeightedUniqueTags(weightedTags, 2, random);
    }

    public static List<String> selectSearchTags(Map<SliderAxis, Float> axisValues, Random random) {
        Map<String, Double> aggregatedWeights = new LinkedHashMap<>();

        for (SliderAxis axis : SliderAxis.values()) {
            List<String> axisTags = selectAxisTags(axis, axisValues.get(axis), random);
            for (String tag : axisTags) {
                aggregatedWeights.merge(tag, 1d, Double::sum);
            }
        }

        int desiredTagCount = Math.min(aggregatedWeights.size(), 5 + random.nextInt(3));
        return selectWeightedUniqueTags(toTagWeights(aggregatedWeights.entrySet()), desiredTagCount, random);
    }

    public static List<String> selectWeightedUniqueTags(List<TagWeight> weightedTags, int desiredCount, Random random) {
        if (weightedTags.isEmpty() || desiredCount <= 0) {
            return List.of();
        }

        List<TagWeight> mutablePool = new ArrayList<>(weightedTags);
        List<String> selectedTags = new ArrayList<>();
        int targetCount = Math.min(desiredCount, mutablePool.size());

        while (!mutablePool.isEmpty() && selectedTags.size() < targetCount) {
            TagWeight selectedTag = drawWeightedTag(mutablePool, random);
            selectedTags.add(selectedTag.tag());
            mutablePool.removeIf(candidate -> candidate.tag().equals(selectedTag.tag()));
        }

        return selectedTags;
    }

    private static List<TagWeight> toTagWeights(Collection<Map.Entry<String, Double>> entries) {
        List<TagWeight> weights = new ArrayList<>();
        for (Map.Entry<String, Double> entry : entries) {
            weights.add(new TagWeight(entry.getKey(), entry.getValue()));
        }
        return weights;
    }

    private static TagWeight drawWeightedTag(List<TagWeight> weightedTags, Random random) {
        double totalWeight = weightedTags.stream().mapToDouble(TagWeight::weight).filter(weight -> weight > 0d).sum();
        if (totalWeight <= 0d) {
            return weightedTags.get(random.nextInt(weightedTags.size()));
        }

        double draw = random.nextDouble(totalWeight);
        double runningWeight = 0d;
        for (TagWeight weightedTag : weightedTags) {
            runningWeight += Math.max(weightedTag.weight(), 0d);
            if (draw <= runningWeight) {
                return weightedTag;
            }
        }

        return weightedTags.get(weightedTags.size() - 1);
    }

    private static double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }
}
