# PLAN.md — Bewerbungsmappe V3 („Review & Redesign")

Stand: 17.09.2026 · Basis: `build/build_template.js` (V2), Review-Befund 11 Defekte (D1–D11)

## Ausgangslage

V2 ist technisch korrekt, aber gestalterisch unfertig (Kontrastfehler D1, Druckproblem D2,
Komposition D3, fehlende Formatvorlagen D5 u. a.). V3 ist ein **Umbau des bestehenden
Build-Skripts**, kein Neubau. Neue Randbedingung: Die Vorlage wird später **von einem
Agenten pro Bewerber-Profil ausgefüllt** — Platzhalter müssen maschinenlesbar sein.

## Getroffene Entscheidungen (Nutzerbefragung, 6 Fragen)

1. **Weißer Grund + graue Panels** (nicht graue Vollfläche) — Druck & Kontrast.
2. **Platzhalter über Zeichenvorlage** `Mappe Platzhalter` (`#5A5A5A` + `#D9D9D9`-Unterlegung),
   nie über Akzentfarben.
3. **Passermarken als Vier-Ecken-Set** — realisiert als Eckenmarken des Satzspiegels
   (Einzug 0 relativ zum Satzspiegel, alle 4 Seitenraster-Ecken, identische Größe/Farbe).
4. **Leitidee: Marginalspalte** — graues Band 2,2 cm an der linken Seitenkante auf allen
   Seiten; Kapitelnummer + Label oben, Seitenindikator unten.
5. **Versand als PDF** — DOCX ist der editierbare Master; Schrifteinbettung entfällt,
   stattdessen Fallback-Ketten in allen Vorlagen.
6. **Motivation behält Leitfragen** (Agenten-Füllung), neu gestaltet; zusätzlich
   Agenten-Anforderungen: eindeutige Platzhalternamen (`BEWERBER_`/`FIRMA_`-Präfixe,
   nummerierte Blöcke), ein Platzhalter = ein Run, `platzhalter.json` als Vertrag,
   `build_template.js --data profil.json`, optionale Zeilen über Formatvorlage
   `Mappe Optional` maschinell löschbar.

## Defekte → Maßnahmen

| Defekt | Maßnahme | Nachweis |
|---|---|---|
| D1 Akzentfarben als Text | Akzente nur Linien/Flächen/Marken; Text `#1A1A1A`, Sekundär `#5A5A5A` | Kontrasttabelle in DESIGN-SYSTEM.md; XML-Grep Farbwerte |
| D2 graue Vollfläche | Weißer Grund, `#D9D9D9` als Panel-/Bandfarbe | Render + XML (kein `w:background`) |
| D3 leere Seitenunterseiten | Marginalband + Fußanker (Fußlinie identische Höhe), Komposition bis Fußbereich | Screenshots qa/seite-*.png |
| D4 uneinheitliche Ränder | Ein Raster: oben/rechts/unten 2,0 cm, links 4,2 cm (2,2 Band + 2,0 Satzspiegelabstand) | sectPr-Ausgabe |
| D5 keine Formatvorlagen | 11 benannte Vorlagen (`Mappe *`), Direktformatierung nur für Icon-Bildgrößen | `w:styleId`-Grep |
| D6 Schriften nicht eingebettet | PDF = Versandartefakt, DOCX = Master; Fallback-Ketten (ascii/hAnsi/cs) in allen Vorlagen | pdffonts; DESIGN-SYSTEM.md |
| D7 Deckblatt-Details | Vier-Ecken-Passermarken, Passepartout-Fotokarte (bleibt nach Foto-Einsetzen), Deckblatt-Fußzeile nur Registerlinie + `01 / 04` (keine Namens-/Beruf-Wiederholung) | Screenshot seite-1 |
| D8 Lebenslauf | alle Icons `#1A1A1A`; Kenntnisse eigenes Raster (Label-Spalte mit Icon \| Inhalt); Hobbys 3 gleichbreite Zellen mit Icon; Unterschrift im Fußbereich | Screenshot seite-3 |
| D9 Anschreiben | Anlagen-Zeile am Ende; Fundort/Ref.-Nr. als eigene `Mappe Optional`-Zeile; sichtbare Unterschrifts-Baseline; Nebeneinander-Anordnung als bewusste DIN-Abweichung dokumentiert | Screenshot seite-2 |
| D10 Motivation | graues Panel mit Akzentkante trägt Leitfragen (kein schwebendes `„`); `modellieren` korrigiert | Screenshot seite-4 |
| D11 Eigenständigkeit | Marginalspalte als durchgehendes System; Passermarken; Fußanker | Screenshots 1–4 |

## Reihenfolge

1. Artefakte (PLAN, DESIGN-SYSTEM, platzhalter.json) → Commit
2. Build-Skript V3 → Build/Validate/Render → visuelle Prüfung aller Seiten → Fix-Schleifen → Commit
3. ANLEITUNG.md, QA-BERICHT.md, qa/*.png → Commit
4. `git log` / `git status` ausgeben, Push auf `origin/main`

## Offene Punkte

Keine — alle früheren offenen Designentscheidungen wurden durch Nutzerbefragung geschlossen.
