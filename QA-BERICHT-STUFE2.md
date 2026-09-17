# QA-BERICHT-STUFE2 — Gefüllte Dokumente, Skripte, Profil-System

Datum: 17.09.2026 · Basis: PLAN-STUFE2.md §8 · Build: `node build/build_template.js`
(+ `--data merged.json` für den gefüllten Lauf) · Render: LibreOffice-PDF-Export,
`pdftoppm` 150 dpi, jede Seite als Bild angesehen.
Der V3-Bericht (`QA-BERICHT.md`) bleibt unverändert; dieser Bericht prüft **neu:
den gefüllten Zustand**, die drei Stufe-2-Skripte und das `/profiles/`-System.

## 1. Testaufbau

- Testprofil `_test-max-mustermann/` (klar als TEST markiert) mit fiktiven
  Kategorie-A-Werten (37 Keys; `SCHULE_2_*` gefüllt → Optional-Zeile **mit**
  Daten; `PRAKTIKUM_2_*` + `BEWERBER_WEBSITE` leer → Zeilen **entfallen**).
- Testfirma: „Musterfabrik für Präzisionsbauteile und Technisches Design GmbH"
  (bewusst langer Name für den Überlauf-Check), Slug
  `musterfabrik-fr-przisionsbauteile-und-technisches-design-gmbh`
  (Umlaute/Sonderzeichen werden gemäß Plan §6 entfernt — dokumentiertes Verhalten).
- Voller Weg nach §8.2: `sync-vorlage.js` → `erzeuge-personen-vorlage.js` →
  `neue-bewerbung.js` → Merge (`{...profil, ...bewerbung}`, B gewinnt) →
  `build_template.js --data` über Temp-Kit-Kopie → PDF → `pdftoppm` → visuelle Prüfung.
- Belege (Screenshots): `qa/stufe2/test-1.png … test-4.png` (gefüllte Mappe),
  `qa/stufe2/befund-*.png` (Befund-Belege, siehe §3).

## 2. Ergebnisse (Definition of Done Stufe 2)

| Punkt | Status | Beleg (frisch verifiziert) |
|---|---|---|
| P0-2 Key-Migration: keine alten Keys im Master | ✅ | XML-Grep `ANSCREIBEN_\|KENNNTNIS_` im Master-DOCX: **0**; neue Keys je 1×: `ANSCHREIBEN_{EINSTIEG,BERUF,PRAXIS,ABSCHLUSS,SCHLUSS}`, `DATUM_ANSCHREIBEN`, `KENNTNIS_{SOFTWARE,SOFTWARE_LEVEL,SPRACHE,SPRACHE_LEVEL,CAD}` (E2/E3) |
| Repo-Grep nach Plan §2 | ✅ | Treffer **nur** in `PLAN-STUFE2.md` (Migrations-Tabelle des Plans selbst — dokumentiert, bleibt); sonst 0 (E10) |
| P0-1 gefüllter Text ohne Platzhalter-Stil | ✅ | XML-Grep `MappePlatzhalter` im gefüllten DOCX: **0**; Run-Farben nur `1A1A1A` (70×) + `5A5A5A` (4×) (E6/E7); Screenshot test-1…4: kein grau unterlegter Text |
| P0-3 Optional-Hinweise nur im Master | ✅ | „Zeile löschen"-Vorkommen: Master **4**, gefüllt **0** (E4, §3 unten) |
| Rest-Platzhalter im gefüllten DOCX | ✅ | XML-Grep `[KEY]`: **0** (E5) |
| Optional-Zeilen-Verhalten | ✅ | entfallen: Website, Abteilung (FIRMA_ABTEILUNG=null), Praktikum 2; vorhanden mit Daten: Schulbesuch 2, Fundort/Ref.-Nr., ANLAGE_WEITERE (pdftotext-Counts + test-2/test-3) |
| Seitenzahl gefüllt = 4 | ✅ | `pdfinfo`: Master 4, gefüllt 4 (E8) |
| D-Stichprobe Umbrüche/Überlauf | ✅ | Langer Firmenname bricht sauber in der Empfängerzelle um (test-2); alle 4 Abschnitte je 1 Seite; Fußzeilen `01…04 / 04` konsistent |
| D1 Akzente nie Textfarbe | ✅ | E7: Akzentfarben `C9B599`(14×)/`99ADC9`(4×) ausschließlich in Border-/Mark-Attributen, nicht als `w:color w:val` |
| D6 Schriften im PDF | ✅ | `pdffonts`: IBM Plex Sans / Montserrat SemiBold alle `emb yes` (E9) |
| D7–D11 am gefüllten Dokument | ✅ | test-1: Passermarken + Passepartout-Karte; test-2: Anlagen-Zeile am Briefende, Unterschrifts-Baseline; test-3: Kenntnisse-Raster, 3 Hobbyzellen; test-4: Panel mit Leitfrage + Datum am Fußanker; Marginalmarken auf allen Seiten |
| Kontrast ≥ 4,5:1 | ✅ | gefüllter Text = `#1A1A1A` auf Weiß: 17,44:1 (DESIGN-SYSTEM.md §2); visuell keine Grau-Unterlegung (P0-1) |
| Skripte + Fehlerfälle | ✅ | T1–T7 (WERKZEUG-LOG B.4): fehlende Args, unbekanntes Profil, 29 leere Pflicht-A-Felder erkannt, fehlende Personen-Vorlage, leerer Slug, Duplikat-Schutz — jeweils Exit 1 mit klarem Hinweis |
| Invarianten §3 | ✅ | Personen-`.vorlage/` nur durch `erzeuge-personen-vorlage.js` erzeugt (T4: Validierung **vor** Generierung, kein Ordner bei Fehler); Bewerbungsordner nur durch `neue-bewerbung.js` (T6/Duplikat); `/profiles/` ohne Git |
| AGENT.md × 2 | ✅ | `profiles/iza/AGENT.md`, `profiles/dumitru/AGENT.md` — §5 wortwörtlich, Nie-erfinden-Regel, humanizer-Verweis (E11) |

## 3. Befunde aus B.6 (gefunden → behoben → belegt)

1. **P0-3 — Hinweis-Suffixe im gefüllten Dokument.** Optional-Zeilen rendern im
   Master die Anweisung „ — Zeile löschen, falls nicht vorhanden" mit; im
   **gefüllten** Versanddokument erschienen diese Anweisungen weiterhin
   (V7-Messung vor dem Fix: 2× „Zeile löschen"). Ursache: V3-Restriktion — die
   Vorlage war nie gefüllt getestet (gleiche Fehlerklasse wie P0-1).
   Fix: `hint()`-Helper in `build_template.js` — Suffixe nur bei leerem Master
   (ohne `--data`). Belege: E4 (Master 4, gefüllt 0).
2. **Anschreiben-Überlauf bei langen Texten.** Erstes Füllbeispiel (Absätze à
   3–4 Zeilen) schob den ANLAGEN-Block auf eine eigene Seite → 5 Seiten, Fußzeile
   „02 / 04" auf Extraseite (Beleg: `qa/stufe2/befund-anschreiben-ueberlauf-seite2/3.png`).
   Der Build ist laut Plan eingefroren; Kapazitätsrichtlinie daher datenseitig:
   Absätze auf Länge der Beispiele in `platzhalter.json` (je ~2–3 Zeilen,
   gesamt ≤ ~14 Zeilen) — danach 4 Seiten. **Aktion:** Richtlinie ist in
   `AGENT.md` §8 (Mindestprüfung) bzw. der Interview-Phase 3 verankert; das
   Kürzen gehört zur Freigabe (humanizer).
3. **Slug ohne Umlaut-Erhaltung** („für" → „fr"): gemäß Plan §6 („Sonderzeichen
   entfernt") korrekt umgesetzt; bewusst kein Alias. Dokumentiert in §1 dieses
   Berichts.

## 4. Bekannte, bewusste Grenzen

- Foto: `build_template.js` setzt kein Foto automatisch ein (Plan §6); die
  Fotokarte zeigt „FOTO EINFÜGEN" bis zum manuellen Einsatz (ANLEITUNG.md).
- `merged.json` und Temp-Build-Kit liegen in `/tmp/opencode/`, nie im Profilbaum
  (Prozedur in AGENT.md §3).
- Master-DOCX/PDF im Repo wurden mit P0-3 neu gebaut (Inhalt identisch zur
  V3-Master inkl. Hinweis-Suffixe — Beleg E4).

## 5. Technische Prüfkommandos (Ausgaben, Stichtag 17.09.2026)

```
E1  node build/build_template.js
    → OK: Bewerbungsmappe_Vorlage.docx geschrieben, 115279 Bytes (Master-Vorlage)
E2  unzip -p … | grep -oE 'ANSCREIBEN_|KENNNTNIS_' | wc -l        → 0
E3  … grep -oE '\[(ANSCHREIBEN|KENNTNIS|DATUM_ANSCHREIBEN)[A-Z_]*\]'
    → je 1×: ANSCHREIBEN_ABSCHLUSS/BERUF/EINSTIEG/PRAXIS/SCHLUSS,
      DATUM_ANSCHREIBEN, KENNNTNIS_CAD/SOFTWARE/SOFTWARE_LEVEL/SPRACHE/SPRACHE_LEVEL
E4  Master 'Zeile löschen': 4 · gefüllt: 0
E5  gefüllt Rest-Platzhalter: 0      E6  gefüllt MappePlatzhalter: 0
E7  gefüllt Run-Farben: 1A1A1A×70, 5A5A5A×4 (kein Akzent als Textfarbe)
E8  pdfinfo: Master Pages: 4 · gefüllt Pages: 4
E9  pdffonts: alle Instanzen emb yes (IBM Plex Sans, Montserrat SemiBold)
E10 Repo-Grep alte Keys: nur PLAN-STUFE2.md (Plan-Tabelle)
E11 /profiles/: iza/ dumitru/ _test-max-mustermann/ (+ .vorlage), AGENT.md × 2
```

## 6. Fazit

Stufe 2 ist umgesetzt und am gefüllten Testdokument verifiziert: P0-1, P0-2,
P0-3 nachweisbar behoben, 4 Seiten, saubere Umbrüche, kein Platzhalter-Stil,
keine Lösch-Anweisungen im Versandartefakt, Skripte erzwingen die Invarianten.
Der Stufe-2-Abschluss steht unter dem Vorbehalt der Längenrichtlinie für
Anschreiben-Texte (§3.2) — sie ist operativ in AGENT.md verankert.
