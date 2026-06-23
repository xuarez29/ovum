import { useState } from 'react';
import { symptomOptions } from '../data/symptomOptions';

export default function CycleForm({ onSave, onCancel }) {
  const [form, setForm] = useState({ startDate: '', endDate: '', symptoms: [], notes: '' });
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleSymptom(symptom) {
    setForm((current) => ({
      ...current,
      symptoms: current.symptoms.includes(symptom)
        ? current.symptoms.filter((item) => item !== symptom)
        : [...current.symptoms, symptom]
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.startDate) {
      setError('La fecha de inicio del periodo es obligatoria.');
      return;
    }
    if (form.endDate && form.endDate < form.startDate) {
      setError('La fecha de fin no puede ser anterior al inicio.');
      return;
    }
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Inicio del periodo</span>
          <input type="date" value={form.startDate} onChange={(event) => updateField('startDate', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-semibold text-arcillaSub">Fin opcional</span>
          <input type="date" value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
        </label>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-arcillaSub">Sintomas registrados</p>
        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((symptom) => (
            <button
              type="button"
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`focus-ring rounded-md border px-3 py-1.5 text-sm ${
                form.symptoms.includes(symptom)
                  ? 'border-period bg-coralSoft text-period'
                  : 'border-arcillaLine bg-white text-arcillaSub hover:bg-[#fcf8f3]'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-semibold text-arcillaSub">Notas libres</span>
        <textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} rows="3" className="focus-ring w-full rounded-xl border border-arcillaLine bg-[#fcf8f3] px-3 py-2 text-ink" />
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="focus-ring rounded-full bg-[#fcf8f3] px-4 py-2 text-sm font-semibold text-arcillaSub hover:bg-[#f4eadf]">Cancelar</button>
        <button className="focus-ring rounded-full bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-[#463b34]">Guardar ciclo</button>
      </div>
    </form>
  );
}
