import { formatDateShort } from '../utils/dateUtils';
import { arcilla, FONT_DISPLAY, FONT_UI } from '../theme/arcilla';
import Avatar from './Avatar';
import CycleRing from './CycleRing';
import PhasePill from './PhasePill';

function Metric({ label, value, sub, pal }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: pal.surfaceAlt,
        borderRadius: 12,
        padding: '10px 12px'
      }}
    >
      <div style={{ fontFamily: FONT_UI, fontSize: 10.5, color: pal.muted, textTransform: 'uppercase', letterSpacing: 0, marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: pal.ink, whiteSpace: 'nowrap' }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT_UI, fontSize: 11.5, color: pal.sub }}>{sub}</div>}
    </div>
  );
}

function formatDelta(days, target = 'en') {
  if (days === null || days === undefined) return 'sin dato';
  if (days === 0) return 'hoy';
  if (days > 0) return `${target} ${days} dias`;
  return `hace ${Math.abs(days)} dias`;
}

export default function UserCard({ user, onSelect, pal = arcilla }) {
  const highlight = user.statusKey === 'fertile' || user.statusKey === 'ovulation';
  const accent = user.statusKey === 'fertile' ? pal.fertile : pal.ovulation;

  return (
    <button
      onClick={() => onSelect(user.id)}
      className="focus-ring"
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        font: 'inherit',
        position: 'relative',
        background: pal.surface,
        borderRadius: 20,
        padding: '18px 18px 16px',
        color: pal.ink,
        border: `1px solid ${highlight ? 'transparent' : pal.line}`,
        outline: highlight ? `1.5px solid ${accent}` : 'none',
        outlineOffset: -1,
        boxShadow: highlight ? `0 1px 0 ${pal.line}, 0 18px 34px -24px rgba(50, 44, 39, 0.7)` : '0 1px 0 rgba(50, 44, 39, 0.03)',
        transition: 'transform 160ms ease, box-shadow 160ms ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
        <Avatar name={user.name} size={42} pal={pal} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 15.5, fontWeight: 700, color: pal.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: pal.muted }}>
            {user.age ? `${user.age} anos · ` : ''}ciclo {user.cycleLen}d
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <PhasePill user={user} pal={pal} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0 14px' }}>
        <CycleRing user={user} size={140} pal={pal} />
      </div>

      {user.hasData ? (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Metric label="Prox. periodo" value={formatDateShort(user.nextPeriod)} sub={formatDelta(user.daysToPeriod)} pal={pal} />
          <Metric label="Ovulacion" value={formatDateShort(user.ovulation)} sub={formatDelta(user.daysToOvulation)} pal={pal} />
        </div>
      ) : (
        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: pal.muted, textAlign: 'center', padding: '10px 0 14px' }}>
          Aun sin ciclos registrados
        </div>
      )}

      {user.symptoms?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[...new Set(user.symptoms)].slice(0, 4).map((symptom) => (
            <span
              key={symptom}
              style={{
                fontFamily: FONT_UI,
                fontSize: 11.5,
                color: pal.sub,
                background: pal.surface,
                border: `1px solid ${pal.line}`,
                padding: '4px 9px',
                borderRadius: 999
              }}
            >
              {symptom}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
