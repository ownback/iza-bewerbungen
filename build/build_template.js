// Bewerbungsmappe_Vorlage.docx — Build V3 (docx-js)
// Designsystem: Weißer Grund, graue Panels, Marginalspalte, benannte Formatvorlagen,
// kontrastsichere Platzhalter (Mappe Platzhalter), Agenten-Platzhalter (--data profil.json)
// Regel: #C9B599 / #99ADC9 sind NIE Textfarbe — nur Linien, Flächen, Marken.

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, VerticalAlign, HeightRule,
  ImageRun, Footer, PageNumber, LineRuleType, ShadingType, SectionType,
} = require("./node_modules/docx");

// ---------- Farben ----------
const INK = "1A1A1A";       // aller Text + alle Icons
const GREY = "D9D9D9";      // Flächen: Band, Panels, Karten, Linien
const SEC = "5A5A5A";       // Sekundärtext / Platzhalter
const ACCENT = "C9B599";    // nur Linien/Flächen/Marken
const ACCENT2 = "99ADC9";   // nur Versatzdetail
const WHITE = "FFFFFF";

// ---------- Profil-Daten (--data profil.json) ----------
let DATA = null;
const dataIdx = process.argv.indexOf("--data");
if (dataIdx !== -1 && process.argv[dataIdx + 1]) {
  DATA = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], "utf-8"));
}
// p(key): Profilwert oder [KEY]; Optionals: val(key) === undefined → Zeile entfällt
const val = (key) => (DATA ? DATA[key] : undefined);
const p = (key, opts = {}) => {
  const v = val(key);
  const text = v === undefined || v === null || v === "" ? `[${key}]` : v;
  return new TextRun({ text, style: "MappePlatzhalter", ...opts });
};
const t = (text, opts = {}) => new TextRun({ text, ...opts });

// Optionale Zeile: bei --data mit leerem/null Wert entfällt sie komplett (Formatvorlage Mappe Optional)
// Aufruf: optionalLine(key, elementOderFn) ODER optionalLine(key, hinweis, elementOderFn)
const optionalLine = (key, hinweis, make) => {
  const v = val(key);
  if (DATA && (v === undefined || v === null || v === "")) return [];
  const el = make || hinweis;
  return [typeof el === "function" ? el() : el];
};
// Bedingte Tabellenzeile: gleiche Logik für Datenzeilen
const optRow = optionalLine;

// ---------- Maße ----------
const CM = 567;
const M_LEFT = 2381;  // 4,2 cm (2,2 Band + 2,0)
const M_RIGHT = 1134; // 2,0 cm
const W = 11906 - M_LEFT - M_RIGHT; // 8391
const M_INDENT = -1814; // Marginaltext bei 1,0 cm von der Papierkante

const F_BODY = "IBM Plex Sans";
const MONT = "Montserrat SemiBold";

const PNG = (name) => path.join(__dirname, "..", "assets", "icons", "png", name);
const icon = (file, px) =>
  new ImageRun({ type: "png", data: fs.readFileSync(PNG(file)), transformation: { width: px, height: px } });

// ---------- Ränder / Border-Bausteine ----------
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = {
  top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
  insideHorizontal: noBorder, insideVertical: noBorder,
};
const cm = { top: 20, bottom: 20, left: 60, right: 60 };
const GREY_LINE = { style: BorderStyle.SINGLE, size: 6, color: GREY };

// ---------- Signatur: Präzisionslinie (Akzent = Linienfarbe, erlaubt) ----------
const precisionLine = (center = false) => {
  const segW = center ? 2270 : W;
  const side = (W - segW) / 2;
  const ind1 = center ? { left: side, right: side } : {};
  const ind2 = center
    ? { left: side + 800, right: side + 800 }
    : { right: W - 680 };
  return [
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 1 } },
      indent: ind1, spacing: { after: 20, line: 40, lineRule: LineRuleType.EXACT }, children: [],
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT2, space: 1 } },
      indent: ind2, spacing: { after: 160, line: 40, lineRule: LineRuleType.EXACT }, children: [],
    }),
  ];
};

// ---------- Marginalmarke: Kapitelnummer + Label in der Randzone ----------
// Flow-sicher (negative Einzüge statt schwebender Tabelle — Floating-Tables rendern
// in LibreOffice unzuverlässig, siehe PLAN.md), mit vertikaler Akzentkante
const chapterMark = (num, label) => [
  new Paragraph({
    style: "MappeKapitelmarke",
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
    children: [t(num)],
  }),
  new Paragraph({
    style: "MappeMarginal",
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
    children: [t(label)],
  }),
];

// ---------- Passermarken (Deckblatt): Ecken des Satzspiegels ----------
const cornerMarks = () =>
  new Paragraph({
    spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO },
    tabStops: [{ type: "right", position: W }],
    children: [t("+", { color: INK, size: 22, font: MONT }), t("\t"), t("+", { color: INK, size: 22, font: MONT })],
  });

// ---------- Passepartout-Fotokarte: graue Matte + weißes Fenster ----------
const photoCard = (outerW, innerW, innerH, hint) => {
  const pad = 227;
  return new Table({
    alignment: AlignmentType.CENTER,
    width: { size: outerW, type: WidthType.DXA },
    columnWidths: [outerW],
    borders: noBorders,
    rows: [
      new TableRow({
        height: { value: innerH + 2 * pad, rule: HeightRule.EXACT },
        children: [
          new TableCell({
            width: { size: outerW, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            shading: { type: ShadingType.CLEAR, fill: GREY },
            borders: noBorders,
            margins: { top: pad, bottom: pad, left: pad, right: pad },
            children: [
              new Table({
                alignment: AlignmentType.CENTER,
                width: { size: innerW, type: WidthType.DXA },
                columnWidths: [innerW],
                borders: noBorders,
                rows: [
                  new TableRow({
                    height: { value: innerH, rule: HeightRule.EXACT },
                    children: [
                      new TableCell({
                        width: { size: innerW, type: WidthType.DXA },
                        verticalAlign: VerticalAlign.CENTER,
                        shading: { type: ShadingType.CLEAR, fill: WHITE },
                        borders: {
                          top: GREY_LINE, bottom: GREY_LINE, left: GREY_LINE, right: GREY_LINE,
                        },
                        margins: { top: 40, bottom: 40, left: 40, right: 40 },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER, spacing: { after: 40 },
                            children: [t("FOTO EINFÜGEN", { size: 16, color: SEC })],
                          }),
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [t(hint, { size: 14, color: SEC })],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

// ---------- Fußzeile: Fußanker mit Marginal-Seitenindikator ----------
const footerFor = (num) =>
  new Footer({
    children: [
      new Paragraph({
        style: "MappeFusszeile",
        indent: { left: M_INDENT },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREY, space: 4 } },
        tabStops: [{ type: "left", position: 0 }, { type: "right", position: W }],
        children:
          num === "01"
            ? [t(`${num} / 04`)]
            : [
                t(`${num} / 04`),
                t("\t"),
                p("BEWERBER_NAME", { size: 16 }),
                t(` · Bewerbung als `),
                p("AUSBILDUNGSBERUF", { size: 16 }),
              ],
      }),
    ],
  });

// ================================================================
// Seite 1 — Deckblatt
// ================================================================
const deckblatt = [
  ...chapterMark("01", "DECKBLATT"),
  cornerMarks(),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),
  ...precisionLine(true),
  new Paragraph({
    style: "MappeDisplay",
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 60 },
    children: [t("BEWERBUNG")],
  }),
  new Paragraph({
    style: "MappeUntertitel",
    alignment: AlignmentType.CENTER,
    spacing: { after: 320 },
    children: [t("als "), p("AUSBILDUNGSBERUF")],
  }),
  photoCard(4140, 3686, 4593, "(6,5 × 8,1 cm, Seitenverhältnis 4:5)"),
  new Paragraph({
    style: "MappeNameZeile",
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 320 },
    children: [p("BEWERBER_NAME")],
  }),
  new Paragraph({
    style: "MappeKontaktZeile",
    alignment: AlignmentType.CENTER,
    children: [
      icon("map-pin_1A1A1A.png", 14), t("  ", { size: 18 }), p("BEWERBER_STRASSE"), t(", "), p("BEWERBER_PLZ_ORT"),
      t("    ·    "),
      icon("phone_1A1A1A.png", 14), t("  ", { size: 18 }), p("BEWERBER_TELEFON"),
      t("    ·    "),
      icon("mail_1A1A1A.png", 14), t("  ", { size: 18 }), p("BEWERBER_EMAIL"),
    ],
  }),
  ...optionalLine("BEWERBER_WEBSITE", "Website",
    new Paragraph({
      style: "MappeOptional",
      alignment: AlignmentType.CENTER,
      spacing: { before: 60 },
      children: [
        icon("world_1A1A1A.png", 14), t("  ", { size: 18 }), p("BEWERBER_WEBSITE"),
        t("  — Zeile löschen, falls nicht vorhanden"),
      ],
    })
  ),
  new Paragraph({ spacing: { before: 320, after: 0 }, children: [] }),

  // Anlagen-Karte: graues Panel mit Akzentkante, rechts unten, im Raster verankert
  new Table({
    alignment: AlignmentType.RIGHT,
    width: { size: 4700, type: WidthType.DXA },
    columnWidths: [4700],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4700, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: GREY },
            borders: {
              top: noBorder, bottom: noBorder, right: noBorder,
              left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT },
            },
            margins: { top: 120, bottom: 120, left: 180, right: 140 },
            children: [
              new Paragraph({
                style: "MappeKartenTitel",
                spacing: { after: 80 },
                children: [t("ANLAGEN")],
              }),
              ...["Lebenslauf", "Schulzeugnisse", "Praktikumsbescheinigungen", "Zertifikate"].map((x) =>
                new Paragraph({
                  style: "MappeListe",
                  children: [t(x)],
                })
              ),
              ...optionalLine("ANLAGE_WEITERE", "weitere Anlage",
                new Paragraph({
                  style: "MappeListe",
                  children: [
                    p("ANLAGE_WEITERE"),
                    t(" — optional, sonst Zeile löschen"),
                  ],
                })
              ),
            ],
          }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),
  cornerMarks(),
];

// ================================================================
// Seite 2 — Anschreiben
// ================================================================
const addrCell = (w, lines) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: noBorders,
    margins: cm,
    children: lines.map((l) =>
      Array.isArray(l)
        ? new Paragraph({ style: "MappeAdresse", children: l })
        : l
    ),
  });

const anschreiben = [
  ...chapterMark("02", "ANSCHREIBEN"),
  new Paragraph({
    style: "MappeTitel",
    spacing: { after: 60 },
    children: [t("ANSCHREIBEN")],
  }),
  ...precisionLine(),

  // Absender & Empfänger nebeneinander (bewusste DIN-Abweichung, siehe DESIGN-SYSTEM.md)
  new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [3800, 4591],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          addrCell(3800, [
            [p("BEWERBER_NAME", { bold: true })],
            [p("BEWERBER_STRASSE")],
            [p("BEWERBER_PLZ_ORT")],
            [p("BEWERBER_TELEFON")],
            [p("BEWERBER_EMAIL")],
          ]),
          addrCell(4591, [
            [p("FIRMA_NAME", { bold: true })],
            ...optionalLine("FIRMA_ABTEILUNG", "Abteilung", () =>
              new Paragraph({
                style: "MappeAdresse",
                children: [p("FIRMA_ABTEILUNG"), t(" — Zeile löschen, falls nicht vorhanden")],
              })
            ),
            [p("FIRMA_ANSPRECHPARTNER")],
            [p("FIRMA_STRASSE")],
            [p("FIRMA_PLZ_ORT")],
          ]),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { before: 240, after: 0 }, children: [] }),
  new Paragraph({ style: "MappeDatum", alignment: AlignmentType.RIGHT, children: [p("DATUM_ANSCREIBEN")] }),
  new Paragraph({ spacing: { before: 240, after: 0 }, children: [] }),
  new Paragraph({
    style: "MappeFliesstext",
    spacing: { after: 40 },
    children: [t("Bewerbung um die Ausbildungsstelle als ", { bold: true }), p("AUSBILDUNGSBERUF", { bold: true })],
  }),
  ...optionalLine("STELLE_FUNDORT_REFNR", "Fundort/Ref.-Nr.", () =>
    new Paragraph({
      style: "MappeOptional",
      children: [
        p("STELLE_FUNDORT_REFNR"),
        t(" — Fundort / Referenznummer, Zeile löschen, falls nicht vorhanden"),
      ],
    })
  ),
  new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),
  new Paragraph({ style: "MappeFliesstext", children: [t("Sehr geehrte/r "), p("FIRMA_ANSPRECHPARTNER"), t(",")] }),
  new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("ANSCREIBEN_EINSTIEG")] }),
  new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("ANSCREIBEN_BERUF")] }),
  new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("ANSCREIBEN_PRAXIS")] }),
  new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("ANSCREIBEN_ABSCHLUSS")] }),
  new Paragraph({ style: "MappeFliesstext", spacing: { after: 240 }, children: [p("ANSCREIBEN_SCHLUSS")] }),
  new Paragraph({ style: "MappeFliesstext", children: [t("Freundliche Grüße")] }),
  // Unterschriftszone: 3 Zeilen Freiraum mit sichtbarer Baseline (D9)
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GREY, space: 2 } },
    indent: { right: W - 2400 },
    spacing: { before: 1000, line: 40, lineRule: LineRuleType.EXACT },
    children: [],
  }),
  new Paragraph({ style: "MappeFliesstext", spacing: { before: 40 }, children: [p("BEWERBER_NAME")] }),
  // Anlagen-Zeile (D9) — unterer Block im Fußanker-Bereich
  new Paragraph({
    style: "MappeKartenTitel",
    spacing: { before: 700, after: 40 },
    children: [t("ANLAGEN")],
  }),
  new Paragraph({
    style: "MappeListe",
    children: [t("Lebenslauf · Schulzeugnisse · Praktikumsbescheinigungen · Zertifikate")],
  }),
];

// ================================================================
// Seite 3 — Lebenslauf
// ================================================================
const lcKontakt = (png, runs) =>
  new Paragraph({
    style: "MappeDatenzeile",
    spacing: { after: 40 },
    children: [icon(png, 14), t("  ", { size: 18 }), ...runs],
  });

const lebenslaufKopf = new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [5671, 2720],
  borders: noBorders,
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 5671, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          borders: noBorders,
          margins: cm,
          children: [
            lcKontakt("user_1A1A1A.png", [p("BEWERBER_NAME", { bold: true, font: MONT, size: 28 })]),
            lcKontakt("calendar_1A1A1A.png", [p("BEWERBER_GEBURTSDATUM"), t(" in "), p("BEWERBER_GEBURTSORT")]),
            lcKontakt("map-pin_1A1A1A.png", [p("BEWERBER_STRASSE"), t(", "), p("BEWERBER_PLZ_ORT")]),
            lcKontakt("phone_1A1A1A.png", [p("BEWERBER_TELEFON")]),
            lcKontakt("mail_1A1A1A.png", [p("BEWERBER_EMAIL")]),
          ],
        }),
        new TableCell({
          width: { size: 2720, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          borders: noBorders,
          margins: { top: 0, bottom: 0, left: 0, right: 0 },
          children: [photoCard(2720, 2268, 2835, "(4 × 5 cm)")],
        }),
      ],
    }),
  ],
});

// Datenraster: Datum | Inhalt
const dataRow = (date, runs, iconFile) =>
  new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 2722, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders, margins: cm,
        children: [new Paragraph({ style: "MappeDatum", children: date ? [date] : [] })],
      }),
      new TableCell({
        width: { size: W - 2722, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders, margins: cm,
        children: [
          new Paragraph({
            style: "MappeDatenzeile",
            children: iconFile ? [icon(iconFile, 14), t("  ", { size: 18 }), ...runs] : runs,
          }),
        ],
      }),
    ],
  });

const dataTable = (rows) =>
  new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [2722, W - 2722],
    borders: noBorders,
    rows,
  });

// Kenntnisse: eigenes Raster — Label (mit Icon) | Inhalt
const kenntnisRow = (iconFile, label, runs) =>
  new TableRow({
    cantSplit: true,
    children: [
      new TableCell({
        width: { size: 4200, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders, margins: cm,
        children: [
          new Paragraph({
            style: "MappeDatenzeile",
            children: [icon(iconFile, 14), t("  ", { size: 18 }), t(label, { bold: true })],
          }),
        ],
      }),
      new TableCell({
        width: { size: W - 4200, type: WidthType.DXA },
        verticalAlign: VerticalAlign.CENTER,
        borders: noBorders, margins: cm,
        children: [new Paragraph({ style: "MappeDatenzeile", children: runs })],
      }),
    ],
  });

const kenntnisseTable = (rows) =>
  new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [4200, W - 4200],
    borders: noBorders,
    rows,
  });

// Hobbys: 3 gleichbreite Zellen mit Icon + Platzhalter, einzeln löschbar
const hobbyCell = (iconFile, key) =>
  new TableCell({
    width: { size: Math.floor(W / 3), type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    borders: noBorders, margins: cm,
    children: [
      new Paragraph({
        style: "MappeDatenzeile",
        children: [icon(iconFile, 14), t("  ", { size: 18 }), p(key)],
      }),
    ],
  });

const d = (key) => p(key, { size: 20 }); // Datum 9,5 pt

const lebenslauf = [
  ...chapterMark("03", "LEBENSLAUF"),
  new Paragraph({
    style: "MappeTitel",
    spacing: { after: 60 },
    children: [t("LEBENSLAUF")],
  }),
  ...precisionLine(),
  lebenslaufKopf,

  new Paragraph({
    style: "MappeBereich",
    spacing: { before: 160, after: 60 },
    children: [icon("school_1A1A1A.png", 16), t("  ", { size: 22 }), t("SCHULBILDUNG")],
  }),
  dataTable([
    dataRow(d("SCHULE_1_ZEITRAUM"), [p("SCHULE_1_NAME"), t(", "), p("SCHULE_1_ORT"), t(", Abschluss: "), p("SCHULE_1_ABSCHLUSS"), t(", voraussichtlich "), p("SCHULE_1_ABSCHLUSS_MONAT")]),
    ...optRow("SCHULE_2_ZEITRAUM", () => dataRow(d("SCHULE_2_ZEITRAUM"), [p("SCHULE_2_NAME"), t(", "), p("SCHULE_2_ORT")])),
  ]),

  new Paragraph({
    style: "MappeBereich",
    spacing: { before: 160, after: 60 },
    children: [icon("briefcase_1A1A1A.png", 16), t("  ", { size: 22 }), t("PRAKTISCHE ERFAHRUNGEN")],
  }),
  dataTable([
    dataRow(d("PRAKTIKUM_1_ZEITRAUM"), [p("PRAKTIKUM_1_BEREICH"), t(", "), p("PRAKTIKUM_1_UNTERNEHMEN"), t(", "), p("PRAKTIKUM_1_ORT")]),
    ...optRow("PRAKTIKUM_2_ZEITRAUM", () => dataRow(d("PRAKTIKUM_2_ZEITRAUM"), [p("PRAKTIKUM_2_BEREICH"), t(", "), p("PRAKTIKUM_2_UNTERNEHMEN"), t(", "), p("PRAKTIKUM_2_ORT")])),
  ]),

  new Paragraph({
    style: "MappeBereich",
    spacing: { before: 160, after: 60 },
    children: [icon("adjustments_1A1A1A.png", 16), t("  ", { size: 22 }), t("KENNTNISSE & KOMPETENZEN")],
  }),
  kenntnisseTable([
    kenntnisRow("device-desktop-code_1A1A1A.png", "Softwarekenntnisse", [p("KENNNTNIS_SOFTWARE"), t(" — "), p("KENNNTNIS_SOFTWARE_LEVEL")]),
    kenntnisRow("language_1A1A1A.png", "Sprachkenntnisse", [p("KENNNTNIS_SPRACHE"), t(" — "), p("KENNNTNIS_SPRACHE_LEVEL")]),
    kenntnisRow("cube-3d-sphere_1A1A1A.png", "CAD & Konstruktion", [p("KENNNTNIS_CAD")]),
    kenntnisRow("dumbbell_1A1A1A.png", "Persönliche Stärken", [p("STAERKE_1"), t(", "), p("STAERKE_2"), t(", "), p("STAERKE_3")]),
  ]),

  new Paragraph({
    style: "MappeBereich",
    spacing: { before: 160, after: 60 },
    children: [icon("device-gamepad_1A1A1A.png", 16), t("  ", { size: 22 }), t("INTERESSEN & HOBBYS")],
  }),
  new Table({
    width: { size: W, type: WidthType.DXA },
    columnWidths: [2797, 2797, 2797],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          hobbyCell("compass_1A1A1A.png", "HOBBY_1"),
          hobbyCell("compass_1A1A1A.png", "HOBBY_2"),
          hobbyCell("compass_1A1A1A.png", "HOBBY_3"),
        ],
      }),
    ],
  }),

  new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),
  new Paragraph({
    style: "MappeDatum",
    alignment: AlignmentType.RIGHT,
    spacing: { after: 100 },
    children: [p("BEWERBER_ORT"), t(", "), p("DATUM_LEBENSLAUF")],
  }),
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: INK, space: 2 } },
    indent: { left: W - 3000 },
    spacing: { before: 120, line: 40, lineRule: LineRuleType.EXACT },
    children: [],
  }),
  new Paragraph({
    style: "MappeFusszeile",
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40 },
    children: [t("Unterschrift")],
  }),
];

// ================================================================
// Seite 4 — Motivationsschreiben
// ================================================================
const motivationPanel = new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [W],
  borders: noBorders,
  rows: [
    new TableRow({
    height: { value: 6800, rule: "atLeast" },
    children: [
    new TableCell({
    width: { size: W, type: WidthType.DXA },
            shading: { type: ShadingType.CLEAR, fill: GREY },
          borders: {
            top: noBorder, bottom: noBorder, right: noBorder,
            left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT },
          },
          margins: { top: 340, bottom: 340, left: 400, right: 400 },
          children: [
            new Paragraph({
              style: "MappeLeitfrage",
              spacing: { after: 240 },
              children: [p("MOTIVATION_LEITFRAGE")],
            }),
            new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("MOTIVATION_EINSTIEG")] }),
            new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("MOTIVATION_TECHNIK_GESTALTUNG")] }),
            new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("MOTIVATION_PASSUNG")] }),
            new Paragraph({ style: "MappeFliesstext", spacing: { after: 200 }, children: [p("MOTIVATION_LERNZIEL")] }),
            new Paragraph({ style: "MappeFliesstext", children: [p("MOTIVATION_AUSBLICK")] }),
          ],
        }),
      ],
    }),
  ],
});

const motivation = [
  ...chapterMark("04", "MOTIVATION"),
  new Paragraph({
    style: "MappeTitel",
    spacing: { after: 60 },
    children: [t("MOTIVATION")],
  }),
  ...precisionLine(),
  motivationPanel,
  new Paragraph({
    style: "MappeDatum",
    alignment: AlignmentType.RIGHT,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREY, space: 8 } },
    spacing: { before: 600 },
    children: [p("BEWERBER_ORT"), t(", "), p("DATUM_MOTIVATION")],
  }),
];

// ================================================================
// Dokument
// ================================================================
const FONT_BODY = { ascii: F_BODY, hAnsi: F_BODY, cs: F_BODY };
const FONT_HEAD = { ascii: MONT, hAnsi: MONT, cs: MONT };

const doc = new Document({
  creator: "Bewerbungsmappe Vorlage",
  title: "Bewerbungsmappe_Vorlage",
  styles: {
    default: {
      document: {
        run: { font: FONT_BODY, size: 22, color: INK },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
    },
    characterStyles: [
      {
        id: "MappePlatzhalter",
        name: "Mappe Platzhalter",
        basedOn: "DefaultParagraphFont",
        run: { color: SEC, shading: { type: ShadingType.CLEAR, fill: GREY } },
      },
    ],
    paragraphStyles: [
      {
        id: "MappeDisplay", name: "Mappe Display",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 68, color: INK },
        paragraph: { spacing: { line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeUntertitel", name: "Mappe Untertitel",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 30, color: INK },
        paragraph: { spacing: { line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeNameZeile", name: "Mappe Namezeile",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 28, color: INK },
      },
      {
        id: "MappeTitel", name: "Mappe Titel",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 32, color: INK },
        paragraph: { spacing: { line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeKapitelmarke", name: "Mappe Kapitelmarke",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 18, color: INK },
        paragraph: {
          indent: { left: M_INDENT },
          spacing: { after: 20, line: 240, lineRule: LineRuleType.AUTO },
        },
      },
      {
        id: "MappeMarginal", name: "Mappe Marginal",
        basedOn: "Normal",
        run: { font: FONT_BODY, size: 16, color: SEC, characterSpacing: 20 },
        paragraph: {
          indent: { left: M_INDENT },
          spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO },
        },
      },
      {
        id: "MappeBereich", name: "Mappe Bereich",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 22, color: INK, characterSpacing: 30 },
        paragraph: {
          border: { bottom: GREY_LINE },
          spacing: { line: 240, lineRule: LineRuleType.AUTO },
        },
      },
      {
        id: "MappeFliesstext", name: "Mappe Fließtext",
        basedOn: "Normal",
        run: { color: INK },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeAdresse", name: "Mappe Adresse",
        basedOn: "MappeFliesstext",
        run: { color: INK },
        paragraph: { spacing: { after: 40, line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeDatenzeile", name: "Mappe Datenzeile",
        basedOn: "Normal",
        run: { color: INK },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeDatum", name: "Mappe Datum",
        basedOn: "Normal",
        run: { size: 19, color: SEC },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeOptional", name: "Mappe Optional",
        basedOn: "Normal",
        run: { size: 20, color: SEC },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeLeitfrage", name: "Mappe Leitfrage",
        basedOn: "Normal",
        run: { size: 24, italics: true, color: INK },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeKontaktZeile", name: "Mappe Kontaktzeile",
        basedOn: "Normal",
        run: { size: 20, color: INK },
        paragraph: { spacing: { line: 300, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeListe", name: "Mappe Liste",
        basedOn: "Normal",
        run: { size: 20, color: INK },
        paragraph: { spacing: { after: 40, line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeKartenTitel", name: "Mappe Kartentitel",
        basedOn: "Normal",
        run: { font: FONT_HEAD, size: 20, color: SEC, characterSpacing: 30 },
        paragraph: { spacing: { line: 240, lineRule: LineRuleType.AUTO } },
      },
      {
        id: "MappeFusszeile", name: "Mappe Fußzeile",
        basedOn: "Normal",
        run: { size: 16, color: SEC },
        paragraph: { spacing: { line: 240, lineRule: LineRuleType.AUTO } },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "anlagen",
        levels: [
          {
            level: 0,
            format: "bullet",
            text: "–",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 280, hanging: 280 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: M_LEFT, right: M_RIGHT } } },
      footers: { default: footerFor("01") },
      children: deckblatt,
    },
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: M_LEFT, right: M_RIGHT } }, type: SectionType.NEXT_PAGE },
      footers: { default: footerFor("02") },
      children: anschreiben,
    },
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: M_LEFT, right: M_RIGHT } }, type: SectionType.NEXT_PAGE },
      footers: { default: footerFor("03") },
      children: lebenslauf,
    },
    {
      properties: { page: { margin: { top: 1134, bottom: 1134, left: M_LEFT, right: M_RIGHT } }, type: SectionType.NEXT_PAGE },
      footers: { default: footerFor("04") },
      children: motivation,
    },
  ],
});

// ================================================================
// Marginalmarken stehen als negative-Einzug-Absätze im Fluss (flow-sicher).
// ================================================================

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, "..", "Bewerbungsmappe_Vorlage.docx"), buf);
  console.log("OK: Bewerbungsmappe_Vorlage.docx geschrieben,", buf.length, "Bytes", DATA ? "(mit Profil-Daten)" : "(Master-Vorlage)");
});
