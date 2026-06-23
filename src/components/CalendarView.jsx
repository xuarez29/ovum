import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { calculateCycle } from '../utils/cycleCalculations';
import { formatDate, getMonthMatrix, isDateBetween } from '../utils/dateUtils';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarView({ users, selectedUserId, onSelectUser }) {
  const now = new Date();
  const [visibleMonth, setVisibleMonth] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [mode, setMode] = useState('ovulation');
  const selectedUser = users.find((user) => user.id === selectedUserId) || users[0];
  const cycle = selectedUser ? calculateCycle(selectedUser) : null;
  const cells = useMemo(() => getMonthMatrix(visibleMonth.year, visibleMonth.month), [visibleMonth]);
  const ovulationsByDate = useMemo(() => getOvulationsByDate(users), [users]);
  const monthLabel = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' }).format(new Date(visibleMonth.year, visibleMonth.month, 1));

  function moveMonth(direction) {
    const date = new Date(visibleMonth.year, visibleMonth.month + direction, 1);
    setVisibleMonth({ year: date.getFullYear(), month: date.getMonth() });
  }

  if (!users.length) {
    return (
      <section className="rounded-3xl border border-dashed border-arcillaLine bg-white p-8 text-center shadow-soft">
        <h2 className="font-serif text-3xl font-medium text-ink">Calendario sin datos</h2>
        <p className="mt-2 text-arcillaSub">Agrega una usuaria para ver marcas de periodo, ovulacion y ventana fertil.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-medium text-ink">Calendario mensual</h2>
          <p className="text-sm text-arcillaSub">
            {mode === 'ovulation' ? 'Ovulacion de todas las usuarias.' : 'Ciclo completo de la usuaria seleccionada.'}
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="inline-flex rounded-full border border-arcillaLine bg-white p-1">
            <button
              onClick={() => setMode('ovulation')}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-bold transition ${mode === 'ovulation' ? 'bg-ink text-white' : 'text-arcillaSub hover:bg-[#fcf8f3]'}`}
            >
              Ovulacion global
            </button>
            <button
              onClick={() => setMode('cycle')}
              className={`focus-ring rounded-full px-4 py-2 text-sm font-bold transition ${mode === 'cycle' ? 'bg-ink text-white' : 'text-arcillaSub hover:bg-[#fcf8f3]'}`}
            >
              Ciclo individual
            </button>
          </div>
          {mode === 'cycle' && (
            <label className="space-y-1">
              <span className="text-sm font-semibold text-arcillaSub">Usuaria</span>
              <select value={selectedUser?.id} onChange={(event) => onSelectUser(event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-white px-3 py-2 text-ink md:w-64">
                {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </label>
          )}
        </div>
      </div>

      <article className="rounded-3xl border border-arcillaLine bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => moveMonth(-1)} className="focus-ring rounded-full bg-[#fcf8f3] p-2 text-arcillaSub hover:bg-[#f4eadf]" aria-label="Mes anterior">
            <ChevronLeft size={18} />
          </button>
          <h3 className="font-serif text-2xl font-medium capitalize text-ink">{monthLabel}</h3>
          <button onClick={() => moveMonth(1)} className="focus-ring rounded-full bg-[#fcf8f3] p-2 text-arcillaSub hover:bg-[#f4eadf]" aria-label="Mes siguiente">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-arcillaMuted">
          {weekDays.map((day) => <div key={day} className="py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, index) => (
            mode === 'ovulation'
              ? <OvulationCell key={`${date || 'blank'}-${index}`} date={date} ovulations={date ? ovulationsByDate[date] || [] : []} />
              : <CalendarCell key={`${date || 'blank'}-${index}`} date={date} cycle={cycle} />
          ))}
        </div>

        {mode === 'ovulation' ? (
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-arcillaSub">
            <Legend color="bg-ovulation" label="Dia de ovulacion" />
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-arcillaSub">
              <Legend color="bg-period" label="Periodo" />
              <Legend color="bg-ovulation" label="Ovulacion" />
              <Legend color="bg-lilacSoft border border-[#c9d9cd]" label="Ventana fertil" />
              <Legend color="bg-coralSoft border border-[#e7c7ba]" label="Proximo periodo" />
            </div>
            {cycle && (
              <p className="mt-3 text-sm text-arcillaSub">
                Ventana fertil: {formatDate(cycle.fertileStart)} - {formatDate(cycle.fertileEnd)}.
              </p>
            )}
          </>
        )}
      </article>
    </section>
  );
}

function getOvulationsByDate(users) {
  return users.reduce((acc, user) => {
    const cycle = calculateCycle(user);
    if (!cycle?.ovulationDate) return acc;
    if (!acc[cycle.ovulationDate]) acc[cycle.ovulationDate] = [];
    acc[cycle.ovulationDate].push(user);
    return acc;
  }, {});
}

function OvulationCell({ date, ovulations }) {
  if (!date) return <div className="aspect-square rounded-xl bg-[#fcf8f3]" />;

  const day = Number(date.slice(-2));
  const hasOvulation = ovulations.length > 0;
  const names = ovulations.map((user) => user.name).join(', ');

  return (
    <div
      className={`aspect-square overflow-hidden rounded-xl border p-1 text-sm ${
        hasOvulation ? 'border-ovulation bg-[#f7ead2] text-[#7d5510]' : 'border-arcillaLine bg-white text-ink'
      }`}
      title={hasOvulation ? names : undefined}
    >
      <span className="font-medium">{day}</span>
      {hasOvulation && (
        <div className="mt-1 space-y-1">
          {ovulations.slice(0, 3).map((user) => (
            <span key={user.id} className="block truncate rounded-full bg-ovulation px-2 py-0.5 text-[10px] font-bold leading-tight text-white">
              {user.name}
            </span>
          ))}
          {ovulations.length > 3 && (
            <span className="block rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold leading-tight text-[#7d5510]">
              +{ovulations.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarCell({ date, cycle }) {
  if (!date) return <div className="aspect-square rounded-xl bg-[#fcf8f3]" />;

  const day = Number(date.slice(-2));
  const isPeriod = cycle && isDateBetween(date, cycle.lastPeriodStart, cycle.periodEnd);
  const isFertile = cycle && isDateBetween(date, cycle.fertileStart, cycle.fertileEnd);
  const isOvulation = cycle && date === cycle.ovulationDate;
  const isNextPeriod = cycle && date === cycle.nextPeriod;

  let style = 'bg-white border-arcillaLine text-ink';
  if (isFertile) style = 'bg-lilacSoft border-[#c9d9cd] text-[#3f6748]';
  if (isPeriod) style = 'bg-coralSoft border-[#e7c7ba] text-period';
  if (isNextPeriod) style = 'bg-[#fff8eb] border-[#ead7bd] text-[#8a6326]';
  if (isOvulation) style = 'bg-ovulation border-ovulation text-white';

  return (
    <div className={`aspect-square rounded-xl border p-1 text-sm ${style}`}>
      <span className="font-medium">{day}</span>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
