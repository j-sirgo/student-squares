import { useLayoutEffect, useRef, useState } from "react";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3";
import { regions, type Country, type Region } from "./data";

type Props = {
  data: Country[];
};

// the chart fills its container; the container's width drives every scale
function useContainerWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

// every student is one square; a bar is a row of squares
const MARGIN = { top: 12, right: 56, bottom: 48, left: 140 };
const SQUARE_GAP = 2;
const MIN_SQUARE_STEP = 10;
// rows are taller than the squares so labels breathe and the chart reads as a list
const ROW_RATIO = 1.9;

// one css variable per region, defined in App.css for light and dark
const colorScale = scaleOrdinal<Region, string>()
  .domain(regions)
  .range(regions.map((_, i) => `var(--cat-${i + 1})`));

export function Barplot({ data }: Props) {
  const [frameRef, frameWidth] = useContainerWidth<HTMLDivElement>(960);
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);

  const sorted = [...data].sort((a, b) => b.students - a.students);
  const max = Math.max(...sorted.map((d) => d.students));
  const total = sorted.reduce((s, d) => s + d.students, 0);

  // never let a square drop below a legible size; on narrow screens the frame scrolls instead
  const minWidth = MARGIN.left + MARGIN.right + max * MIN_SQUARE_STEP;
  const width = Math.max(frameWidth, minWidth);

  const boundsWidth = width - MARGIN.left - MARGIN.right;
  // d3 does the math: the x scale is in units of students
  const xScale = scaleLinear().domain([0, max]).range([0, boundsWidth]);
  const squareStep = xScale(1);
  const squareSize = Math.max(squareStep - SQUARE_GAP, 1);

  const rowHeight = Math.round(squareStep * ROW_RATIO);
  const boundsHeight = rowHeight * sorted.length;
  const height = boundsHeight + MARGIN.top + MARGIN.bottom;

  const yScale = scaleBand<string>()
    .domain(sorted.map((d) => d.country))
    .range([0, boundsHeight]);

  const ticks = xScale.ticks(7);
  const active = sorted.find((d) => d.country === hovered);

  const regionTotals = new Map<Region, number>();
  for (const d of sorted) {
    regionTotals.set(d.region, (regionTotals.get(d.region) ?? 0) + d.students);
  }

  const isDim = (d: Country) =>
    (hovered !== null && hovered !== d.country) ||
    (activeRegion !== null && activeRegion !== d.region);

  return (
    <figure className="barplot">
      <div className="chart-top">
        <div className="readout" aria-live="polite">
          {active ? (
            <>
              <strong>{active.country}</strong>
              <span className="sep">·</span>
              {active.students} {active.students === 1 ? "student" : "students"}
              <span className="sep">·</span>
              {((100 * active.students) / total).toFixed(0)}% of the cohort
            </>
          ) : (
            <span className="hint">Hover a row or a region.</span>
          )}
        </div>
        <ul className="legend" aria-label="Region">
          {regions.map((r) => (
            <li key={r}>
              <button
                type="button"
                className={
                  activeRegion !== null && activeRegion !== r ? "dim" : ""
                }
                onMouseEnter={() => setActiveRegion(r)}
                onMouseLeave={() => setActiveRegion(null)}
                onFocus={() => setActiveRegion(r)}
                onBlur={() => setActiveRegion(null)}
              >
                <span
                  className="swatch"
                  style={{ background: colorScale(r) }}
                />
                {r}
                <span className="legend-n">{regionTotals.get(r) ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="frame" ref={frameRef}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Students by country"
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            <rect
              className="panel"
              x={-8}
              y={-8}
              width={boundsWidth + MARGIN.right - 4}
              height={boundsHeight + 16}
              rx={8}
            />
            {ticks.map((t) => (
              <line
                key={t}
                className="grid"
                x1={xScale(t)}
                x2={xScale(t)}
                y1={0}
                y2={boundsHeight}
              />
            ))}
            {sorted.map((d) => {
              const y = yScale(d.country) ?? 0;
              const sy = y + (rowHeight - squareSize) / 2;
              const cls = [
                "row",
                hovered === d.country ? "active" : "",
                isDim(d) ? "dim" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <g
                  key={d.country}
                  className={cls}
                  style={{ ["--c" as string]: colorScale(d.region) }}
                  onMouseEnter={() => setHovered(d.country)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <rect
                    className="hit"
                    x={-MARGIN.left}
                    y={y}
                    width={width}
                    height={rowHeight}
                  />
                  <text
                    className="label"
                    x={-14}
                    y={y + rowHeight / 2}
                    dominantBaseline="central"
                    textAnchor="end"
                  >
                    {d.country}
                  </text>
                  {Array.from({ length: d.students }, (_, i) => (
                    <rect
                      key={i}
                      className="square"
                      x={xScale(i) + SQUARE_GAP / 2}
                      y={sy}
                      width={squareSize}
                      height={squareSize}
                      rx={1.5}
                    />
                  ))}
                  <text
                    className="value"
                    x={xScale(d.students) + 8}
                    y={y + rowHeight / 2}
                    dominantBaseline="central"
                  >
                    {d.students}
                  </text>
                </g>
              );
            })}
            <g className="axis" transform={`translate(0,${boundsHeight})`}>
              <line x1={0} x2={boundsWidth} y1={0} y2={0} />
              {ticks.map((t) => (
                <text key={t} x={xScale(t)} y={20} textAnchor="middle">
                  {t}
                </text>
              ))}
              <text
                className="axis-title"
                x={boundsWidth}
                y={38}
                textAnchor="end"
              >
                students
              </text>
            </g>
          </g>
        </svg>
      </div>
    </figure>
  );
}
