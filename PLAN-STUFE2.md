# PLAN-STUFE2 — Bewerbungsmappen-Agentensystem Stufe 2
„Profile, automatisiertes Ausfüllen, ein Agent pro Person"

Basis: V3 (Commits `51758eb`, `8d1a8d1`) — wird nicht neu gebaut. Verifiziert
gegen die tatsächlichen Dateien: 58 Platzhalter-Keys (nicht 56 —
`ANLAGE_WEITERE` kam in V3 hinzu), P0-1 und P0-2 bestätigt.

---

## 1. P0-1 — Platzhalter-Stil-Leck bei `--data`

Befund (`build/build_template.js`, `p()`): setzt `style: "MappePlatzhalter"`
bedingungslos — gefüllte Bewerbungen wären komplett grau unterlegt. Nie
aufgefallen, weil V3 nur die leere Master gerendert hat.

Fix (exakt):

```js
const p = (key, opts = {}) => {
  const v = val(key);
  const isEmpty = v === undefined || v === null || v === "";
  return isEmpty
    ? new TextRun({ text: `[${key}]`, style: "MappePlatzhalter", ...opts })
    : new TextRun({ text: v, color: INK, ...opts });
};
```

`...opts` bleibt nach `color: INK` — bewusste Overrides (z. B. `bold` im
Betreff) funktionieren weiter.

Verifikation (Pflicht, in B.6): `--data`-Testlauf → PDF → PNG → ansehen.
Echter Text trägt KEINE graue Hinterlegung/Grauschrift; Kontrast ≥ 4,5:1
(`DESIGN-SYSTEM.md` §2).

---

## 2. P0-2 — Key-Migration (11 Keys)

Schreibweisen: `ANSCREIBEN` (ohne H, falsch) → `ANSCHREIBEN`. `KENNNTNIS`
(dreifaches N, falsch) → `KENNTNIS` (zweifaches N).

| Falsch (aktuell) | Richtig |
|---|---|
| ANSCREIBEN_EINSTIEG | ANSCHREIBEN_EINSTIEG |
| ANSCREIBEN_BERUF | ANSCHREIBEN_BERUF |
| ANSCREIBEN_PRAXIS | ANSCHREIBEN_PRAXIS |
| ANSCREIBEN_ABSCHLUSS | ANSCHREIBEN_ABSCHLUSS |
| ANSCREIBEN_SCHLUSS | ANSCHREIBEN_SCHLUSS |
| DATUM_ANSCREIBEN | DATUM_ANSCHREIBEN |
| KENNNTNIS_SOFTWARE | KENNTNIS_SOFTWARE |
| KENNNTNIS_SOFTWARE_LEVEL | KENNTNIS_SOFTWARE_LEVEL |
| KENNNTNIS_SPRACHE | KENNTNIS_SPRACHE |
| KENNNTNIS_SPRACHE_LEVEL | KENNTNIS_SPRACHE_LEVEL |
| KENNNTNIS_CAD | KENNTNIS_CAD |

Betroffene Dateien (zeilenbasiert, verifiziert):

- `build/build_template.js`: 9 Zeilen (6× ANSCREIBEN-Familie, 3× KENNNTIS-Familie — 5 Keys auf 3 Zeilen)
- `platzhalter.json`: 11 Zeilen (6× ANSCREIBEN-Familie, 5× KENNNTNIS-Familie)
- `ANLEITUNG.md`: 2 Zeilen
- `DESIGN-SYSTEM.md`: 1 Zeile
- `QA-BERICHT.md`: 0 (historischer Bericht, bleibt unverändert)

Kein Alias/Rückwärtskompatibilität — sauberer Bruch jetzt.

Verifikation (muss nach dem Fix LEER sein):

```bash
grep -rn "ANSCREIBEN_\|KENNNTNIS_" --include="*.js" --include="*.json" --include="*.md" . | grep -v node_modules
```

Zusatz-Check am gebauten DOCX: Platzhalter-Grep zeigt nur `ANSCHREIBEN_*`/`KENNTNIS_*`.

---

## 3. `/profiles/`-Architektur

```
~/Work/
├── iza-bewerbungen/          ← Repo, unverändert (nur P0-Fixes + scripts/ + Docs kommen dazu)
└── profiles/                 ← NEU, KEIN Git, KEIN github-MCP, KEIN gh
    ├── .vorlage/              ← Sync-Kopie des Build-Systems (nur per Skript aktualisieren)
    │   ├── build_template.js
    │   ├── package.json
    │   ├── assets/icons/…
    │   ├── platzhalter.json
    │   └── scripts/           ← die 3 Stufe-2-Skripte (Kopie, siehe §6 Standort)
    ├── iza/
    │   ├── profil.json         ← Personendaten (Kategorie A, §4), Werte: erst Interview/Nutzer
    │   ├── uploads/             ← Rohdaten (Lebenslauf, Zeugnisse, Foto) — nie ins Git
    │   ├── .vorlage/            ← GENERIERT aus /profiles/.vorlage + profil.json
    │   │   └── Bewerbungsmappe_Vorlage.docx
    │   ├── AGENT.md             ← Betriebsanleitung Iza-Agent (§5 wortwörtlich)
    │   └── <firma-slug>/
    │       ├── bewerbung.json    ← Kategorie-B-Felder
    │       ├── stellenanzeige.md ← extrahierte Fakten (KEINE Seitenkopie)
    │       ├── interview.md      ← Frage/Antwort-Protokoll
    │       ├── Bewerbungsmappe_<Firma>.docx
    │       └── Bewerbungsmappe_<Firma>.pdf
    ├── dumitru/               ← gleiche Struktur
    └── _test-max-mustermann/  ← klar als TEST markiert (§8), gleiche Nicht-Git-Regel
```

Invarianten (per Skript erzwingen, nie manuell umgehen):

1. `/profiles/.vorlage/` wird NUR von `sync-vorlage.js` aktualisiert.
2. `/profiles/[name]/.vorlage/` wird NUR von `erzeuge-personen-vorlage.js` erzeugt — Neugenerierung statt Patchen.
3. Bewerbungsordner entstehen NUR durch `neue-bewerbung.js`.
4. In `/profiles/` gilt: kein git, kein gh, kein github-MCP — ausnahmslos.

---

## 4. Datenschema — alle 58 Keys, Kategorie A (37) / B (21)

Abgeglichen gegen die korrigierte `platzhalter.json`: jeder Key in genau einer
Kategorie, keiner fehlt, keiner doppelt (37 + 21 = 58).

**A — `profil.json`, dauerhaft (37):**
`AUSBILDUNGSBERUF`¹, `BEWERBER_NAME`, `BEWERBER_STRASSE`, `BEWERBER_PLZ_ORT`,
`BEWERBER_TELEFON`, `BEWERBER_EMAIL`, `BEWERBER_WEBSITE`ᵒ,
`BEWERBER_GEBURTSDATUM`, `BEWERBER_GEBURTSORT`, `BEWERBER_ORT`,
`SCHULE_1_ZEITRAUM`, `SCHULE_1_NAME`, `SCHULE_1_ORT`, `SCHULE_1_ABSCHLUSS`,
`SCHULE_1_ABSCHLUSS_MONAT`, `SCHULE_2_ZEITRAUM`ᵒ, `SCHULE_2_NAME`ᵒ,
`SCHULE_2_ORT`ᵒ, `PRAKTIKUM_1_ZEITRAUM`, `PRAKTIKUM_1_BEREICH`,
`PRAKTIKUM_1_UNTERNEHMEN`, `PRAKTIKUM_1_ORT`, `PRAKTIKUM_2_ZEITRAUM`ᵒ,
`PRAKTIKUM_2_BEREICH`ᵒ, `PRAKTIKUM_2_UNTERNEHMEN`ᵒ, `PRAKTIKUM_2_ORT`ᵒ,
`KENNTNIS_SOFTWARE`, `KENNTNIS_SOFTWARE_LEVEL`, `KENNTNIS_SPRACHE`,
`KENNTNIS_SPRACHE_LEVEL`, `KENNTNIS_CAD`, `STAERKE_1`, `STAERKE_2`,
`STAERKE_3`, `HOBBY_1`, `HOBBY_2`, `HOBBY_3`

— plus Nicht-DOCX-Feld `foto_pfad` (Konvention, kein Platzhalter).

**B — `bewerbung.json`, pro Bewerbung (21):**
`FIRMA_NAME`, `FIRMA_ABTEILUNG`ᵒ, `FIRMA_ANSPRECHPARTNER`, `FIRMA_STRASSE`,
`FIRMA_PLZ_ORT`, `DATUM_ANSCHREIBEN`, `DATUM_LEBENSLAUF`, `DATUM_MOTIVATION`²,
`STELLE_FUNDORT_REFNR`ᵒ, `ANSCHREIBEN_EINSTIEG`, `ANSCHREIBEN_BERUF`,
`ANSCHREIBEN_PRAXIS`, `ANSCHREIBEN_ABSCHLUSS`, `ANSCHREIBEN_SCHLUSS`,
`MOTIVATION_LEITFRAGE`, `MOTIVATION_EINSTIEG`,
`MOTIVATION_TECHNIK_GESTALTUNG`, `MOTIVATION_PASSUNG`, `MOTIVATION_LERNZIEL`,
`MOTIVATION_AUSBLICK`, `ANLAGE_WEITERE`ᵒ

ᵒ = optional · ¹ = A-Standardwert, pro Bewerbung per Overlay überschreibbar ·
² = Vorschlag: heutiges Datum, im Interview bestätigen.

Merge-Regel für den Build: `merged = { ...profil, ...bewerbung }` (B gewinnt),
Übergabe an `build_template.js --data merged.json`.

---

## 5. Interview-Design (1:1 in AGENT.md übernehmbar)

Leitsatz: Glaubwürdig entsteht durch Konkretheit — das echte Praktikum, das
echte Schulfach, den echten Grund. `humanizer` glättet Sprache, erfindet aber
keine Substanz. §15 (Nie erfinden) gilt verschärft: auch keine „plausibel
ergänzten" Werte.

**Phase 0 — Vorbereitung**

1. `uploads/` einlesen (PDF: `pdf`/`processing-pdf`-Skills; DOCX: `docx`-Skill).
   Ableitbare Kategorie-A-Felder als Bestätigungsliste vorlegen („Ich habe
   gelesen: … stimmt das?") — Übernahme nur nach ausdrücklicher Bestätigung;
   Texterkennung macht Fehler.
2. Stellenanzeige-Link mit `playwright`-MCP öffnen; extrahieren, nicht
   spiegeln: exakte Berufsbezeichnung (1:1 aus der Anzeige), Anforderungen
   (Liste), Firmenname/-adresse, Ansprechpartner, Ref.-Nr./Fundort. Nur diese
   Fakten nach `stellenanzeige.md`.

**Phase 1** — nur Lücken erfragen. Nichts erneut fragen, was aus
`profil.json` oder der Anzeige bekannt ist.

**Phase 2 — inhaltliche Fragen (Floskel-Filter aktiv).** Regel: Eine Antwort
wird nur akzeptiert, wenn sie mindestens ein konkretes Eigen-Element enthält
(genannter Gegenstand, Ort, Tool, Fach, Ereignis). Sonst genau eine
Nachfrage. Bleibt die Antwort danach vage: Feldwert =
`[BITTE KONKRETISIEREN: <Thema>]` — nie raten.

| # | Ziel-Feld | Kernfrage | Nachfrage (bei Floskel) |
|---|---|---|---|
| F1 | ANSCHREIBEN_EINSTIEG | „Wo hast du die Stelle gesehen — und was genau hat dich bei [FIRMA] angesprochen?" | „Beschreib das eine Produkt/Detail auf der Seite, das dich neugierig gemacht hat." |
| F2 | ANSCHREIBEN_BERUF | „Was machst du am liebsten — zeichnen, bauen, am Computer modellieren? Warum passt das zum Produktdesign?" | „Erzähl von der letzten Sache, die du gezeichnet oder gebaut hast." |
| F3 | ANSCHREIBEN_PRAXIS | „Was hast du bei [PRAKTIKUM_1_UNTERNEHMEN] konkret gemacht?" | „Drei Sätze: Was war die Aufgabe, was hast du getan, was ist rausgekommen?" |
| F4 | ANSCHREIBEN_ABSCHLUSS | „Welchen Abschluss machst du wann?" (Fakt, Schreibweise wie im Lebenslauf) | — |
| F5 | ANSCHREIBEN_SCHLUSS | „Dein Wunsch: Gespräch, Schnupperpraktikum, direkter Kontakt?" | — |
| F6 | MOTIVATION_LEITFRAGE | „Warum genau dieser Beruf — in einem Satz, den du unterschreiben würdest?" | „Welches Detail des Berufs reizt dich wirklich — das Zeichnen, das Konstruieren, das Produkt?" |
| F7 | MOTIVATION_EINSTIEG | „Wie bist du zum ersten Mal auf technisches Zeichnen/Konstruieren gestoßen? Konkrete Erinnerung." | „Welche Szene genau — was hast du gesehen, gemacht?" |
| F8 | MOTIVATION_TECHNIK_GESTALTUNG | „Was hast du zuletzt gebaut, gezeichnet oder modelliert? Was war spannend, was nervig?" | „Nenne das Objekt und einen konkreten Arbeitsschritt." |
| F9 | MOTIVATION_PASSUNG | „Erzähl von einer Situation, in der du sehr sorgfältig/geduldig warst." | „Wie lange, woran hast du gemerkt, dass es dir liegt?" |
| F10 | MOTIVATION_LERNZIEL | „Was willst du nach 1 Jahr Ausbildung konkret können?" | „Welches Tool/Thema zuerst — CAD, Werkstoffe, Normen?" |
| F11 | MOTIVATION_AUSBLICK | „Wo siehst du dich, wenn die Ausbildung klappt?" (realistisch) | — |

Floskel-Liste (Nachfrage-Auslöser, darf in `AGENT.md` erweitert werden):
„ich interessiere mich für Technik" · „ich bin ein Teamplayer" · „ich lerne
gerne Neues" · „ich bin motiviert und zuverlässig" · „ich bin kreativ und
strukturiert" · jede Antwort, die ohne konkretes Beispiel für jede beliebige
Bewerbung passen würde.

Maßstab Prompt 1 §19 unverändert: keine Floskeln, keine übertriebene
Begeisterung, keine Buzzword-Ketten, keine unbelegten Superlative.

**Phase 3 — Entwurf & Freigabe.** Entwürfe je Absatz im Chat zeigen (1 Absatz
= 1 Vorschlag), live bestätigen/korrigieren; nach Freigabe `humanizer`-Skill
auf die freigegebenen Absätze; Ergebnis in `bewerbung.json`.

**Phase 4 — Foto & Abschluss.** Foto aus `uploads/` in den Bewerbungsordner
kopieren; Einsetzen manuell laut `ANLEITUNG.md` (4:5, 6,5×8,1 / 4×5 cm).
Merge `profil.json` + `bewerbung.json` → `build_template.js --data` →
Render-Check → PDF.

---

## 6. Skripte

Node; Standort-Entscheidung: `scripts/` IM REPO, versioniert —
`sync-vorlage.js` kopiert sie mit nach `/profiles/.vorlage/`.
`/profiles/.vorlage/` ist reine Laufzeitkopie.

| Skript | CLI | Verhalten |
|---|---|---|
| `scripts/sync-vorlage.js` | `node scripts/sync-vorlage.js` | kopiert `build/`, `assets/`, `platzhalter.json`, `scripts/` nach `/profiles/.vorlage/` |
| `scripts/erzeuge-personen-vorlage.js` | `<name>` | liest `/profiles/<name>/profil.json`, prüft Kategorie-A-Pflichtfelder gegen `platzhalter.json` (`required: true` ∧ Kategorie A), ruft `build_template.js --data` auf → `/profiles/<name>/.vorlage/Bewerbungsmappe_Vorlage.docx` |
| `scripts/neue-bewerbung.js` | `<name> <firma>` | Slug (lowercase, Leerzeichen→-, Sonderzeichen entfernt), legt `/profiles/<name>/<slug>/` an, kopiert Personen-`.vorlage`-DOCX, erzeugt `bewerbung.json` (B-Keys = `null`), leere `stellenanzeige.md` + `interview.md` |

Foto-Hinweis (explizit, nicht verschwiegen): `build_template.js` unterstützt
KEIN automatisches Foto-Einsetzen über `--data` — Fotozellen sind
Platzhalterflächen. Automatisches Einbetten = offenes Stretch-Goal, nicht
blockierend.

---

## 7. Werkzeug-Zuordnung

Nichtnutzung muss in `WERKZEUG-LOG.md` begründet werden.

| Aufgabe | Werkzeug |
|---|---|
| `uploads/` lesen (Zeugnisse, alte Lebensläufe) | `pdf`, `processing-pdf`, `docx` |
| Stellenanzeige-Link lesen | `playwright`-MCP |
| DOCX bauen/befüllen | `docx` |
| Anschreiben/Motivation glätten | `humanizer` |
| Vor „fertig"-Behauptungen | `verifying-before-completion` |
| Gerenderte Seiten visuell prüfen | `reviewing-interface-quality` |
| Datei-/Ordnerops in `/profiles/` | `filesystem`-MCP |
| Git (NUR Hauptrepo, nie `/profiles/`) | `github`-MCP oder `gh` |
| docx-js-API beim P0-Fix | `context7`-MCP |

---

## 8. QA-Plan für gefüllte Dokumente

Neu — V3 hat nur die leere Master geprüft.

1. Fake-Testprofil „Max Mustermann" + Fake-Firma unter
   `/profiles/_test-max-mustermann/` (klar als TEST markiert, gleiche
   Nicht-Git-Regel).
2. Voller Weg: `erzeuge-personen-vorlage.js` → `neue-bewerbung.js` →
   `build_template.js --data` (Merge) → PDF → `pdftoppm` → Screenshots
   ansehen.
3. Explizit prüfen: KEIN Text mit `MappePlatzhalter`-Grau/Hinterlegung außer
   bewusst leeren optionalen Feldern; Kontrast ≥ 4,5:1
   (`DESIGN-SYSTEM.md` §2).
4. D1–D11-Stichprobe am gefüllten Dokument (Umbrüche, Tabellenüberlauf bei
   langen Firmennamen, Seitenzahl = 4).
5. Ergebnis in `QA-BERICHT-STUFE2.md` (neue Datei, V3-Bericht bleibt) mit
   Belegen (Screenshot-Dateiname, Grep-Ausgabe, Kontrastwert).

---

## 9. Offene Entscheidungen (mit Empfehlung)

1. `/profiles/` außerhalb des Repos — übernommen (Nutzer-Entscheid);
   B.7-Fallback (in-repo + `.gitignore` + `git check-ignore`-Beleg) nur auf
   Wunsch.
2. Skript-Standort: Repo `scripts/` (versioniert, im Repo testbar) —
   Empfehlung.
3. Foto-Automatik: Stretch-Goal, nicht blockierend.
4. Kein Alias für die 11 alten Keys.
5. Key-Gesamtzahl ist 58 (Meta-Prompt sagte 56) — diese Tabelle gilt.

---

## 10. Umsetzungsreihenfolge (Build-Agent, neue Sitzung)

B.0 Start-Gate (`PLAN-STUFE2.md` + Abschlusszeile prüfen) → B.1
`WERKZEUG-LOG.md` anlegen und laufend führen → B.2 P0-Fixes +
Regressions-Render + eigener Commit → B.3 `/profiles/`-Gerüst → B.4 drei
Skripte inkl. Fehlerfall-Tests → B.5 `AGENT.md` × 2 (§5 wortwörtlich +
Nie-erfinden-Regel + `humanizer`-Verweis) → B.6 Fake-Profil-Durchlauf +
Screenshots → B.7 `QA-BERICHT-STUFE2.md` → B.8 Commit/Push (nur Hauptrepo),
`git log --oneline -5`, `git status` (working tree clean).

```
==== STUFE 2 PLAN FERTIG — BEREIT ZUR ÜBERGABE AN BUILD-AGENT ====
```
