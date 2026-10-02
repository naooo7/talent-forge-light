// Institution accent layer + appearance preference (local to this browser only).
// Colors live in src/styles.css under [data-institution="..."]; this file holds identity + persistence.
import { useSyncExternalStore } from "react";
import pknStanLogo from "@/assets/logo-pkn-stan.png.asset.json";
import unairLogo from "@/assets/logo-unair.png.asset.json";

export type InstitutionId = "pknstan" | "unpad" | "ui" | "itb" | "unair";
export type Appearance = "light" | "dark" | "system";

export type Institution = {
  id: InstitutionId;
  short: string;
  name: string;
  /** Swatch for the selector (light-mode accent). */
  swatch: string;
  /** Official logo asset, when available. */
  logo?: string;
};

export const institutions: Institution[] = [
  { id: "pknstan", short: "PKN STAN", name: "Politeknik Keuangan Negara STAN", swatch: "oklch(0.42 0.12 255)", logo: pknStanLogo.url },
  { id: "unpad", short: "Unpad", name: "Universitas Padjadjaran", swatch: "oklch(0.6 0.17 48)" },
  { id: "ui", short: "UI", name: "Universitas Indonesia", swatch: "oklch(0.78 0.15 88)" },
  { id: "itb", short: "ITB", name: "Institut Teknologi Bandung", swatch: "oklch(0.5 0.17 265)" },
  { id: "unair", short: "UNAIR", name: "Universitas Airlangga", swatch: "oklch(0.5 0.13 250)", logo: unairLogo.url },
];

export const findInstitution = (id: string | null) => institutions.find((i) => i.id === id) ?? null;

const INST_KEY = "fundamental.institution.v1";
const APPEAR_KEY = "fundamental.appearance.v1";
const THEME_KEY = "fundamental.institution-theme.v1";

/** Inline, pre-paint script: applies saved accent + appearance before hydration (no flash). */
export const bootScript = `(function(){try{var d=document.documentElement;var i=localStorage.getItem("${INST_KEY}");var t=localStorage.getItem("${THEME_KEY}");if(i&&t!=="off")d.setAttribute("data-institution",i);var a=localStorage.getItem("${APPEAR_KEY}")||"light";var dk=a==="dark"||(a==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dk);}catch(e){}})();`;

type Prefs = { institution: InstitutionId | null; appearance: Appearance; themeEnabled: boolean };
const serverPrefs: Prefs = { institution: null, appearance: "light", themeEnabled: true };
let cache: Prefs | null = null;
const listeners = new Set<() => void>();

function read(): Prefs {
  if (cache) return cache;
  try {
    const i = localStorage.getItem(INST_KEY);
    const a = localStorage.getItem(APPEAR_KEY) as Appearance | null;
    const t = localStorage.getItem(THEME_KEY);
    cache = {
      institution: findInstitution(i)?.id ?? null,
      appearance: a === "dark" || a === "system" ? a : "light",
      themeEnabled: t !== "off",
    };
  } catch {
    cache = serverPrefs;
  }
  return cache;
}

function applyAppearance(a: Appearance) {
  const dark = a === "dark" || (a === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/** Applies (or clears) the data-institution attribute from current prefs. */
function applyInstitutionAttr() {
  const { institution, themeEnabled } = read();
  if (institution && themeEnabled) document.documentElement.setAttribute("data-institution", institution);
  else document.documentElement.removeAttribute("data-institution");
}

function emit() {
  listeners.forEach((l) => l());
}

export function setInstitution(id: InstitutionId | null) {
  cache = { ...read(), institution: id };
  try {
    if (id) localStorage.setItem(INST_KEY, id);
    else localStorage.removeItem(INST_KEY);
  } catch {
    /* storage disabled */
  }
  applyInstitutionAttr();
  emit();
}

/** Toggles the institution accent without losing the selected institution identity. */
export function setThemeEnabled(on: boolean) {
  cache = { ...read(), themeEnabled: on };
  try {
    if (on) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, "off");
  } catch {
    /* storage disabled */
  }
  applyInstitutionAttr();
  emit();
}

export function setAppearance(a: Appearance) {
  cache = { ...read(), appearance: a };
  try {
    localStorage.setItem(APPEAR_KEY, a);
  } catch {
    /* storage disabled */
  }
  applyAppearance(a);
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  const mq = matchMedia("(prefers-color-scheme: dark)");
  const onScheme = () => {
    if (read().appearance === "system") applyAppearance("system");
  };
  mq.addEventListener("change", onScheme);
  return () => {
    listeners.delete(l);
    mq.removeEventListener("change", onScheme);
  };
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, read, () => serverPrefs);
}

export function useInstitution() {
  return findInstitution(usePrefs().institution);
}
