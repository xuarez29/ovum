import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  age: '',
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: '',
  notes: ''
};

export default function UserForm({ user, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(user ? { ...initialForm, ...user } : initialForm);
    setError('');
  }, [user]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (!form.lastPeriodStart) {
      setError('La fecha de inicio del último periodo es obligatoria.');
      return;
    }
    if (Number(form.cycleLength) < 15 || Number(form.cycleLength) > 60) {
      setError('La duración del ciclo debe estar entre 15 y 60 días.');
      return;
    }
    if (Number(form.periodLength) < 1 || Number(form.periodLength) > 15) {
      setError('La duración del periodo debe estar entre 1 y 15 días.');
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      age: form.age ? Number(form.age) : '',
      cycleLength: Number(form.cycleLength) || 28,
      periodLength: Number(form.periodLength) || 5
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Nombre</span>
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Edad opcional</span>
          <input type="number" min="1" value={form.age} onChange={(event) => updateField('age', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Duracion promedio del ciclo</span>
          <input type="number" min="15" max="60" value={form.cycleLength} onChange={(event) => updateField('cycleLength', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Duracion promedio del periodo</span>
          <input type="number" min="1" max="15" value={form.periodLength} onChange={(event) => updateField('periodLength', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm font-semibold text-arcillaSub">Inicio del ultimo periodo</span>
          <input type="date" value={form.lastPeriodStart} onChange={(event) => updateField('lastPeriodStart', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm font-semibold text-arcillaSub">Notas opcionales</span>
          <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows="3" className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="focus-ring rounded-full bg-[#fcf8f3] px-4 py-2 text-sm font-semibold text-arcillaSub hover:bg-[#f4eadf]">Cancelar</button>
        <button className="focus-ring rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-[#463b34]">Guardar</button>
      </div>
    </form>
  );
}
