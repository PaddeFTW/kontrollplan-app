export type ChecklistStatus = "ok" | "ej-ok" | "ej-kontrollerat" | "";

export interface ProjectInfo {
  fastighetsbeteckning: string;
  adress: string;
  postnr: string;
  ort: string;
  kontaktperson: string;
  kontaktMobil: string;
  kontaktEpost: string;
  bestallareNamn: string;
  bestallareOrgNr: string;
  entreprenorNamn: string;
  entreprenorOrgNr: string;
  projektledare: string;
  kma: string;
  arbetsledare: string;
  skyddsombud: string;
  entreprenadform: "total" | "utforande" | "";
  projektbeskrivning: string;
  startDatum: string;
  slutDatum: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  status: ChecklistStatus;
  date: string;
  sign: string;
  note: string;
}

export interface PlanRecord {
  id: string;
  updatedAt: string;
  project: ProjectInfo;
  policyNote: string;
  checklist: ChecklistItem[];
}

export const STORAGE_KEY = "kontrollplan-app-v1";
export const PRODUCT_TITLE = "Kontrollplan";

export const emptyProject: ProjectInfo = {
  fastighetsbeteckning: "",
  adress: "",
  postnr: "",
  ort: "",
  kontaktperson: "",
  kontaktMobil: "",
  kontaktEpost: "",
  bestallareNamn: "",
  bestallareOrgNr: "",
  entreprenorNamn: "",
  entreprenorOrgNr: "",
  projektledare: "",
  kma: "",
  arbetsledare: "",
  skyddsombud: "",
  entreprenadform: "",
  projektbeskrivning: "",
  startDatum: "",
  slutDatum: "",
};

export const defaultChecklist: ChecklistItem[] = [
  { id: "grund", title: "Grundläggning och markarbeten", status: "", date: "", sign: "", note: "" },
  { id: "stomme", title: "Stomme och bärande konstruktion", status: "", date: "", sign: "", note: "" },
  { id: "tatning", title: "Täthet och fuktspärrar", status: "", date: "", sign: "", note: "" },
  { id: "installation_el", title: "Elinstallationer", status: "", date: "", sign: "", note: "" },
  { id: "installation_vvs", title: "VVS-installationer", status: "", date: "", sign: "", note: "" },
  { id: "ventilation", title: "Ventilation och injustering", status: "", date: "", sign: "", note: "" },
  { id: "brandskydd", title: "Brandskyddsåtgärder", status: "", date: "", sign: "", note: "" },
  { id: "tillganglighet", title: "Tillgänglighet", status: "", date: "", sign: "", note: "" },
  { id: "energi", title: "Energiprestanda", status: "", date: "", sign: "", note: "" },
  { id: "sakerhet", title: "Säkerhet i bruksskedet", status: "", date: "", sign: "", note: "" },
  { id: "dokument", title: "Relationshandlingar och dokumentation", status: "", date: "", sign: "", note: "" },
  { id: "egenkontroll", title: "Koppling till egenkontroller", status: "", date: "", sign: "", note: "" },
  { id: "besiktning", title: "Kontrollbesiktning / slutbesiktning", status: "", date: "", sign: "", note: "" },
  { id: "avvikelse", title: "Avvikelser och åtgärder dokumenterade", status: "", date: "", sign: "", note: "" },
  { id: "godkannande", title: "Godkännande av kontrollansvarig/beställare", status: "", date: "", sign: "", note: "" }
];

export function createEmptyPlan(): PlanRecord {
  return {
    id: crypto.randomUUID(),
    updatedAt: new Date().toISOString(),
    project: { ...emptyProject },
    policyNote: "",
    checklist: defaultChecklist.map((item) => ({ ...item })),
  };
}

export function loadPlans(): PlanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PlanRecord[];
  } catch {
    return [];
  }
}

export function savePlans(plans: PlanRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function statusLabel(status: ChecklistStatus) {
  switch (status) {
    case "ok":
      return "1 – Godkänt";
    case "ej-ok":
      return "2 – Ej godkänt";
    case "ej-kontrollerat":
      return "3 – Ej kontrollerat";
    default:
      return "—";
  }
}

export function planProgress(plan: PlanRecord) {
  const done = plan.checklist.filter((c) => c.status === "ok").length;
  return {
    done,
    total: plan.checklist.length,
    percent: Math.round((done / plan.checklist.length) * 100),
  };
}
