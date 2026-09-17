#!/usr/bin/env node
// erzeuge-personen-vorlage.js — Stufe 2 (PLAN-STUFE2.md §3/§6)
// Invariante 2: profiles/<name>/.vorlage/ wird AUSSCHLIESSLICH hier erzeugt —
// Neugenerierung (rm + frische Kopie aus profiles/.vorlage) statt Patchen.
// Prüft Kategorie-A-Pflichtfelder (required:true ∧ Kategorie A) gegen platzhalter.json,
// baut dann per build_template.js --data profil.json die Personen-Vorlage.
// CLI: node scripts/erzeuge-personen-vorlage.js <name>

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO = path.resolve(__dirname, "..");
const PROFILES = path.resolve(REPO, "..", "profiles");

// §4 PLAN-STUFE2.md — Kategorie A (37), verbindlich. B-Felder gehören in bewerbung.json.
const KATEGORIE_A = [
  "AUSBILDUNGSBERUF", "BEWERBER_NAME", "BEWERBER_STRASSE", "BEWERBER_PLZ_ORT",
  "BEWERBER_TELEFON", "BEWERBER_EMAIL", "BEWERBER_WEBSITE", "BEWERBER_GEBURTSDATUM",
  "BEWERBER_GEBURTSORT", "BEWERBER_ORT", "SCHULE_1_ZEITRAUM", "SCHULE_1_NAME",
  "SCHULE_1_ORT", "SCHULE_1_ABSCHLUSS", "SCHULE_1_ABSCHLUSS_MONAT", "SCHULE_2_ZEITRAUM",
  "SCHULE_2_NAME", "SCHULE_2_ORT", "PRAKTIKUM_1_ZEITRAUM", "PRAKTIKUM_1_BEREICH",
  "PRAKTIKUM_1_UNTERNEHMEN", "PRAKTIKUM_1_ORT", "PRAKTIKUM_2_ZEITRAUM",
  "PRAKTIKUM_2_BEREICH", "PRAKTIKUM_2_UNTERNEHMEN", "PRAKTIKUM_2_ORT",
  "KENNTNIS_SOFTWARE", "KENNTNIS_SOFTWARE_LEVEL", "KENNTNIS_SPRACHE",
  "KENNTNIS_SPRACHE_LEVEL", "KENNTNIS_CAD", "STAERKE_1", "STAERKE_2", "STAERKE_3",
  "HOBBY_1", "HOBBY_2", "HOBBY_3",
];

const name = process.argv[2];
if (!name || !/^[A-Za-z0-9_][A-Za-z0-9_-]*$/.test(name)) {
  console.error("FEHLER: Nutzung: node scripts/erzeuge-personen-vorlage.js <name> (Name: Buchstaben/Zahlen/_/-, kein Pfadanteil)");
  process.exit(1);
}

const personDir = path.join(PROFILES, name);
const profilPfad = path.join(personDir, "profil.json");
const vorlageRoot = path.join(PROFILES, ".vorlage");
const personVorlage = path.join(personDir, ".vorlage");

if (!fs.existsSync(personDir) || !fs.statSync(personDir).isDirectory()) {
  console.error(`FEHLER: Profilordner ${personDir} existiert nicht (zuerst Gerüst anlegen).`);
  process.exit(1);
}
if (!fs.existsSync(profilPfad)) {
  console.error(`FEHLER: ${profilPfad} fehlt.`);
  process.exit(1);
}
if (!fs.existsSync(path.join(vorlageRoot, "build", "build_template.js"))) {
  console.error(`FEHLER: ${vorlageRoot} ist nicht aktuell. Zuerst ausführen: node scripts/sync-vorlage.js`);
  process.exit(1);
}

let profil;
try {
  profil = JSON.parse(fs.readFileSync(profilPfad, "utf-8"));
} catch (e) {
  console.error(`FEHLER: ${profilPfad} ist kein gültiges JSON: ${e.message}`);
  process.exit(1);
}

const platzhalter = JSON.parse(fs.readFileSync(path.join(vorlageRoot, "platzhalter.json"), "utf-8"));
const pflichtA = platzhalter.platzhalter.filter((p) => p.required === true && KATEGORIE_A.includes(p.key));
const fremd = platzhalter.platzhalter.filter((p) => KATEGORIE_A.includes(p.key));
if (fremd.length !== KATEGORIE_A.length) {
  console.error(`FEHLER: Kategorie-A-Liste (§4, ${KATEGORIE_A.length}) und platzhalter.json (${fremd.length} Schnittpunkte) weichen ab — Stimmigkeit prüfen, kein Build.`);
  process.exit(1);
}
const leer = pflichtA
  .filter((p) => profil[p.key] === undefined || profil[p.key] === null || profil[p.key] === "")
  .map((p) => p.key);
if (leer.length > 0) {
  console.error(`FEHLER: Pflicht-Kategorie-A-Felder leer oder fehlend (${leer.length}):`);
  for (const k of leer) console.error(`  - ${k}`);
  console.error("Werte erst im Interview/Nutzer-Gespräch erheben (AGENT.md, Phase 0–3) — nie raten.");
  process.exit(1);
}

// Neugenerierung der Personen-Vorlage (Invariante 2)
fs.rmSync(personVorlage, { recursive: true, force: true });
fs.cpSync(vorlageRoot, personVorlage, { recursive: true });

const ergebnis = spawnSync(process.execPath, [
  path.join(personVorlage, "build", "build_template.js"),
  "--data", profilPfad,
], { stdio: "inherit" });
if (ergebnis.status !== 0) {
  console.error("FEHLER: build_template.js schlug fehl.");
  process.exit(1);
}

const docx = path.join(personVorlage, "Bewerbungsmappe_Vorlage.docx");
if (!fs.existsSync(docx)) {
  console.error(`FEHLER: erwartete Ausgabe ${docx} nicht gefunden.`);
  process.exit(1);
}
console.log(`OK: Personen-Vorlage neu generiert: ${docx}`);
