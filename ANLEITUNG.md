# ANLEITUNG — Bewerbungsmappe_Vorlage.docx

## Welche Datei verschicke ich?

- **`Bewerbungsmappe_Vorlage.pdf`** ist das **Versandartefakt** (Schriften sind eingebettet,
  sieht überall gleich aus). Nach dem Ausfüllen: *Datei → Exportieren als PDF*.
- **`Bewerbungsmappe_Vorlage.docx`** ist der **editierbare Master**. Benötigt die
  installierten Schriften **IBM Plex Sans** und **Montserrat SemiBold** — ohne sie
  weicht das Layout ab (Fallback: Systemschrift).

## Ausfüllen per Agent (automatisiert)

Die Vorlage ist für das automatisierte Füllen gebaut:

- **Vertrag:** `platzhalter.json` — alle Platzhalter mit Beschreibung, Beispiel,
  Pflicht/optional und Dokumentteil.
- **Füllen:** `node build/build_template.js --data profil.json`
  (`profil.json` = Objekt mit Key → Wert).
- Platzhalter liegen im XML als **ein zusammenhängender Run** vor und sind **eindeutig
  benannt** (`BEWERBER_*`, `FIRMA_*`, nummerierte Blöcke wie `SCHULE_1_*`).
- **Optionale Zeilen** (Formatvorlage `Mappe Optional`) werden beim Build **automatisch
  entfernt**, wenn der Wert `null` oder `""` ist.
- **Prüfung nach dem Füllen:**
  ```bash
  unzip -p Bewerbungsmappe_Vorlage.docx word/document.xml | grep -o '\[[A-ZÄÖÜ_0-9 .-]*\]' | sort -u
  ```
  Ausgabe muss **leer** sein.

## Ausfüllen von Hand

1. **Deckblatt** → Name, Ausbildungsberuf, Kontakt, Anlagenliste
2. **Anschreiben** → Empfänger (rechte Spalte!), Datum, Betreff, Textabsätze
3. **Lebenslauf** → Kopfdaten, Schulbildung, Praktika, Kenntnisse, Hobbys
4. **Motivationsschreiben** → Leitfragen in der grauen Karte beantworten
5. **Foto einsetzen** (beide Karten, gleiche Datei)
6. **Schlusskontrolle:** `Strg+H` → Suche nach `[` → Treffer muss **0** sein

Alle Platzhalter stehen in `[GROSSBUCHSTABEN]` und sind über die Zeichenformatvorlage
**„Mappe Platzhalter"** (graue Unterlegung) sichtbar.

## Platzhalter (Kurzreferenz)

Vollständige Liste mit Beispielen: **`platzhalter.json`**

| Präfix | Bedeutung |
|---|---|
| `BEWERBER_*` | Angaben der bewerbenden Person (Name, Adresse, Kontakt, Geburtsdaten, Ort) |
| `FIRMA_*` | Angaben des Ausbildungsbetriebs (Name, Abteilung, Ansprechpartner, Adresse) |
| `AUSBILDUNGSBERUF` | offizielle Berufsbezeichnung |
| `DATUM_*` | Datumsangaben im Format `TT.MM.JJJJ` |
| `SCHULE_n_*`, `PRAKTIKUM_n_*` | nummerierte Lebenslauf-Blöcke |
| `KENNNTNIS_*`, `STAERKE_n`, `HOBBY_n` | Kenntnisse, Stärken, Interessen |
| `ANSCREIBEN_*`, `MOTIVATION_*` | Textbausteine (Beschreibung/Beispiele in `platzhalter.json`) |
| `STELLE_FUNDORT_REFNR`, `FIRMA_ABTEILUNG`, `BEWERBER_WEBSITE`, `SCHULE_2_*`, `PRAKTIKUM_2_*`, `ANLAGE_WEITERE` | **optional** — Zeile löschen, falls leer |

## Foto einsetzen

| Position | Fenstergröße |
|---|---|
| Deckblatt (graue Karte mittig) | 6,5 × 8,1 cm (Seitenverhältnis 4:5) |
| Lebenslauf (graue Karte rechts) | 4,0 × 5,0 cm — gleicher Zuschnitt wie Deckblatt |

1. Foto im Hochformat 4:5 zuschneiden (Portrait, ruhiger Hintergrund).
2. Weißes Fenster anklicken → Platzhaltertext löschen → *Einfügen → Bilder* →
   Größe exakt einstellen.
3. Die graue Matte (Passepartout) bleibt bestehen — Karte nie löschen.

## Zeilen anpassen

- **Mehr Zeilen** (z. B. 3. Praktikum): Datenzeile markieren → kopieren → darunter einfügen.
- **Zeile löschen**: gesamte Tabellenzeile markieren → löschen. Das Raster (Datum \| Inhalt) bleibt.
- **Optionale Zeilen** (Website, Abteilung, Fundort, Schule 2, Praktikum 2, weitere Anlage):
  komplette Zeile löschen, falls nicht benötigt.

## Format-Regeln (nicht ändern)

- Farben: Weiß (Grund) · `#D9D9D9` (Panels/Linien) · `#1A1A1A` (Text) ·
  `#5A5A5A` (Sekundärtext/Platzhalter) · `#C9B599`/`#99ADC9` (nur Linien/Marken, **nie Text**)
- Schriften: IBM Plex Sans (Text) · Montserrat SemiBold (Titel/Kapitelmarken)
- Datumsformat überall `TT.MM.JJJJ` (BA-Konvention)
- Unterschrift: Freiraum über der Baseline lassen (handschriftlich oder eingescannt)
- Die `+`-Passermarken auf dem Deckblatt sind Designelemente (Satzspiegel-Ecken)
