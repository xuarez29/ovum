import { getCycleDisplayUsers } from '../utils/cycleCalculations';
import { formatLongDate, getTodayInputValue } from '../utils/dateUtils';
import { arcilla, FONT_DISPLAY, FONT_UI } from '../theme/arcilla';
import UserCard from './UserCard';

function Legend({ pal }) {
  const items = [
    ['Periodo', pal.period],
    ['Ventana fertil', pal.fertile],
    ['Ovulacion', pal.ovulation]
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {items.map(([label, color]) => (
        <div key={label} className="flex items-center gap-2">
          <span style={{ width: 11, height: 11, borderRadius: 4, background: color }} />
          <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: pal.sub }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onAddUser, pal }) {
  return (
    <section
      className="text-center"
      style={{
        padding: '70px 20px',
        background: pal.surface,
        border: `1px solid ${pal.line}`,
        borderRadius: 24
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          margin: '0 auto 18px',
          background: `radial-gradient(circle at 35% 30%, ${pal.ovulationBg}, ${pal.periodBg})`,
          border: `1px solid ${pal.line}`
        }}
      />
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 500, color: pal.ink, margin: '0 0 8px' }}>
        Empieza tu primer seguimiento
      </h2>
      <p style={{ fontFamily: FONT_UI, fontSize: 14.5, color: pal.sub, margin: '0 auto 22px', maxWidth: 390, lineHeight: 1.5 }}>
        Agrega una usuaria y registra su ultimo periodo para ver fases, ovulacion y ventana fertil.
      </p>
      <button onClick={onAddUser} className="focus-ring rounded-full bg-[#322c27] px-5 py-3 text-sm font-bold text-white hover:bg-[#463b34]">
        Nueva usuaria
      </button>
    </section>
  );
}

export default function Dashboard({ users, onSelectUser, onAddUser, today = getTodayInputValue(), pal = arcilla }) {
  const computed = getCycleDisplayUsers(users, today);
  const fertileCount = computed.filter((user) => user.statusKey === 'fertile').length;
  const periodCount = computed.filter((user) => user.inPeriod).length;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p style={{ fontFamily: FONT_UI, color: pal.muted }} className="text-sm capitalize">{formatLongDate(today)}</p>
          <h2 style={{ fontFamily: FONT_DISPLAY, color: pal.ink }} className="text-4xl font-medium leading-tight md:text-5xl">
            Seguimiento del ciclo
          </h2>
        </div>
        <button onClick={onAddUser} className="focus-ring w-fit rounded-full bg-[#322c27] px-5 py-3 text-sm font-bold text-white hover:bg-[#463b34]">
          Nueva usuaria
        </button>
      </div>

      <div
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        style={{
          padding: '14px 18px',
          background: pal.surface,
          border: `1px solid ${pal.line}`,
          borderRadius: 16
        }}
      >
        <div className="flex flex-wrap items-baseline gap-2">
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: pal.ink }}>{computed.length}</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 14, color: pal.sub }}>
            usuarias en seguimiento
            {fertileCount > 0 && <span style={{ color: pal.fertile, fontWeight: 700 }}> · {fertileCount} en ventana fertil</span>}
            {periodCount > 0 && <span style={{ color: pal.period, fontWeight: 700 }}> · {periodCount} en periodo</span>}
          </span>
        </div>
        <Legend pal={pal} />
      </div>

      {computed.length === 0 ? (
        <EmptyState onAddUser={onAddUser} pal={pal} />
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {computed.map((user) => (
            <UserCard key={user.id} user={user} onSelect={onSelectUser} pal={pal} />
          ))}
          <button
            onClick={onAddUser}
            className="focus-ring min-h-[220px] rounded-[20px] border border-dashed border-[#d7c8ba] text-sm font-semibold text-[#9c9087] hover:bg-white/55"
          >
            <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#d7c8ba] text-xl">+</span>
            Agregar usuaria
          </button>
        </div>
      )}
    </section>
  );
}
