import { useMemo } from "react";
import {
  NOTE_NAMES_SPANISH,
  mod,
  fifthIndex,
  intervalName,
  PITCHES_12,
  type Pitch,
} from "../lib/theory";

interface Props {
  activePitches: Pitch[];
  color: string;
  mode?: "chromatic" | "fifths";
  size?: number;
  mirrorPitches?: Pitch[];
  mirrorColor?: string;
  showAxis?: boolean;
  fifthsSliceNotes?: Pitch[];
  showSliceBackground?: boolean;
  highlightedPitches?: Pitch[];
  rootPitch?: Pitch; // tónica explícita para tooltips
}

const R = 160;
const CENTER = 200;

function pointFor(pitch: Pitch, mode: "chromatic" | "fifths"): { x: number; y: number } {
  const pos = mode === "chromatic" ? mod(pitch, 12) : fifthIndex(pitch);
  const angle = (pos / 12) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER + R * Math.cos(angle),
    y: CENTER + R * Math.sin(angle),
  };
}

function describeArc(startAngle: number, endAngle: number, radius: number): string {
  const start = {
    x: CENTER + radius * Math.cos(startAngle),
    y: CENTER + radius * Math.sin(startAngle),
  };
  const end = {
    x: CENTER + radius * Math.cos(endAngle),
    y: CENTER + radius * Math.sin(endAngle),
  };
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 1 ${end.x} ${end.y}`;
}

export default function CircleChromatic({
  activePitches,
  color,
  mode = "chromatic",
  size = 400,
  mirrorPitches,
  mirrorColor = "#60a5fa",
  showAxis = false,
  fifthsSliceNotes,
  showSliceBackground = false,
  highlightedPitches = [],
  rootPitch,
}: Props) {
  const highlightSet = useMemo(
    () => new Set(highlightedPitches.map((p) => mod(p, 12))),
    [highlightedPitches],
  );

  const polygon = useMemo(() => {
    const pts = activePitches.map((p) => pointFor(p, mode));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  }, [activePitches, mode]);

  const mirrorPolygon = useMemo(() => {
    if (!mirrorPitches?.length) return "";
    const pts = mirrorPitches.map((p) => pointFor(p, mode));
    return pts.map((p) => `${p.x},${p.y}`).join(" ");
  }, [mirrorPitches, mode]);

  const axisLine = useMemo(() => {
    if (!showAxis || activePitches.length === 0) return null;
    const root = activePitches[0];
    const fifth = mod(root + 7);
    const p1 = pointFor(root, mode);
    const p2 = pointFor(fifth, mode);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  }, [showAxis, activePitches, mode]);

  const activePitchValues = useMemo(
    () => activePitches.map((p) => mod(p, 12)),
    [activePitches],
  );

  const handleClick = (p: Pitch) => {
    const ev = new CustomEvent("note-click", { detail: p });
    window.dispatchEvent(ev);
  };

  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </radialGradient>
      </defs>

      <rect width="400" height="400" fill="url(#bg)" rx="12" />
      <circle cx={CENTER} cy={CENTER} r={R} fill="none" stroke="#2a2a40" strokeWidth="1" />

      {showSliceBackground && fifthsSliceNotes && fifthsSliceNotes.length > 1 && (
        (() => {
          const indices = fifthsSliceNotes
            .map((p) => fifthIndex(p))
            .sort((a, b) => a - b);
          if (indices.length < 2) return null;

          // Encontrar el gap más grande entre posiciones consecutivas (circular)
          let maxGap = 0;
          let gapEnd = 0;
          for (let i = 0; i < indices.length; i++) {
            const next = indices[(i + 1) % indices.length];
            const gap = i === indices.length - 1
              ? indices[0] + 12 - indices[i]
              : next - indices[i];
            if (gap > maxGap) {
              maxGap = gap;
              gapEnd = i; // índice donde termina el gap
            }
          }

          // El arco va desde el elemento después del gap hasta el elemento antes del gap
          const startPos = indices[(gapEnd + 1) % indices.length];
          let endPos = indices[gapEnd];
          if (endPos < startPos) endPos += 12;

          const aStart = (startPos / 12) * 2 * Math.PI - Math.PI / 2;
          const aEnd = (endPos / 12) * 2 * Math.PI - Math.PI / 2;
          const r2 = R + 22;
          return (
            <path
              d={describeArc(aStart, aEnd, r2)}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
          );
        })()
      )}

      {axisLine && (
        <line
          {...axisLine}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeDasharray="6,4"
          strokeOpacity="0.4"
        />
      )}

      {mirrorPolygon && (
        <polygon
          points={mirrorPolygon}
          fill={mirrorColor}
          fillOpacity={0.12}
          stroke={mirrorColor}
          strokeWidth="2"
          strokeDasharray="5,3"
          strokeLinejoin="round"
          style={{ transition: "all 0.25s" }}
        />
      )}

      {activePitches.length >= 2 && (
        <polygon
          points={polygon}
          fill={color}
          fillOpacity={0.18}
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ transition: "all 0.25s" }}
        />
      )}

      {activePitches.map((p, i) => {
        const { x, y } = pointFor(p, mode);
        return (
          <line
            key={`r${i}`}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.2"
          />
        );
      })}

      {PITCHES_12.map((p) => {
        const { x, y } = pointFor(p, mode);
        const isActive = activePitchValues.includes(p);
        const isMirror =
          mirrorPitches?.map((m) => mod(m, 12)).includes(p) && !isActive;
        const isHighlighted = highlightSet.has(p);

        const dotColor = isHighlighted
          ? "#ffffff"
          : isActive
            ? color
            : isMirror
              ? mirrorColor
              : "#15151f";

        const strokeColor = isHighlighted
          ? color
          : isActive
            ? "#fff"
            : isMirror
              ? "#88ccff"
              : "#3a3a55";

        const r = isHighlighted ? 18 : isActive ? 16 : isMirror ? 14 : 11;
        const strokeW = isHighlighted ? 3 : isActive ? 1.5 : isMirror ? 1.5 : 1;

        return (
          <g
              key={p}
              role="button"
              tabIndex={0}
              className="cursor-pointer focus:outline-none"
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(p); }}
            >
            {/* Glow exterior para la nota destacada */}
            {isHighlighted && (
              <circle
                cx={x}
                cy={y}
                r={22}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeOpacity="0.4"
              />
            )}
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={dotColor}
              stroke={strokeColor}
              strokeWidth={strokeW}
              style={{ transition: "all 0.15s" }}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive || isMirror || isHighlighted ? "#0a0a0f" : "#8b8ba0"}
              fontSize={isHighlighted ? 13 : isActive ? 12 : 11}
              fontWeight={isHighlighted || isActive || isMirror ? 700 : 500}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {NOTE_NAMES_SPANISH[p]}
            </text>
            <title>
              {NOTE_NAMES_SPANISH[p]}
              {isActive && rootPitch !== undefined &&
                ` — ${intervalName(mod((activePitches.find((a) => mod(a, 12) === p) ?? rootPitch) - rootPitch))}`}
            </title>
          </g>
        );
      })}
    </svg>
  );
}
