// src/components/CycleRing.jsx
// Anillo de fases del ciclo. Muestra periodo (rojo), ventana fértil (verde),
// el pico de ovulación (punto dorado) y un marcador "hoy".
import { arcilla, FONT_DISPLAY, FONT_UI } from "../theme/arcilla";

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arcPath(cx, cy, r, startDeg, endDeg) {
  const s = polar(cx, cy, r, endDeg);
  const e = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export default function CycleRing({ user, size = 140, stroke, center = true, pal = arcilla }) {
  // Estado vacío: anillo punteado neutro.
  if (!user.hasData) {
    const sw = stroke || Math.max(7, size * 0.085);
    const r = (size - sw) / 2 - 2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pal.line}
          strokeWidth={sw} strokeDasharray="2 8" strokeLinecap="round" />
        {center && (
          <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="middle"
            fontFamily={FONT_UI} fontSize={size * 0.1} fill={pal.muted}>sin datos</text>
        )}
      </svg>
    );
  }

  const sw = stroke || Math.max(7, size * 0.085);
  const r = (size - sw) / 2 - 2;
  const cx = size / 2, cy = size / 2;
  const cl = user.cycleLen;
  const ang = (day) => ((day - 1) / cl) * 360;

  const periodA = [ang(1), ang(user.periodLen + 1)];
  const fertA = [ang(Math.max(1, user.fertStartDay)), ang(user.fertEndDay + 1)];
  const ovPt = polar(cx, cy, r, ang(user.ovDay));
  const todayPt = polar(cx, cy, r, ang(user.dayOfCycle));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={pal.track} strokeWidth={sw} />
      <path d={arcPath(cx, cy, r, fertA[0], fertA[1])} fill="none" stroke={pal.fertile}
        strokeWidth={sw} strokeLinecap="round" opacity={0.92} />
      <path d={arcPath(cx, cy, r, periodA[0], periodA[1])} fill="none" stroke={pal.period}
        strokeWidth={sw} strokeLinecap="round" />
      {/* pico de ovulación */}
      <circle cx={ovPt.x} cy={ovPt.y} r={sw * 0.92} fill={pal.surface} />
      <circle cx={ovPt.x} cy={ovPt.y} r={sw * 0.62} fill={pal.ovulation} />
      <circle cx={ovPt.x} cy={ovPt.y} r={sw * 0.27} fill={pal.surface} />
      {/* marcador hoy */}
      <circle cx={todayPt.x} cy={todayPt.y} r={sw * 0.5} fill={pal.surface} stroke={pal.ink} strokeWidth={2} />
      <circle cx={todayPt.x} cy={todayPt.y} r={sw * 0.2} fill={pal.ink} />
      {center && (
        <>
          <text x={cx} y={cy - size * 0.02} textAnchor="middle" dominantBaseline="middle"
            fontFamily={FONT_DISPLAY} fontSize={size * 0.3} fill={pal.ink} fontWeight="500">
            {user.dayOfCycle}
          </text>
          <text x={cx} y={cy + size * 0.2} textAnchor="middle" fontFamily={FONT_UI}
            fontSize={size * 0.082} fill={pal.muted} letterSpacing="0.08em"
            style={{ textTransform: "uppercase" }}>día</text>
        </>
      )}
    </svg>
  );
}
