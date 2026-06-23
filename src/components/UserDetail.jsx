import { ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { calculateCycle, toCycleDisplayUser } from '../utils/cycleCalculations';
import { formatDate } from '../utils/dateUtils';
import Avatar from './Avatar';
import CycleForm from './CycleForm';
import CycleRing from './CycleRing';
import PhasePill from './PhasePill';

export default function UserDetail({ user, showingCycleForm, onBack, onEdit, onDelete, onShowCycleForm, onCancelCycleForm, onAddCycle }) {
  const cycle = calculateCycle(user);
  const displayUser = toCycleDisplayUser(user);
  const cycles = [...(user.cycles || [])].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const symptoms = cycles.flatMap((item) => item.symptoms || []);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button onClick={onBack} className="focus-ring inline-flex w-fit items-center gap-2 rounded-full bg-[#fcf8f3] px-3 py-2 text-sm font-semibold text-arcillaSub hover:bg-[#f4eadf]">
          <ArrowLeft size={16} />
          Volver
        </button>
        <div className="flex flex-wrap gap-2">
          <button onClick={onShowCycleForm} className="focus-ring inline-flex items-center gap-2 rounded-full bg-ink px-3 py-2 text-sm font-bold text-white hover:bg-[#463b34]">
            <Plus size={16} />
            Nuevo ciclo
          </button>
          <button onClick={onEdit} className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#fcf8f3] px-3 py-2 text-sm font-semibold text-arcillaSub hover:bg-[#f4eadf]">
            <Edit size={16} />
            Editar datos
          </button>
          <button onClick={onDelete} className="focus-ring inline-flex items-center gap-2 rounded-full bg-coralSoft px-3 py-2 text-sm font-semibold text-period hover:bg-[#f3d8ce]">
            <Trash2 size={16} />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <article className="rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size={56} />
            <div>
              <h2 className="font-serif text-4xl font-medium text-ink">{user.name}</h2>
              <PhasePill user={displayUser} size="sm" />
            </div>
          </div>
          <dl className="mt-4 grid gap-3 text-sm text-slate-700">
            <Info label="Edad" value={user.age || 'No registrada'} />
            <Info label="Ciclo promedio" value={`${user.cycleLength || 28} dias`} />
            <Info label="Periodo promedio" value={`${user.periodLength || 5} dias`} />
            <Info label="Notas" value={user.notes || 'Sin notas'} />
          </dl>
        </article>

        <article className="rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
          <div className="grid gap-5 md:grid-cols-[160px_1fr] md:items-center">
            <div className="flex justify-center">
              <CycleRing user={displayUser} size={150} />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-medium text-ink">Resumen actual</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Metric label="Proximo periodo" value={formatDate(cycle?.nextPeriod)} />
                <Metric label="Ovulacion estimada" value={formatDate(cycle?.ovulationDate)} />
                <Metric label="Ventana fertil" value={`${formatDate(cycle?.fertileStart)} - ${formatDate(cycle?.fertileEnd)}`} />
                <Metric label="Estado actual" value={cycle?.status || 'Sin datos'} />
                <Metric label="Dias para ovulacion" value={cycle?.daysToOvulation ?? 'N/D'} />
                <Metric label="Dias para periodo" value={cycle?.daysToNextPeriod ?? 'N/D'} />
              </div>
            </div>
          </div>
        </article>
      </div>

      {showingCycleForm && (
        <article className="rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
          <h3 className="mb-4 font-serif text-2xl font-medium text-ink">Agregar ciclo</h3>
          <CycleForm onSave={onAddCycle} onCancel={onCancelCycleForm} />
        </article>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
          <h3 className="font-serif text-2xl font-medium text-ink">Historial de ciclos</h3>
          <div className="mt-4 space-y-3">
            {cycles.length ? cycles.map((item) => (
              <div key={item.id} className="rounded-2xl border border-arcillaLine bg-[#fcf8f3] p-3">
                <p className="font-medium text-ink">{formatDate(item.startDate)} {item.endDate ? `a ${formatDate(item.endDate)}` : ''}</p>
                {item.symptoms?.length ? <p className="mt-1 text-sm text-arcillaSub">Sintomas: {item.symptoms.join(', ')}</p> : null}
                {item.notes ? <p className="mt-1 text-sm text-arcillaSub">{item.notes}</p> : null}
              </div>
            )) : <p className="text-sm text-arcillaSub">No hay ciclos registrados.</p>}
          </div>
        </article>

        <article className="rounded-3xl border border-arcillaLine bg-white p-5 shadow-soft">
          <h3 className="font-serif text-2xl font-medium text-ink">Sintomas registrados</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {symptoms.length ? [...new Set(symptoms)].map((symptom) => (
              <span key={symptom} className="rounded-full border border-arcillaLine bg-[#fcf8f3] px-3 py-1.5 text-sm text-arcillaSub">{symptom}</span>
            )) : <p className="text-sm text-arcillaSub">Sin sintomas guardados.</p>}
          </div>
        </article>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="font-semibold text-arcillaMuted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#fcf8f3] p-3">
      <p className="text-xs font-semibold uppercase tracking-normal text-arcillaMuted">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}
