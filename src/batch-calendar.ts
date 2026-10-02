import type { Batch } from '@ams/api-client';

export function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function weekDates(date: string) {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  const sunday = addDays(date, -day);
  return Array.from({ length: 7 }, (_, index) => addDays(sunday, index));
}

export function monthDates(month: string) {
  const first = `${month.slice(0, 7)}-01`;
  const start = addDays(first, -new Date(`${first}T00:00:00Z`).getUTCDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export function shiftMonth(month: string, offset: number) {
  const value = new Date(`${month.slice(0, 7)}-01T00:00:00Z`);
  value.setUTCMonth(value.getUTCMonth() + offset);
  return value.toISOString().slice(0, 10);
}

export function todayInZone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = (part: string) => parts.find(item => item.type === part)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function occursOn(batch: Pick<Batch, 'recurrence' | 'oneOffDate' | 'weekdays' | 'startsOn' | 'endsOn'>, date: string) {
  if (batch.recurrence === 'ONCE') return batch.oneOffDate === date;
  const weekday = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
  return date >= batch.startsOn && (!batch.endsOn || date <= batch.endsOn) && batch.weekdays.includes(weekday);
}

export function timeMinutes(value: string) {
  return Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5));
}

export function slotTimes(halfHour: number) {
  const format = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  return { startTime: format(halfHour * 30), endTime: format(Math.min(halfHour * 30 + 60, 1439)) };
}

export function batchWithAthlete(batch: Batch, athleteId: string) {
  const { name, branchId, tableId, recurrence, oneOffDate, weekdays, startsOn, endsOn, startTime, endTime, coachIds, athleteIds, active } = batch;
  return { name, branchId, tableId, recurrence, oneOffDate, weekdays, startsOn, endsOn, startTime, endTime, coachIds, athleteIds: athleteIds.includes(athleteId) ? athleteIds : [...athleteIds, athleteId], active };
}
