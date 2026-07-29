package com.jatitoto.listify_backend.mapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
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

    /**
     * A thematic group of genres/moods with an "anchor" position in the 5D slider
     * space (energy, valence, acousticness, instrumentalness, tempo). Used by
     * {@link #selectSearchTags(Map, Random)} to pick 2-3 coherent tags per request
     * instead of aggregating independent per-axis picks.
     */
    public record GenreCluster(String name, List<String> genres, List<String> moods, double[] anchor) {
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

    /**
     * Thematic genre clusters used for coherent multi-tag selection. Anchors use
     * the same scales as {@link #AXIS_BUCKETS} (0-100 for energy/valence/acousticness/
     * instrumentalness, BPM for tempo) so both systems stay comparable.
     */
    private static final List<GenreCluster> GENRE_CLUSTERS = List.of(
        new GenreCluster("Lo-fi Chill", List.of("lo-fi", "chillout", "downtempo", "ambient"), List.of("calm", "relaxing"), new double[]{10, 45, 70, 55, 75}),
        new GenreCluster("Acoustic Singer-Songwriter", List.of("acoustic", "singer-songwriter", "folk", "americana"), List.of("reflective", "mellow"), new double[]{25, 40, 90, 10, 95}),
        new GenreCluster("Indie Dream Pop", List.of("indie pop", "dream pop", "bedroom pop", "folk pop"), List.of("nostalgic", "bittersweet"), new double[]{45, 55, 55, 15, 115}),
        new GenreCluster("Feelgood Pop", List.of("pop", "tropical house", "disco", "funk"), List.of("happy", "feelgood", "summer"), new double[]{60, 85, 35, 10, 122}),
        new GenreCluster("Melancholic Blues", List.of("sad songs", "emo", "blues", "slowcore"), List.of("sad", "melancholic", "heartbreak"), new double[]{20, 15, 60, 15, 78}),
        new GenreCluster("Alt / Indie Rock", List.of("alternative rock", "indie rock", "post-punk"), List.of("moody", "energetic"), new double[]{55, 40, 35, 20, 128}),
        new GenreCluster("EDM Dance Energy", List.of("edm", "house", "big room", "dance"), List.of("hype", "energetic", "workout"), new double[]{90, 70, 10, 60, 126}),
        new GenreCluster("Afrobeats Tropical Groove", List.of("afrobeats", "tropical house", "funk", "disco"), List.of("sunny", "fun"), new double[]{65, 80, 30, 30, 112}),
        new GenreCluster("Hip-Hop & R&B", List.of("hip-hop", "r&b", "rap", "trap"), List.of("smooth", "laid-back"), new double[]{50, 45, 15, 5, 90}),
        new GenreCluster("Instrumental Cinematic", List.of("instrumental", "classical", "soundtrack", "post-rock"), List.of("reflective", "calm"), new double[]{30, 45, 70, 95, 85}),
        new GenreCluster("High-Energy Electronic/Punk", List.of("drum and bass", "techno", "hardstyle", "punk", "hyperpop"), List.of("intense", "power"), new double[]{95, 55, 5, 50, 172}),
        new GenreCluster("Jazz Bossa Lounge", List.of("jazz instrumental", "bossa nova", "soul", "funk"), List.of("smooth", "chill"), new double[]{35, 60, 75, 60, 96})
    );

    /** Per-axis normalization ranges used to make cluster-distance axes comparable (last entry is the 60-200 BPM tempo span). */
    private static final double[] AXIS_RANGE = {100d, 100d, 100d, 100d, 140d};

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
        for (GenreCluster cluster : GENRE_CLUSTERS) {
            for (String genre : cluster.genres()) {
                genreTags.add(genre.toLowerCase(Locale.ROOT));
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

    /**
     * Picks the slider values' position in 5D space (energy, valence, acousticness,
     * instrumentalness, tempo), finds the genre cluster(s) whose theme fits best -
     * allowing the single worst-fitting axis to be ignored - and returns 2-3 tags
     * from that theme (optionally blended with a neighboring cluster) so the result
     * has a coherent, dynamic theme instead of 5-7 unrelated tags.
     */
    public static List<String> selectSearchTags(Map<SliderAxis, Float> axisValues, Random random) {
        double[] userVector = toVector(axisValues);

        List<GenreCluster> ranked = new ArrayList<>(GENRE_CLUSTERS);
        ranked.sort(Comparator.comparingDouble(cluster -> clusterScore(cluster, userVector)));
        List<GenreCluster> shortlist = ranked.subList(0, Math.min(3, ranked.size()));

        GenreCluster primary = drawWeightedCluster(shortlist, userVector, random);
        List<GenreCluster> neighbors = new ArrayList<>(shortlist);
        neighbors.remove(primary);
        GenreCluster neighbor = neighbors.isEmpty() ? null : neighbors.get(0);

        List<String> selectedTags = new ArrayList<>(selectWeightedUniqueTags(toEqualTagWeights(primary.genres()), 2, random));

        if (neighbor != null && random.nextDouble() < 0.35) {
            selectedTags.addAll(selectWeightedUniqueTags(toEqualTagWeights(neighbor.genres()), 1, random));
        } else if (!primary.moods().isEmpty()) {
            selectedTags.addAll(selectWeightedUniqueTags(toEqualTagWeights(primary.moods()), 1, random));
        }

        return List.copyOf(new LinkedHashSet<>(selectedTags));
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

    private static double[] toVector(Map<SliderAxis, Float> axisValues) {
        return new double[]{
            normalizeSliderValue(SliderAxis.ENERGY, axisValues.get(SliderAxis.ENERGY)),
            normalizeSliderValue(SliderAxis.VALENCE, axisValues.get(SliderAxis.VALENCE)),
            normalizeSliderValue(SliderAxis.ACOUSTICNESS, axisValues.get(SliderAxis.ACOUSTICNESS)),
            normalizeSliderValue(SliderAxis.INSTRUMENTALNESS, axisValues.get(SliderAxis.INSTRUMENTALNESS)),
            normalizeSliderValue(SliderAxis.TEMPO, axisValues.get(SliderAxis.TEMPO))
        };
    }

    /** Lower is better. Drops the single worst-fitting axis so a cluster isn't punished for one mismatched slider. */
    private static double clusterScore(GenreCluster cluster, double[] userVector) {
        double[] diffs = new double[userVector.length];
        for (int i = 0; i < userVector.length; i++) {
            diffs[i] = Math.abs(cluster.anchor()[i] - userVector[i]) / AXIS_RANGE[i];
        }
        Arrays.sort(diffs);
        double sum = 0d;
        int countedAxes = diffs.length - 1;
        for (int i = 0; i < countedAxes; i++) {
            sum += diffs[i];
        }
        return sum / countedAxes;
    }

    private static GenreCluster drawWeightedCluster(List<GenreCluster> clusters, double[] userVector, Random random) {
        List<TagWeight> weights = new ArrayList<>();
        for (GenreCluster cluster : clusters) {
            weights.add(new TagWeight(cluster.name(), 1d / (0.05d + clusterScore(cluster, userVector))));
        }
        TagWeight drawn = drawWeightedTag(weights, random);
        return clusters.stream().filter(cluster -> cluster.name().equals(drawn.tag())).findFirst().orElse(clusters.get(0));
    }

    private static List<TagWeight> toEqualTagWeights(List<String> tags) {
        List<TagWeight> weights = new ArrayList<>();
        for (String tag : tags) {
            weights.add(new TagWeight(tag, 1d));
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
