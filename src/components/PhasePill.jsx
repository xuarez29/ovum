import { arcilla, FONT_UI } from '../theme/arcilla';

export default function PhasePill({ user, size = 'md', pal = arcilla }) {
  const map = {
    ovulation: { color: pal.ovulation, background: pal.ovulationBg },
    fertile: { color: pal.fertile, background: pal.fertileBg },
    period: { color: pal.period, background: pal.periodBg },
    normal: { color: pal.normal, background: pal.surfaceAlt }
  };
  const theme = map[user.statusKey] || map.normal;
  const small = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        padding: small ? '4px 8px' : '6px 11px',
        borderRadius: 999,
        background: theme.background,
        color: theme.color,
        fontFamily: FONT_UI,
        fontSize: small ? 11 : 12.5,
        fontWeight: 700
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 6, background: theme.color }} />
      {user.status}
    </span>
  );
}
