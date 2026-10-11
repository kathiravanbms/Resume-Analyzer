/** Deliberately simple, client-side checks. Supabase remains the source of truth. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** A legible 0–100 estimate of password strength, scored like a dimension. */
export function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = Math.min(value.length, 12) * 5; // up to 60
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 12;
  if (/\d/.test(value)) score += 12;
  if (/[^A-Za-z0-9]/.test(value)) score += 16;
  if (value.length >= 12) score += 6;
  return Math.max(0, Math.min(100, Math.round(score)));
}
