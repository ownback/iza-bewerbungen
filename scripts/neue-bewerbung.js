#!/usr/bin/env node
// neue-bewerbung.js — Stufe 2 (PLAN-STUFE2.md §3/§6)
// Invariante 3: Bewerbungsordner entstehen AUSSCHLIESSLICH durch dieses Skript.
// Legt profiles/<name>/<firma-slug>/ an, kopiert die Personen-.vorlage-DOCX,
// erzeugt bewerbung.json (21 Kategorie-B-Keys = null) und leere
// stellenanzeige.md + interview.md (extrahierte Fakten, KEINE Seitenkopie).
// CLI: node scripts/neue-bewerbung.js <name> <firma>

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const PROFILES = path.resolve(REPO, "..", "profiles");

// §4 PLAN-STUFE2.md — Kategorie B (21), verbindlich.
const KATEGORIE_B = [
  "FIRMA_NAME", "FIRMA_ABTEILUNG", "FIRMA_ANSPRECHPARTNER", "FIRMA_STRASSE",
  "FIRMA_PLZ_ORT", "DATUM_ANSCHREIBEN", "DATUM_LEBENSLAUF", "DATUM_MOTIVATION",
  "STELLE_FUNDORT_REFNR", "ANSCHREIBEN_EINSTIEG", "ANSCHREIBEN_BERUF",
  "ANSCHREIBEN_PRAXIS", "ANSCHREIBEN_ABSCHLUSS", "ANSCHREIBEN_SCHLUSS",
  "MOTIVATION_LEITFRAGE", "MOTIVATION_EINSTIEG", "MOTIVATION_TECHNIK_GESTALTUNG",
  "MOTIVATION_PASSUNG", "MOTIVATION_LERNZIEL", "MOTIVATION_AUSBLICK",
  "ANLAGE_WEITERE",
];

const name = process.argv[2];
const firma = process.argv[3];
if (!name || !/^[A-Za-z0-9_][A-Za-z0-9_-]*$/.test(name)) {
  console.error("FEHLER: Nutzung: node scripts/neue-bewerbung.js <name> <firma>");
  process.exit(1);
}
if (!firma || firma.trim() === "") {
  console.error("FEHLER: Nutzung: node scripts/neue-bewerbung.js <name> <firma> (firma darf nicht leer sein)");
  process.exit(1);
}

const personDir = path.join(PROFILES, name);
const docxQuelle = path.join(personDir, ".vorlage", "Bewerbungsmappe_Vorlage.docx");
if (!fs.existsSync(docxQuelle)) {
  console.error(`FEHLER: ${docxQuelle} fehlt. Zuerst ausführen: node scripts/erzeuge-personen-vorlage.js ${name}`);
  process.exit(1);
}

// Slug: lowercase, Leerzeichen → -, Sonderzeichen entfernt, Mehrfachstriche/Außenstriche bereinigt
const slug = firma
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "")
  .replace(/-+/g, "-")
  .replace(/^-|-$/g, "");
if (slug === "") {
  console.error(`FEHLER: aus "${firma}" ergibt sich kein gültiger Slug.`);
  process.exit(1);
}

const ziel = path.join(personDir, slug);
if (fs.existsSync(ziel)) {
  console.error(`FEHLER: ${ziel} existiert bereits — bestehende Bewerbungen werden nie überschrieben.`);
  process.exit(1);
}

fs.mkdirSync(ziel, { recursive: true });
fs.copyFileSync(docxQuelle, path.join(ziel, `Bewerbungsmappe_${slug}.docx`));
fs.writeFileSync(
  path.join(ziel, "bewerbung.json"),
  JSON.stringify({
    _kommentar: "Kategorie B (§4 PLAN-STUFE2.md): Felder pro Bewerbung. Werte nach Interview (AGENT.md Phase 2–3) setzen; null = Platzhalter bleibt sichtbar, optionale Zeilen entfallen. Merge: profil.json + bewerbung.json, bewerbung gewinnt.",
    ...Object.fromEntries(KATEGORIE_B.map((k) => [k, null])),
  }, null, 2) + "\n",
);
fs.writeFileSync(path.join(ziel, "stellenanzeige.md"), "");
fs.writeFileSync(path.join(ziel, "interview.md"), "");

console.log(`OK: Bewerbungsordner angelegt: ${ziel}`);
console.log(`    DOCX-Kopie: Bewerbungsmappe_${slug}.docx`);
console.log(`    Nächste Schritte: stellenanzeige.md extrahieren, interview.md führen, bewerbung.json füllen, Merge-Build (AGENT.md Phase 4).`);
