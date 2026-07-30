package com.jatitoto.listify_backend.mapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.offset;

import java.util.List;
import java.util.Map;
import java.util.Random;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class SliderTagMapperTest {

    @Nested
    class IsGenreTag {

        @Test
        void matchesKnownGenreTags() {
            assertThat(SliderTagMapper.isGenreTag("indie pop")).isTrue();
            assertThat(SliderTagMapper.isGenreTag("not-a-genre")).isFalse();
        }
    }

    @Nested
    class NormalizeSliderValue {

        @Test
        void usesTempoSpecificRange() {
            assertThat(SliderTagMapper.normalizeSliderValue(SliderTagMapper.SliderAxis.TEMPO, null)).isEqualTo(130d);
            assertThat(SliderTagMapper.normalizeSliderValue(SliderTagMapper.SliderAxis.TEMPO, 999f)).isEqualTo(200d);
        }

        @Test
        void scalesFractionalValuesForPercentAxes() {
            assertThat(SliderTagMapper.normalizeSliderValue(SliderTagMapper.SliderAxis.ENERGY, 0.42f)).isCloseTo(42d, offset(0.001d));
        }
    }

    @Nested
    class InterpolateBuckets {

        @Test
        void returnsSingleBucketAtBounds() {
            assertThat(SliderTagMapper.interpolateBuckets(SliderTagMapper.SliderAxis.ENERGY, 5d)).hasSize(1);
            assertThat(SliderTagMapper.interpolateBuckets(SliderTagMapper.SliderAxis.ENERGY, 100d)).hasSize(1);
        }

        @Test
        void interpolatesBetweenNeighboringBuckets() {
            assertThat(SliderTagMapper.interpolateBuckets(SliderTagMapper.SliderAxis.ENERGY, 40d)).hasSize(2);
        }
    }

    @Nested
    class BuildWeightedTagPool {

        @Test
        void buildsWeightsFromInterpolatedBuckets() {
            assertThat(SliderTagMapper.buildWeightedTagPool(SliderTagMapper.SliderAxis.ENERGY, 50d)).isNotEmpty();
        }
    }

    @Nested
    class SelectWeightedUniqueTags {

        @Test
        void drawsDistinctTags() {
            List<SliderTagMapper.TagWeight> weights = List.of(
                new SliderTagMapper.TagWeight("a", 10d),
                new SliderTagMapper.TagWeight("b", 1d),
                new SliderTagMapper.TagWeight("c", 1d));

            List<String> tags = SliderTagMapper.selectWeightedUniqueTags(weights, 2, new Random(1));

            assertThat(tags).hasSize(2);
            assertThat(tags).doesNotHaveDuplicates();
        }
    }

    @Nested
    class SelectSearchTags {

        @Test
        void returnsCoherentTagsForAxisValues() {
            List<String> tags = SliderTagMapper.selectSearchTags(
                Map.of(
                    SliderTagMapper.SliderAxis.ENERGY, 80f,
                    SliderTagMapper.SliderAxis.VALENCE, 80f,
                    SliderTagMapper.SliderAxis.ACOUSTICNESS, 20f,
                    SliderTagMapper.SliderAxis.INSTRUMENTALNESS, 10f,
                    SliderTagMapper.SliderAxis.TEMPO, 120f),
                new Random(2));

            assertThat(tags).isNotEmpty();
        }
    }
}