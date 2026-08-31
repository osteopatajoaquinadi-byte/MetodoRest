import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/* ── Users ── */

export async function findUserByEmail(email: string) {
  const { data, error } = await supabase.from("mr_users").select("*").eq("email", email).limit(1).single();
  if (error) return null;
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.from("mr_users").select("*").eq("id", id).single();
  if (error) throw new Error("Usuario no encontrado");
  return data;
}

export async function createUser(fields: {
  email: string;
  nombre?: string;
  edad?: number;
  genero?: string;
  objetivo_sueno?: string;
  password_hash: string;
  perfil_completado?: boolean;
  fecha_registro?: string;
}) {
  const { data, error } = await supabase.from("mr_users").insert({
    email: fields.email,
    nombre: fields.nombre || "",
    edad: fields.edad || 0,
    genero: fields.genero || null,
    objetivo_sueno: fields.objetivo_sueno || null,
    password_hash: fields.password_hash,
    perfil_completado: fields.perfil_completado || false,
    fecha_registro: fields.fecha_registro || new Date().toISOString(),
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateUser(id: string, fields: Record<string, unknown>) {
  const { data, error } = await supabase.from("mr_users").update(fields).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function findUserByResetToken(token: string) {
  const { data, error } = await supabase.from("mr_users").select("*").eq("reset_token", token).limit(1).single();
  if (error) return null;
  return data;
}

/* ── Evaluations ── */

export async function createEvaluation(fields: {
  user_id: string;
  tipo: string;
  resetq_items?: unknown;
  resetq_score_h?: number;
  resetq_score_a?: number;
  resetq_score_r?: number;
  resetq_score_i?: number;
  resetq_score_b?: number;
  resetq_global?: number;
  resetq_phenotype?: string;
  resetq_band?: string;
  sss_score?: number;
}) {
  const { data, error } = await supabase.from("mr_evaluations").insert(fields).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getEvaluationsByUser(userId: string) {
  const { data, error } = await supabase.from("mr_evaluations").select("*").eq("user_id", userId).order("fecha", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

/* ── Daily Habits ── */

export async function upsertDailyHabit(fields: {
  user_id: string;
  fecha: string;
  semana_programa?: number;
  habitos_detalle?: unknown;
  completados: number;
  total: number;
  porcentaje: number;
}) {
  const { data, error } = await supabase.from("mr_daily_habits").upsert(fields, { onConflict: "user_id,fecha" }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getHabitsByUser(userId: string, dateFrom?: string) {
  let query = supabase.from("mr_daily_habits").select("*").eq("user_id", userId);
  if (dateFrom) query = query.gte("fecha", dateFrom);
  const { data, error } = await query.order("fecha", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

/* ── Admin ── */

export async function getAllUsers() {
  const { data, error } = await supabase.from("mr_users").select("*").order("fecha_registro", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getAllEvaluations() {
  const { data, error } = await supabase.from("mr_evaluations").select("*").order("fecha", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getAllHabits() {
  const { data, error } = await supabase.from("mr_daily_habits").select("*").order("fecha", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}
