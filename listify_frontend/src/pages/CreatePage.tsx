import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiGetJson } from "../lib/api";

const sessionIdMock = (Math.random() * 0xFFFFFFFFFFFFF).toString(16).slice(0, 10);

type FilterKey =
  | "acousticness"
  | "danceability"
  | "energy"
  | "instrumentalness"
  | "loudness"
  | "tempo"
  | "valence"
  | "limit";

type FilterState = Record<FilterKey, number>;

type SliderCardProps = {
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  min: number;
  max: number;
  step: number;
  valueLabel: (value: number) => string;
  valueBadgeWidthClassName: string;
  accentColor: string;
  onChange: (value: number) => void;
};

type FilterDefinition = {
  key: FilterKey;
  title: string;
  description: string;
  leftLabel: string;
  rightLabel: string;
  min: number;
  max: number;
  step: number;
  valueLabel: (value: number) => string;
  valueBadgeWidthClassName: string;
  accentColor: string;
};

const sliderCardClassName = "rounded-3xl border border-[#e0e0e0] bg-lightgrey p-6 shadow-sm";

const cassetteStripColors = ["#D94B3D", "#F0B429", "#24B81F", "#3387B9"];

const percentageToQueryValue = (value: number) => value / 100;

type RecommendedSongsRequest = {
  limit: number;
  acousticness?: number;
  danceability?: number;
  energy?: number;
  instrumentalness?: number;
  loudness?: number;
  tempo?: number;
  valence?: number;
};

const defaultFilters: FilterState = {
  acousticness: 50,
  danceability: 55,
  energy: 65,
  instrumentalness: 20,
  loudness: -12,
  tempo: 124,
  valence: 50,
  limit: 1,
};

const filterDefinitions: FilterDefinition[] = [
  {
    key: "limit",
    title: "Track limit",
    description: "How many tracks the draft should contain.",
    leftLabel: "Fewer tracks",
    rightLabel: "More tracks",
    min: 1,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value} tracks`,
    valueBadgeWidthClassName: "min-w-[11ch]",
    accentColor: "#24B81F",
  },
  {
    key: "tempo",
    title: "Tempo",
    description: "The track speed in beats per minute.",
    leftLabel: "Slower",
    rightLabel: "Faster",
    min: 60,
    max: 200,
    step: 1,
    valueLabel: (value) => `${value} BPM`,
    valueBadgeWidthClassName: "min-w-[9ch]",
    accentColor: "#3387B9",
  },
  {
    key: "loudness",
    title: "Loudness",
    description: "Measured from quieter and more restrained to louder and more forceful.",
    leftLabel: "Quiet",
    rightLabel: "Loud",
    min: -60,
    max: 0,
    step: 1,
    valueLabel: (value) => {
      if (value <= -45) {
        return "Very quiet";
      }

      if (value <= -30) {
        return "Quite quiet";
      }

      if (value <= -15) {
        return "Balanced";
      }

      if (value <= -5) {
        return "Quite loud";
      }

      return "Very loud";
    },
    valueBadgeWidthClassName: "min-w-[15ch]",
    accentColor: "#D94B3D",
  },
  {
    key: "acousticness",
    title: "Acousticness",
    description: "Blend between electronic and acoustic sounds.",
    leftLabel: "Electronic",
    rightLabel: "Acoustic",
    min: 0,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value}%`,
    valueBadgeWidthClassName: "min-w-[7ch]",
    accentColor: "#F0B429",
  },
  {
    key: "danceability",
    title: "Danceability",
    description: "How strongly the track invites movement.",
    leftLabel: "Laid-back",
    rightLabel: "Danceable",
    min: 0,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value}%`,
    valueBadgeWidthClassName: "min-w-[7ch]",
    accentColor: "#3387B9",
  },
  {
    key: "energy",
    title: "Energy",
    description: "Calmer tracks on the left, more intense tracks on the right.",
    leftLabel: "Calm",
    rightLabel: "High energy",
    min: 0,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value}%`,
    valueBadgeWidthClassName: "min-w-[7ch]",
    accentColor: "#24B81F",
  },
  {
    key: "instrumentalness",
    title: "Instrumentalness",
    description: "How much of the track is instrumental rather than vocal.",
    leftLabel: "Vocal",
    rightLabel: "Instrumental",
    min: 0,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value}%`,
    valueBadgeWidthClassName: "min-w-[7ch]",
    accentColor: "#D94B3D",
  },
  {
    key: "valence",
    title: "Valence",
    description: "Mood from darker and more restrained to brighter and happier.",
    leftLabel: "Dark",
    rightLabel: "Bright",
    min: 0,
    max: 100,
    step: 1,
    valueLabel: (value) => `${value}%`,
    valueBadgeWidthClassName: "min-w-[7ch]",
    accentColor: "#F0B429",
  },
];

function buildRecommendedSongsQuery(filters: FilterState) {
  const request: RecommendedSongsRequest = {
    limit: filters.limit,
    acousticness: percentageToQueryValue(filters.acousticness),
    danceability: percentageToQueryValue(filters.danceability),
    energy: percentageToQueryValue(filters.energy),
    instrumentalness: percentageToQueryValue(filters.instrumentalness),
    loudness: filters.loudness,
    tempo: filters.tempo,
    valence: percentageToQueryValue(filters.valence),
  };

  const searchParams = new URLSearchParams();

  Object.entries(request).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

function SliderCard({
  title,
  description,
  leftLabel,
  rightLabel,
  value,
  min,
  max,
  step,
  valueLabel,
  valueBadgeWidthClassName,
  accentColor,
  onChange,
}: SliderCardProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className={sliderCardClassName}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-quub text-xl font-bold text-[#1e1e1e]">{title}</h3>
          <p className="max-w-sm text-sm leading-6 text-gray-600">{description}</p>
        </div>
        <div
          className={`flex items-center justify-center rounded-full border border-[#1e1e1e] bg-[#f7f9ef] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1e1e1e] whitespace-nowrap ${valueBadgeWidthClassName}`}
          style={{ boxShadow: `0 0 0 56px ${accentColor}33 inset, 0 0 18px ${accentColor}22` }}
        >
          {valueLabel(value)}
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-4 rounded-full border border-[#1e1e1e] bg-[#ececec] shadow-[inset_0_2px_0_rgba(255,255,255,0.75),inset_0_-2px_0_rgba(0,0,0,0.08)]">
          <div
            className="absolute left-1 top-1/2 h-2 -translate-y-1/2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundImage: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
              boxShadow: `0 0 10px ${accentColor}55`,
            }}
          />
          <div
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1e1e1e]"
            style={{
              left: `${progress}%`,
              backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.96) 0 11%, ${accentColor} 19% 100%)`,
              boxShadow: ` 0 0 16px ${accentColor}66, 0 1px 0 #1e1e1e`,
            }}
          />
          <input
            aria-label={title}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>

        <div className="mt-3 flex justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function CreatePage() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const navigate = useNavigate();

  const setFilterValue = (key: FilterKey) => (value: number) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const handleCreateDraftPlaylist = async () => {
    const query = buildRecommendedSongsQuery(filters);

    setIsLoadingRecommendations(true);

    try {
      await apiGetJson<unknown>(`/songs/recommendations?${query}`);
    } catch (error) {
      console.error("Failed to request recommended songs:", error);
    } finally {
      setIsLoadingRecommendations(false);
      navigate(`/create/${sessionIdMock}/draft`);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 py-8 pb-32">
      <div className="flex flex-col gap-2">
        <h2 className="font-vampire text-4xl font-bold tracking-tight text-[#1e1e1e]">Create your own playlist</h2>
        <p className="font-quub text-lg font-semibold text-gray-600">Set the sound profile for the draft</p>
      </div>

      <div className="rounded-[32px] border border-[#e0e0e0] bg-[#f7f9ef] p-4 shadow-soft sm:p-6">
        <div className="grid gap-4">
          <SliderCard
            key={filterDefinitions[0].key}
            title={filterDefinitions[0].title}
            description={filterDefinitions[0].description}
            leftLabel={filterDefinitions[0].leftLabel}
            rightLabel={filterDefinitions[0].rightLabel}
            min={filterDefinitions[0].min}
            max={filterDefinitions[0].max}
            step={filterDefinitions[0].step}
            value={filters[filterDefinitions[0].key]}
            valueLabel={filterDefinitions[0].valueLabel}
            valueBadgeWidthClassName={filterDefinitions[0].valueBadgeWidthClassName}
              accentColor={filterDefinitions[0].accentColor}
            onChange={setFilterValue(filterDefinitions[0].key)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <SliderCard
              key={filterDefinitions[1].key}
              title={filterDefinitions[1].title}
              description={filterDefinitions[1].description}
              leftLabel={filterDefinitions[1].leftLabel}
              rightLabel={filterDefinitions[1].rightLabel}
              min={filterDefinitions[1].min}
              max={filterDefinitions[1].max}
              step={filterDefinitions[1].step}
              value={filters[filterDefinitions[1].key]}
              valueLabel={filterDefinitions[1].valueLabel}
              valueBadgeWidthClassName={filterDefinitions[1].valueBadgeWidthClassName}
              accentColor={filterDefinitions[1].accentColor}
              onChange={setFilterValue(filterDefinitions[1].key)}
            />
            <SliderCard
              key={filterDefinitions[2].key}
              title={filterDefinitions[2].title}
              description={filterDefinitions[2].description}
              leftLabel={filterDefinitions[2].leftLabel}
              rightLabel={filterDefinitions[2].rightLabel}
              min={filterDefinitions[2].min}
              max={filterDefinitions[2].max}
              step={filterDefinitions[2].step}
              value={filters[filterDefinitions[2].key]}
              valueLabel={filterDefinitions[2].valueLabel}
              valueBadgeWidthClassName={filterDefinitions[2].valueBadgeWidthClassName}
              accentColor={filterDefinitions[2].accentColor}
              onChange={setFilterValue(filterDefinitions[2].key)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SliderCard
              key={filterDefinitions[6].key}
              title={filterDefinitions[6].title}
              description={filterDefinitions[6].description}
              leftLabel={filterDefinitions[6].leftLabel}
              rightLabel={filterDefinitions[6].rightLabel}
              min={filterDefinitions[6].min}
              max={filterDefinitions[6].max}
              step={filterDefinitions[6].step}
              value={filters[filterDefinitions[6].key]}
              valueLabel={filterDefinitions[6].valueLabel}
              valueBadgeWidthClassName={filterDefinitions[6].valueBadgeWidthClassName}
              accentColor={filterDefinitions[6].accentColor}
              onChange={setFilterValue(filterDefinitions[6].key)}
            />
            <SliderCard
              key={filterDefinitions[7].key}
              title={filterDefinitions[7].title}
              description={filterDefinitions[7].description}
              leftLabel={filterDefinitions[7].leftLabel}
              rightLabel={filterDefinitions[7].rightLabel}
              min={filterDefinitions[7].min}
              max={filterDefinitions[7].max}
              step={filterDefinitions[7].step}
              value={filters[filterDefinitions[7].key]}
              valueLabel={filterDefinitions[7].valueLabel}
              valueBadgeWidthClassName={filterDefinitions[7].valueBadgeWidthClassName}
              accentColor={filterDefinitions[7].accentColor}
              onChange={setFilterValue(filterDefinitions[7].key)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filterDefinitions.slice(3, 6).map((filterDefinition) => (
              <SliderCard
                key={filterDefinition.key}
                title={filterDefinition.title}
                description={filterDefinition.description}
                leftLabel={filterDefinition.leftLabel}
                rightLabel={filterDefinition.rightLabel}
                min={filterDefinition.min}
                max={filterDefinition.max}
                step={filterDefinition.step}
                value={filters[filterDefinition.key]}
                valueLabel={filterDefinition.valueLabel}
                valueBadgeWidthClassName={filterDefinition.valueBadgeWidthClassName}
                accentColor={filterDefinition.accentColor}
                onChange={setFilterValue(filterDefinition.key)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] border border-[#e0e0e0] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-2">
          <p className="font-quub text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">Current draft settings</p>
          <p className="max-w-2xl text-sm leading-6 text-gray-600">
            These values stay in the frontend state for now so they can be passed to the backend recommendations endpoint later.
          </p>
        </div>
        <div className="rounded-2xl bg-[#f7f9ef] px-4 py-3 text-sm font-semibold text-[#1e1e1e]">
          {filters.limit} tracks, {filters.tempo} BPM, {filters.loudness} dB
        </div>
      </div>

      <div className="flex justify-center">
        <button
          className="group relative overflow-hidden rounded-[30px] border-[3px] border-[#1e1e1e] bg-[#efe8cf] px-14 py-6 font-quub text-xl font-bold text-[#1e1e1e] shadow-[0_10px_0_#1e1e1e,0_20px_30px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          onClick={handleCreateDraftPlaylist}
          disabled={isLoadingRecommendations}
        >
          <span className="absolute inset-x-0 top-0 flex h-3 overflow-hidden">
            {cassetteStripColors.map((color) => (
              <span key={color} className="h-full flex-1" style={{ backgroundColor: color }} />
            ))}
          </span>
          <span className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#1e1e1e] bg-white shadow-[0_3px_0_#1e1e1e]">
            <span className="ml-0.5 border-y-4 border-y-transparent border-l-7 border-l-[#1e1e1e]" />
          </span>
          <span className="absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border-2 border-[#1e1e1e] bg-white shadow-[0_3px_0_#1e1e1e]" />
          <span className="absolute inset-x-5 bottom-2 h-1 rounded-full bg-[#24B81F]/30" />
          {isLoadingRecommendations ? "Preparing draft..." : "Create draft playlist"}
        </button>
      </div>
    </div>
  );
}