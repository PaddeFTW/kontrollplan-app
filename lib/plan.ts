export type ChecklistStatus = "ok" | "ej-ok" | "ej-kontrollerat" | "";
export interface ProjectInfo {
  fastighetsbeteckning: string; adress: string; postnr: string; ort: string;
  kontaktperson: string; kontaktMobil: string; kontaktEpost: string;
  bestallareNamn: string; bestallareOrgNr: string; entreprenorNamn: string; entreprenorOrgNr: string;
  projektledare: string; kma: string; arbetsledare: string; skyddsombud: string;
  basP: string; basU: string; handlaggare: string;
  entreprenadform: "total" | "utforande" | "";
  projektbeskrivning: string; startDatum: string; slutDatum: string;
  narmstaAkut: string; akutTelefon: string; akutAdress: string;
}
export interface PersonRow { id: string; role: string; name: string; mobile: string; email: string; extra: string; }
export interface ChecklistItem { id: string; title: string; status: ChecklistStatus; date: string; sign: string; note: string; }
export interface PlanRecord {
  id: string; updatedAt: string; project: ProjectInfo; policyNote: string;
  organization: PersonRow[]; workers: PersonRow[]; subcontractors: PersonRow[];
  checklist: ChecklistItem[]; safetyRounds: ChecklistItem[]; receipts: PersonRow[];
  approvalName: string; approvalDate: string;
}
export const STORAGE_KEY = "kontrollplan-app-v2";
export const PRODUCT_TITLE = "Kontrollplan";
export const emptyProject: ProjectInfo = {
  fastighetsbeteckning: "", adress: "", postnr: "", ort: "", kontaktperson: "", kontaktMobil: "", kontaktEpost: "",
  bestallareNamn: "", bestallareOrgNr: "", entreprenorNamn: "", entreprenorOrgNr: "",
  projektledare: "", kma: "", arbetsledare: "", skyddsombud: "", basP: "", basU: "", handlaggare: "",
  entreprenadform: "", projektbeskrivning: "", startDatum: "", slutDatum: "", narmstaAkut: "", akutTelefon: "", akutAdress: "",
};
function row(role = "", extraLabel = ""): PersonRow {
  return { id: crypto.randomUUID(), role, name: "", mobile: "", email: "", extra: extraLabel };
}
function item(id: string, title: string): ChecklistItem {
  return { id, title, status: "", date: "", sign: "", note: "" };
}
export const defaultOrganization: PersonRow[] = [
  row("Kontrollansvarig"), row("Byggherre"), row("Projektansvarig"), row("Arbetsledare"),
];
export const defaultChecklist: ChecklistItem[] = [
  item("grund", "Grundläggning och markarbeten"),
  item("stomme", "Stomme och bärande konstruktion"),
  item("tat", "Täthet och fuktspärrar"),
  item("el", "Elinstallationer"),
  item("vvs", "VVS-installationer"),
  item("vent", "Ventilation och injustering"),
  item("brand", "Brandskyddsåtgärder"),
  item("tillg", "Tillgänglighet"),
  item("energi", "Energiprestanda"),
  item("bruk", "Säkerhet i bruksskedet"),
  item("rel", "Relationshandlingar"),
  item("egen", "Koppling till egenkontroller"),
  item("besikt", "Kontrollbesiktning / slutbesiktning"),
  item("avvik", "Avvikelser dokumenterade"),
  item("ka", "Godkännande av kontrollansvarig"),
];
export const defaultSafetyRounds: ChecklistItem[] = [
  item("u1", "A-ritning / K-ritning som underlag"),
  item("u2", "VVS-/el-handlingar"),
  item("u3", "BBR / branschregler"),
  item("u4", "Bygglov / startbesked"),
  item("u5", "Kontrollansvarig certifierad"),
  item("u6", "Sakkunniga utsedda vid behov"),
  item("u7", "Egenkontroller kopplade"),
  item("u8", "Slutbesiktning planerad"),
  item("u9", "Åtgärder efter anmärkning"),
  item("u10", "Byggherre och KA överens"),
];
export function createEmptyPlan(): PlanRecord {
  return {
    id: crypto.randomUUID(), updatedAt: new Date().toISOString(), project: { ...emptyProject }, policyNote: "",
    organization: defaultOrganization.map((r) => ({ ...r, id: crypto.randomUUID() })),
    workers: [row("Projektör", "ansvarsområde")], subcontractors: [row("Entreprenör", "ansvarsområde")],
    checklist: defaultChecklist.map((c) => ({ ...c })), safetyRounds: defaultSafetyRounds.map((c) => ({ ...c })),
    receipts: [row("Kontrollansvarig"), row("Byggherre")], approvalName: "", approvalDate: "",
  };
}
export function loadPlans(): PlanRecord[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as PlanRecord[] : []; } catch { return []; }
}
export function savePlans(plans: PlanRecord[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(plans)); }
export function statusLabel(status: ChecklistStatus) {
  switch (status) {
    case "ok": return "1 – Godkänt";
    case "ej-ok": return "2 – Ej godkänt";
    case "ej-kontrollerat": return "3 – Ej kontrollerat";
    default: return "—";
  }
}
export function planProgress(plan: PlanRecord) {
  const all = [...plan.checklist, ...plan.safetyRounds];
  const done = all.filter((c) => c.status === "ok").length;
  return { done, total: all.length, percent: all.length ? Math.round((done / all.length) * 100) : 0 };
}
