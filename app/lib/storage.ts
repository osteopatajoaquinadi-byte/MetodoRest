/* ── Types ── */

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  gender?: string;
  sleepGoal?: string;
  onboardingCompletedAt: string;
  createdAt: string;
}

export interface OnboardingStatus {
  profileCompleted: boolean;
  basalCompleted: boolean;
  completedAt?: string;
}

export interface ResetQResult {
  h: number[];
  a: number[];
  r: number[];
  i: number[];
  b: boolean[];
  scoreH: number;
  scoreA: number;
  scoreR: number;
  scoreI: number;
  scoreB: number;
  global: number;
  phenotype: string;
  band: string;
  date: string;
}

export interface SSSResult {
  score: number;
  date: string;
}

export interface BasalEvaluation {
  resetq: ResetQResult;
  sss: SSSResult;
  completedAt: string;
}

export interface PeriodicEvaluation {
  id: string;
  weekNumber: number;
  resetq: ResetQResult;
  sss: SSSResult;
  completedAt: string;
}

export interface DailyHabitRecord {
  date: string;
  habits: Record<string, boolean>;
  completedCount: number;
  totalCount: number;
}

/* ── Storage keys ── */

const KEYS = {
  profile: "rest-user-profile",
  onboarding: "rest-onboarding-status",
  basal: "rest-basal-evaluation",
  periodic: "rest-periodic-evaluations",
  dailyHabits: "rest-daily-habits",
  programStart: "rest-program-start",
} as const;

function get<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

/* ── Profile ── */

export function getProfile(): UserProfile | null { return get<UserProfile>(KEYS.profile); }
export function setProfile(p: UserProfile): void { set(KEYS.profile, p); }

/* ── Onboarding ── */

export function getOnboardingStatus(): OnboardingStatus {
  return get<OnboardingStatus>(KEYS.onboarding) ?? { profileCompleted: false, basalCompleted: false };
}
export function setOnboardingStatus(s: OnboardingStatus): void { set(KEYS.onboarding, s); }

/* ── Evaluations ── */

export function getBasalEvaluation(): BasalEvaluation | null { return get<BasalEvaluation>(KEYS.basal); }
export function setBasalEvaluation(e: BasalEvaluation): void { set(KEYS.basal, e); }

export function getPeriodicEvaluations(): PeriodicEvaluation[] {
  return get<PeriodicEvaluation[]>(KEYS.periodic) ?? [];
}
export function addPeriodicEvaluation(e: PeriodicEvaluation): void {
  const existing = getPeriodicEvaluations();
  existing.push(e);
  set(KEYS.periodic, existing);
}

/* ── Habits ── */

export function getDailyHabits(date: string): DailyHabitRecord | null {
  const all = get<Record<string, DailyHabitRecord>>(KEYS.dailyHabits) ?? {};
  return all[date] ?? null;
}

export function setDailyHabits(record: DailyHabitRecord): void {
  const all = get<Record<string, DailyHabitRecord>>(KEYS.dailyHabits) ?? {};
  all[record.date] = record;
  set(KEYS.dailyHabits, all);
}

export function getAllDailyHabits(): Record<string, DailyHabitRecord> {
  return get<Record<string, DailyHabitRecord>>(KEYS.dailyHabits) ?? {};
}

/* ── Program timing ── */

export function getProgramStart(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEYS.programStart);
}
export function setProgramStart(date: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.programStart, date);
}

export function getCurrentDay(): number {
  const start = getProgramStart();
  if (!start) return 1;
  const diff = Date.now() - new Date(start).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
}

export function getCurrentWeek(): number {
  return Math.min(3, Math.ceil(getCurrentDay() / 7));
}

export function isEvaluationDue(): boolean {
  const day = getCurrentDay();
  const evals = getPeriodicEvaluations();
  if (day >= 21 && !evals.some((e) => e.weekNumber === 3)) return true;
  return false;
}

export function getEvaluationWeekDue(): number | null {
  const day = getCurrentDay();
  const evals = getPeriodicEvaluations();
  if (day >= 21 && !evals.some((e) => e.weekNumber === 3)) return 3;
  return null;
}

/* ── RESET-Q helpers ── */

export function getResetQBandLabel(global: number): string {
  if (global <= 15) return "Regulación preservada";
  if (global <= 29) return "Desregulación leve a moderada";
  if (global <= 45) return "Desregulación moderada a marcada";
  return "Desregulación marcada";
}

/* ── Streaks ── */

export function getStreakDays(): number {
  const all = getAllDailyHabits();
  const today = new Date();
  let streak = 0;
  for (let idx = 0; idx < 30; idx++) {
    const d = new Date(today);
    d.setDate(d.getDate() - idx);
    const key = d.toISOString().split("T")[0];
    const record = all[key];
    if (record && record.completedCount === record.totalCount && record.totalCount > 0) {
      streak++;
    } else if (idx > 0) { break; }
  }
  return streak;
}

export function getWeekCompletedDays(): number {
  const all = getAllDailyHabits();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  let count = 0;
  for (let idx = 0; idx < 7; idx++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const key = d.toISOString().split("T")[0];
    const record = all[key];
    if (record && record.completedCount === record.totalCount && record.totalCount > 0) count++;
  }
  return count;
}
