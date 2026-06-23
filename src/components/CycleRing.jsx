import { arcilla, FONT_DISPLAY, FONT_UI } from '../theme/arcilla';

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, endDeg);
  const end = polar(cx, cy, r, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
}

export default function CycleRing({ user, size = 140, stroke, center = true, pal = arcilla }) {
  const sw = stroke || Math.max(7, size * 0.085);
  const r = (size - sw) / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  if (!user.hasData) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }} role="img" aria-label="Ciclo sin datos">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={pal.line} strokeWidth={sw} strokeDasharray="2 8" strokeLinecap="round" />
        {center && (
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT_UI} fontSize={size * 0.1} fill={pal.muted}>
            sin datos
          </text>
        )}
      </svg>
    );
  }

  const cycleLen = Math.max(user.cycleLen || 28, 1);
  const angle = (day) => ((Math.max(day, 1) - 1) / cycleLen) * 360;
  const periodA = [angle(1), angle((user.periodLen || 5) + 1)];
  const fertileA = [angle(Math.max(1, user.fertStartDay || 1)), angle((user.fertEndDay || 1) + 1)];
  const ovulationPoint = polar(cx, cy, r, angle(user.ovDay || 1));
  const todayPoint = polar(cx, cy, r, angle(Math.min(Math.max(user.dayOfCycle || 1, 1), cycleLen)));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }} role="img" aria-label={`Dia ${user.dayOfCycle} del ciclo`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={pal.track} strokeWidth={sw} />
      <path d={arcPath(cx, cy, r, fertileA[0], fertileA[1])} fill="none" stroke={pal.fertile} strokeWidth={sw} strokeLinecap="round" opacity={0.92} />
      <path d={arcPath(cx, cy, r, periodA[0], periodA[1])} fill="none" stroke={pal.period} strokeWidth={sw} strokeLinecap="round" />
      <circle cx={ovulationPoint.x} cy={ovulationPoint.y} r={sw * 0.92} fill={pal.surface} />
      <circle cx={ovulationPoint.x} cy={ovulationPoint.y} r={sw * 0.62} fill={pal.ovulation} />
      <circle cx={ovulationPoint.x} cy={ovulationPoint.y} r={sw * 0.27} fill={pal.surface} />
      <circle cx={todayPoint.x} cy={todayPoint.y} r={sw * 0.5} fill={pal.surface} stroke={pal.ink} strokeWidth={2} />
      <circle cx={todayPoint.x} cy={todayPoint.y} r={sw * 0.2} fill={pal.ink} />
      {center && (
        <>
          <text x={cx} y={cy - size * 0.02} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT_DISPLAY} fontSize={size * 0.3} fill={pal.ink} fontWeight="500">
            {user.dayOfCycle}
          </text>
          <text x={cx} y={cy + size * 0.2} textAnchor="middle" fontFamily={FONT_UI} fontSize={size * 0.082} fill={pal.muted}>
            dia
          </text>
        </>
      )}
    </svg>
  );
}
