import { addDays, differenceInDays, getTodayInputValue, isDateBetween } from './dateUtils.js';

export function getLatestCycle(user) {
  const cycles = user.cycles?.length
    ? user.cycles
    : [{ startDate: user.lastPeriodStart, endDate: '', notes: '' }];

  return [...cycles]
    .filter((cycle) => cycle.startDate)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
}

export function calculateCycle(user, today = getTodayInputValue()) {
  const latestCycle = getLatestCycle(user);
  if (!latestCycle?.startDate) return null;

  const cycleLength = Number(user.cycleLength) || 28;
  const periodLength = Number(user.periodLength) || 5;
  const lastPeriodStart = latestCycle.startDate;
  const periodEnd = latestCycle.endDate || addDays(lastPeriodStart, periodLength - 1);
  const nextPeriod = addDays(lastPeriodStart, cycleLength);
  const ovulationDate = addDays(nextPeriod, -14);
  const fertileStart = addDays(ovulationDate, -5);
  const fertileEnd = addDays(ovulationDate, 1);
  const daysToOvulation = differenceInDays(today, ovulationDate);
  const daysToNextPeriod = differenceInDays(today, nextPeriod);

  const inPeriod = isDateBetween(today, lastPeriodStart, periodEnd);
  const inFertileWindow = isDateBetween(today, fertileStart, fertileEnd);
  const nearOvulation = daysToOvulation !== null && daysToOvulation >= 0 && daysToOvulation <= 3;
  const nearPeriod = daysToNextPeriod !== null && daysToNextPeriod >= 0 && daysToNextPeriod <= 3;

  let status = 'Fase folicular';
  if (inPeriod) status = 'En periodo';
  else if (nearPeriod) status = 'Próximo periodo cercano';
  else if (inFertileWindow) status = 'Ventana fértil';
  else if (nearOvulation) status = 'Cerca de ovulación';
  else if (daysToOvulation !== null && daysToOvulation < 0) status = 'Fase lútea';

  return {
    lastPeriodStart,
    periodEnd,
    nextPeriod,
    ovulationDate,
    fertileStart,
    fertileEnd,
    daysToOvulation,
    daysToNextPeriod,
    status,
    priority: getPriority(status, daysToOvulation)
  };
}

export function getPriority(status, daysToOvulation) {
  if (status === 'En periodo' || status === 'Próximo periodo cercano') return 'period';
  if (status === 'Ventana fértil') return 'fertile';
  if (status === 'Cerca de ovulación') return 'near';
  if (daysToOvulation !== null && daysToOvulation >= 0 && daysToOvulation <= 7) return 'watch';
  return 'far';
}

export function sortUsersByCyclePriority(users, today = getTodayInputValue()) {
  const rank = {
    fertile: 0,
    near: 1,
    watch: 2,
    period: 3,
    far: 4
  };

  return [...users].sort((a, b) => {
    const cycleA = calculateCycle(a, today);
    const cycleB = calculateCycle(b, today);
    const priorityA = rank[cycleA?.priority] ?? 99;
    const priorityB = rank[cycleB?.priority] ?? 99;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return Math.abs(cycleA?.daysToOvulation ?? 999) - Math.abs(cycleB?.daysToOvulation ?? 999);
  });
}

export function toCycleDisplayUser(user, today = getTodayInputValue()) {
  const cycle = calculateCycle(user, today);
  const cycleLen = Number(user.cycleLength) || 28;
  const periodLen = Number(user.periodLength) || 5;
  const latest = getLatestCycle(user);

  if (!cycle) {
    return {
      ...user,
      cycleLen,
      periodLen,
      hasData: false,
      status: 'Sin registros',
      statusKey: 'normal',
      symptoms: latest?.symptoms || []
    };
  }

  const statusKey = getStatusKey(cycle.status);
  const dayOfCycle = Math.max(1, differenceInDays(cycle.lastPeriodStart, today) + 1);
  const ovDay = Math.max(1, differenceInDays(cycle.lastPeriodStart, cycle.ovulationDate) + 1);
  const fertStartDay = Math.max(1, differenceInDays(cycle.lastPeriodStart, cycle.fertileStart) + 1);
  const fertEndDay = Math.max(1, differenceInDays(cycle.lastPeriodStart, cycle.fertileEnd) + 1);

  return {
    ...user,
    cycleLen,
    periodLen,
    hasData: true,
    status: normalizeStatus(cycle.status),
    statusKey,
    lastStart: cycle.lastPeriodStart,
    nextPeriod: cycle.nextPeriod,
    ovulation: cycle.ovulationDate,
    fertileStart: cycle.fertileStart,
    fertileEnd: cycle.fertileEnd,
    dayOfCycle,
    ovDay,
    fertStartDay,
    fertEndDay,
    daysToPeriod: cycle.daysToNextPeriod,
    daysToOvulation: cycle.daysToOvulation,
    inPeriod: cycle.status === 'En periodo',
    symptoms: latest?.symptoms || []
  };
}

export function getCycleDisplayUsers(users, today = getTodayInputValue()) {
  return sortUsersByCyclePriority(users, today).map((user) => toCycleDisplayUser(user, today));
}

function getStatusKey(status) {
  if (status === 'En periodo' || status === 'Próximo periodo cercano') return 'period';
  if (status === 'Ventana fértil') return 'fertile';
  if (status === 'Cerca de ovulación') return 'ovulation';
  return 'normal';
}

function normalizeStatus(status) {
  if (status === 'Cerca de ovulación') return 'Ovulación pronto';
  if (status === 'Próximo periodo cercano') return 'Periodo pronto';
  return status;
}
