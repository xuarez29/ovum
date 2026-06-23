// src/components/PhasePill.jsx
import { arcilla, FONT_UI } from "../theme/arcilla";

export default function PhasePill({ user, size = "md", pal = arcilla }) {
  const map = {
    ovulation: { c: pal.ovulation, bg: pal.ovulationBg },
    fertile: { c: pal.fertile, bg: pal.fertileBg },
    period: { c: pal.period, bg: pal.periodBg },
    normal: { c: pal.normal, bg: pal.surfaceAlt },
  };
  const s = map[user.statusKey] || map.normal;
  const sm = size === "sm";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1, whiteSpace: "nowrap",
      padding: sm ? "3px 8px" : "5px 11px", borderRadius: 999,
      background: s.bg, color: s.c, fontFamily: FONT_UI,
      fontSize: sm ? 11 : 12.5, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 6, background: s.c }} />
      {user.status}
    </span>
  );
}
