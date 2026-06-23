// src/utils/cycleCalculations.js
// Lógica de cálculo del ciclo (sin cambios respecto a las reglas de Ovum):
//   - Próximo periodo = inicio del último periodo + duración promedio del ciclo
//   - Ovulación estimada = próximo periodo - 14 días
//   - Ventana fértil = 5 días antes de ovulación hasta 1 día después
//   - "cerca" si faltan 3 días o menos para ovulación o periodo
//
// Acepta un `user` con la forma:
//   { id, name, age, cycles: [{ start: 'YYYY-MM-DD', end?: 'YYYY-MM-DD',
//     symptoms?: string[], note?: string }], settings?: { avgCycle, periodDuration } }
//
// Devuelve el user enriquecido con todo lo que la UI necesita.

import { parseDate, addDays, diffDays, startOfToday } from "./dateUtils";

const DEFAULT_CYCLE = 28;
const DEFAULT_PERIOD = 5;

function averageCycleLength(cycles) {
  if (!cycles || cycles.length < 2) return null;
  const starts = cycles
    .map((c) => parseDate(c.start))
    .sort((a, b) => a - b);
  let sum = 0;
  for (let i = 1; i < starts.length; i++) sum += diffDays(starts[i - 1], starts[i]);
  return Math.round(sum / (starts.length - 1));
}

function averagePeriodDuration(cycles) {
  const durations = (cycles || [])
    .filter((c) => c.end)
    .map((c) => diffDays(parseDate(c.start), parseDate(c.end)) + 1)
    .filter((n) => n > 0 && n < 12);
  if (!durations.length) return null;
  return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
}

export function computeCycle(user, today = startOfToday()) {
  const cycles = user.cycles || [];
  const latest = cycles.length
    ? cycles.reduce((a, b) => (parseDate(a.start) > parseDate(b.start) ? a : b))
    : null;

  const lastStart = latest ? parseDate(latest.start) : null;
  const cycleLen = user.settings?.avgCycle || averageCycleLength(cycles) || DEFAULT_CYCLE;
  const periodLen = user.settings?.periodDuration || averagePeriodDuration(cycles) || DEFAULT_PERIOD;

  // Sin historial: estado vacío.
  if (!lastStart) {
    return {
      ...user, cycleLen, periodLen, hasData: false,
      status: "Sin registros", statusKey: "normal", priority: -1,
      symptoms: latest?.symptoms || [],
    };
  }

  const nextPeriod = addDays(lastStart, cycleLen);
  const ovulation = addDays(nextPeriod, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  const dayOfCycle = diffDays(lastStart, today) + 1; // 1-indexado
  const ovDay = diffDays(lastStart, ovulation) + 1;
  const fertStartDay = diffDays(lastStart, fertileStart) + 1;
  const fertEndDay = diffDays(lastStart, fertileEnd) + 1;

  const daysToPeriod = diffDays(today, nextPeriod);
  const daysToOvulation = diffDays(today, ovulation);

  const inPeriod = dayOfCycle >= 1 && dayOfCycle <= periodLen;
  const inFertile = dayOfCycle >= fertStartDay && dayOfCycle <= fertEndDay;
  const isOvulationDay = dayOfCycle === ovDay;
  const ovulationNear = daysToOvulation >= 0 && daysToOvulation <= 3;
  const periodNear = daysToPeriod >= 0 && daysToPeriod <= 3;

  // Estado + prioridad (mayor = más arriba en el dashboard).
  let status, statusKey, priority;
  if (isOvulationDay) { status = "Ovulación hoy"; statusKey = "ovulation"; priority = 100; }
  else if (inFertile && ovulationNear) { status = "Ventana fértil"; statusKey = "fertile"; priority = 95; }
  else if (inFertile) { status = "Ventana fértil"; statusKey = "fertile"; priority = 85; }
  else if (ovulationNear) { status = "Ovulación pronto"; statusKey = "ovulation"; priority = 80; }
  else if (inPeriod) { status = "En periodo"; statusKey = "period"; priority = 60; }
  else if (periodNear) { status = "Periodo pronto"; statusKey = "period"; priority = 50; }
  else { status = "En equilibrio"; statusKey = "normal"; priority = 10; }

  return {
    ...user, cycleLen, periodLen, hasData: true,
    lastStart, nextPeriod, ovulation, fertileStart, fertileEnd,
    dayOfCycle, ovDay, fertStartDay, fertEndDay,
    daysToPeriod, daysToOvulation,
    inPeriod, inFertile, isOvulationDay, ovulationNear, periodNear,
    status, statusKey, priority,
    symptoms: latest?.symptoms || [],
    note: latest?.note || "",
  };
}

// Calcula todas las usuarias y las ordena por prioridad del ciclo.
export function computeAndSort(users, today = startOfToday()) {
  return users.map((u) => computeCycle(u, today)).sort((a, b) => b.priority - a.priority);
}
