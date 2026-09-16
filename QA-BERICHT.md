# QA-BERICHT — Bewerbungsmappe V3

Datum: 17.09.2026 · Build: `node build/build_template.js` · Verifikation: LibreOffice-PDF-Export,
`validate.py`, XML-Greps, visuelle Prüfung der Renderings (jede Seite als Bild angesehen).
Belege: `qa/seite-1.png` … `qa/seite-4.png` (150 dpi, aus `Bewerbungsmappe_Vorlage.pdf`).

## Definition of Done

| Punkt | Status | Beleg |
|---|---|---|
| `PLAN.md`, `DESIGN-SYSTEM.md`, `QA-BERICHT.md`, `ANLEITUNG.md` existieren | ✅ | Repo-Dateien, commit |
| `qa/seite-1..4.png` existieren und visuell geprüft | ✅ | 4 PNGs; alle Seiten als Bild gelesen (diese Prüfung) |
| D1 Akzentfarben nie Textfarbe | ✅ | XML-Farb-Grep: Textfarben nur `1A1A1A`/`5A5A5A`; `C9B599`/`99ADC9` nur in Border-/Mark-Elementen |
| D2 weißer Grund + graue Panels | ✅ | kein `w:background` im XML; Panels als Zellschattierung; qa/seite-1..4.png |
| D3 Seitenfüllung/Fußanker | ✅ | Deckblatt bis Passermarken unten gefüllt; Anschreiben: Anlagen-Block unten; LC: Unterschrift im Fußbereich; Motivation: Panel + Datum am Fußanker — qa/seite-*.png |
| D4 einheitlicher Satzspiegel | ✅ | alle 4 sectPr: oben/unten/rechts 1134 tw, links 2381 tw (identisch) |
| D5 eigene Formatvorlagen | ✅ | `w:styleId`-Grep: 17 `Mappe*`-Styles (MappeDisplay, MappeTitel, MappeKapitelmarke, MappeMarginal, MappeBereich, MappeFliesstext, MappeAdresse, MappeDatenzeile, MappeDatum, MappeOptional, MappeLeitfrage, MappeKontaktZeile, MappeListe, MappeKartenTitel, MappeFusszeile + MappePlatzhalter als Zeichenformat) — Ausnahme Direktformat: Icon-Bildgrößen (dokumentiert in DESIGN-SYSTEM.md §6) |
| D6 Schriften | ✅ (Entscheidung) | Versand als PDF; `pdffonts`: IBMPlexSans/Montserrat-SemiBold **emb yes** in der PDF; DOCX = Master, Fallback-Ketten (ascii/hAnsi/cs) in allen Styles; Einbettung in DOCX bewusst entfallen |
| D7 Deckblatt | ✅ | qa/seite-1.png: Vier-Ecken-Passermarken (Ecken des Satzspiegels), Passepartout-Fotokarte, keine Namens-/Beruf-Wiederholung in der Fußzeile (nur `01 / 04`) |
| D8 Lebenslauf | ✅ | qa/seite-3.png: alle Icons `#1A1A1A` (inkl. `dumbbell`), Kenntnisse im eigenen Label-Raster (keine leere Datumsspalte), Hobbys = 3 gleichbreite Icon-Zellen, Unterschrift im Fußbereich |
| D9 Anschreiben | ✅ | qa/seite-2.png: Anlagen-Zeile vorhanden; Fundort/Ref.-Nr. = eigene `Mappe Optional`-Zeile; sichtbare Unterschrifts-Baseline; Nebeneinander-Adressen als dokumentierte DIN-Abweichung (DESIGN-SYSTEM.md §8) |
| D10 Motivation | ✅ | qa/seite-4.png: graues Panel mit Akzentkante trägt Leitfragen (kein schwebendes `„`); „modellieren" korrigiert (Quelltext-Grep: 0 Treffer für „modelieren") |
| D11 Eigenständigkeit | ✅ | Marginalmarke (Kapitelnummer/Label mit Akzentkante) + Fußankerlinie identisch auf allen Seiten — qa/seite-1..4.png |
| Kontrast ≥ 4,5:1 für jeden Text | ✅ | Berechnung in DESIGN-SYSTEM.md §2 (17,44 / 12,33 / 6,90 / 4,89 : 1) |
| DOCX editierbar, Layout stabil | ✅ | Test: Platzhalter ersetzt + Tabellenzeile gelöscht in Arbeitskopie → `validate.py` PASSED, Struktur intakt |
| Keine erfundenen Daten | ✅ | XML-Grep auf E-Mail-/Namensmuster: keine Treffer; alle Inhalte sind `[PLATZHALTER]` |
| `--data profil.json` (Agenten-Füllung) | ✅ | Testlauf mit Test-Profil: 0 Restplatzhalter, Optionals-Zeilen entfernt, PASSED, 4 Seiten |
| Platzhalter = je ein Run, eindeutig | ✅ | Grep-Ausgabe (56 eindeutige Keys, vollständig); Keys deckungsgleich mit `platzhalter.json` |

## Technische Prüfkommandos (Ausgaben)

- `validate.py` → `All validations PASSED`
- `pdfinfo` → `Pages: 4`
- `pdffonts` → alle Schrift-Instanzen `emb yes`
- `unzip -p … word/styles.xml | grep -o 'w:styleId…'` → siehe D5
- `unzip -p … word/document.xml | grep -o '\[[A-ZÄÖÜ_0-9 .-]*\]'` → 56 Keys, vollständig

## Bekannte, bewusste Abweichungen

- **Marginalband als Vollflächen-Band** wurde verworfen: seitenverankerte Floating-Tabellen
  rendern im LibreOffice-Backend unzuverlässig (Split über Seiten, Textverdrängung).
  Umgesetzt als **Marginalmarke** (negativer Einzug + Akzentkante) — dokumentiert in PLAN.md.
- **Deckblatt-Fußzeile** enthält die Registerlinie und `01 / 04` (kein Name/Beruf) —
  garantiert den identischen Fußanker über alle Seiten.
- **Schrifteinbettung in der DOCX** entfällt (PDF ist Versandartefakt), Fallback-Ketten gesetzt.
