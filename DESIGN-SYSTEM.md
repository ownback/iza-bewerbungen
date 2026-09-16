# DESIGN-SYSTEM.md — Bewerbungsmappe V3

## 1. Farbrollen (verbindlich)

| Farbe | Hex | Rolle | Ausnahme |
|---|---|---|---|
| Weiß | `#FFFFFF` | Seitenhintergrund, Fotofenster (Passepartout) | — |
| Hellgrau | `#D9D9D9` | **Flächen**: Marginalband, Panels, Karten, Unterlegung, Linien unter Überschriften, Fuß-Haarlinie | — |
| Tinte | `#1A1A1A` | **aller Text** + **alle Icons** | — |
| Sekundär | `#5A5A5A` | Sekundärtext, Platzhalter, Kapitel-Labels, Datum, Fußzeilentext | neu eingeführt, unten begründet |
| Warmakzent | `#C9B599` | **nur Linien/Flächen/Marken**: Präzisionslinie, Panel-Kanten, Passermarken, Anlagen-Kanten | **nie Textfarbe** |
| Kaltakzent | `#99ADC9` | **nur Versatzdetail** der Präzisionslinie | **nie Textfarbe** |

**Begründung Sekundärgrau:** Die Palette enthielt zuvor keine lesbarkeitskonforme Sekundärtextfarbe.
`#5A5A5A` erfüllt WCAG AA (≥ 4,5:1) auf Weiß und auf `#D9D9D9` (siehe Tabelle).

## 2. Kontrastwerte (WCAG 2.1, relative Luminanz)

| Vordergrund | Hintergrund | Kontrast | Bewertung |
|---|---|---|---|
| `#1A1A1A` | `#FFFFFF` | **17,44 : 1** | AAA |
| `#1A1A1A` | `#D9D9D9` | **12,33 : 1** | AAA |
| `#5A5A5A` | `#FFFFFF` | **6,90 : 1** | AA (Fließtext ✓) |
| `#5A5A5A` | `#D9D9D9` | **4,89 : 1** | AA (Fließtext ✓) |
| `#C9B599` | `#FFFFFF` | 1,99 : 1 | nur Linien/Flächen — kein Text |
| `#C9B599` | `#D9D9D9` | 1,41 : 1 | nur Linien/Flächen — kein Text |
| `#99ADC9` | `#FFFFFF` | 2,29 : 1 | nur Linien — kein Text |

**Regel:** Jeder Text ≥ 4,5 : 1 gegen seinen tatsächlichen Hintergrund. Akzentfarben kommen
in der DOCX an keiner Stelle als Textfarbe vor (prüfbar per XML-Grep).

## 3. Typografie

| Rolle | Vorlage | Schrift | Größe | Farbe |
|---|---|---|---|---|
| Seitentitel | `Mappe Titel` | Montserrat SemiBold | 32 pt | `#1A1A1A` |
| Deckblatt-Display | `Mappe Display` | Montserrat SemiBold | 34 pt | `#1A1A1A` |
| Kapitelmarke (Marginal) | `Mappe Kapitelmarke` | Montserrat SemiBold | 9 pt | `#1A1A1A` |
| Marginal-Label | `Mappe Marginal` | IBM Plex Sans, gesperrt +1,5 pt | 8 pt | `#5A5A5A` |
| Bereichsüberschrift | `Mappe Bereich` | Montserrat SemiBold, gesperrt | 11 pt | `#1A1A1A` |
| Fließtext | `Mappe Fließtext` | IBM Plex Sans | 11 pt, 1,15-zeilig | `#1A1A1A` |
| Datum | `Mappe Datum` | IBM Plex Sans | 9,5 pt | `#5A5A5A` |
| Platzhalter (Zeichen) | `Mappe Platzhalter` | IBM Plex Sans + Unterlegung `#D9D9D9` | erbt | `#5A5A5A` |
| Label (Zeichen) | `Mappe Label` | IBM Plex Sans bold | erbt | `#1A1A1A` |
| Fußzeile | `Mappe Fußzeile` | IBM Plex Sans | 8 pt | `#5A5A5A` |
| Optional-Zeile | `Mappe Optional` | IBM Plex Sans | 10 pt | `#5A5A5A` |
| Leitfrage | `Mappe Leitfrage` | IBM Plex Sans italic | 12 pt | `#1A1A1A` |

**Fallback-Ketten** (D6): jede Vorlage setzt `w:ascii`/`w:hAnsi`/`w:cs`:
`IBM Plex Sans` → System-Sans-Fallback; `Montserrat SemiBold` → System-Sans-Fallback.
**Schrifteinbettung:** entfällt bewusst — die **PDF ist das Versandartefakt** (LibreOffice
bettet beim PDF-Export alle Schriften ein, prüfbar mit `pdffonts`); die **DOCX ist der
editierbare Master** für Bearbeiter mit installierten Schriften.

## 4. Raster

- **Ein Satzspiegel für alle 4 Seiten** (D4): oben 2,0 cm · unten 2,0 cm ·
  rechts 2,0 cm · links 4,2 cm (= Marginalzone 2,2 cm + 2,0 cm bis zum Text).
- Satzspiegelbreite: 14,8 cm.
- **Marginalspalte:** graues Band (`#D9D9D9`) 0–2,2 cm an der linken Papierkante,
  als schwebende Word-Tabelle (editierbar). Marginal-Inhalte (Kapitelnummer, Label,
  Registerlinie) stehen als Absätze mit negativem Einzug (–3,2 cm) im Band bei 1,0 cm.
- **Fußanker:** Haarlinie (`#D9D9D9`) in der Fußzeile auf identischer Höhe auf allen
  Seiten; unter ihr links Name · Beruf · Band (ab Seite 2), rechts Seitenindikator `NN / 04`.
  Deckblatt: nur Linie + `01 / 04` (keine Wiederholung von Name/Beruf — D7).

## 5. Leitidee & Signaturelemente

1. **Marginalband** auf jeder Seite → sofort erkennbare Familienzugehörigkeit.
2. **Präzisionslinie**: 1,5 pt `#C9B599` + kurzes Versatzstück `#99ADC9` darunter,
   zentriert unter jedem Seitentitel bzw. mittig auf dem Deckblatt (Linienfarben erlaubt).
3. **Passermarken**: `+`-Marken an den vier Ecken des Satzspiegels (Deckblatt),
   identische Größe/Farbe (`#C9B599`, Linienfarbe) — technische Registerlogik.
4. **Passepartout-Fotokarte**: graue Matte + weißes Fenster; beim Foto-Einsetzen bleibt
   die gestaltete Karte erhalten.

## 6. Icon-Regeln

- Quelle ausschließlich Tabler Icons (MIT, gepinnter Commit, siehe `assets/icons/ICON-LIZENZEN.md`).
- **Eine Farbrolle:** alle Icons `#1A1A1A`, ohne Ausnahme (fixt D8).
- Inline im Textabsatz, 14 px (Datenzeilen/Kontakt) bzw. 16 px (Bereichsüberschriften).
- Bilder als einzige Direktformatierung (Bildgröße ist nicht über Zeichenformatvorlagen steuerbar) — dokumentierte Ausnahme zu D5.

## 7. Abstands-Skala

4 / 8 / 16 / 40 / 80 / 160 / 320 twips (±). Panels innen 340 twips. Zwischen
Bereichsblöcken 200 twips vor der Bereichsüberschrift.

## 8. Bewusste DIN-5008-Abweichung (dokumentiert)

Absender- und Empfängerblock stehen **nebeneinander** (zwei Spalten am Briefkopf) statt
im DIN-Adressfeld — Nutzerentscheidung. Alle übrigen Briefelemente (Datum rechtsbündig,
fette Betreffzeile, Anrede, Grußformel, Unterschriftszone) bleiben DIN-orientiert.

## 9. Agenten-Platzhaltersystem

- Ein Platzhalter = **ein Run** (Helfer im Build-Skript garantiert das).
- Namen: `BEWERBER_*`, `FIRMA_*`, nummerierte Blöcke `SCHULE_n_*`, `PRAKTIKUM_n_*`,
  `STAERKE_n`, `HOBBY_n`, Leitfragen `ANSCREIBEN_*`, `MOTIVATION_*`.
- Vertrag: `platzhalter.json` (Key, Beschreibung, Beispiel, required, Dokumentteil).
- Füllung: `node build_template.js --data profil.json`; leere optionale Werte entfernen
  die zugehörige Zeile (Zeilen tragen Formatvorlage `Mappe Optional`).
