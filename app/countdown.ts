// Midnight in Brasilia: the same instant for visitors in every timezone.
export const TERM_START = Date.parse('2027-02-11T00:00:00-03:00');
export function remainingTime(now = Date.now()) {
 const total = Math.max(0, Math.ceil((TERM_START - now) / 1000));
 return {days: Math.floor(total / 86400), hours: Math.floor(total / 3600) % 24,
  minutes: Math.floor(total / 60) % 60, seconds: total % 60, complete: total === 0};
}
