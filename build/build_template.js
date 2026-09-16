// Bewerbungsmappe_Vorlage.docx — Build-Skript V2 (docx-js)
// Designsystem "Präzisionslinie" auf Grau: IBM Plex Sans + Montserrat
// Seitenhintergrund #D9D9D9 · Text #1A1A1A · Weiß als Strukturfarbe · Akzente #C9B599 / #99ADC9

const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, VerticalAlign, HeightRule,
  ImageRun, Footer, PageNumber, LineRuleType, ShadingType, SectionType,
} = require("./node_modules/docx");

// ---------- Konstanten ----------
const INK = "1A1A1A";
const BG = "D9D9D9";
const WHITE = "FFFFFF";
const ACCENT = "C9B599";
const ACCENT2 = "99ADC9";

const F_BODY = "IBM Plex Sans";
const MONT = "Montserrat SemiBold";

const CM = 567;
const PNG = (name) => path.join(__dirname, "..", "assets", "icons", "png", name);
const icon = (file, px) =>
  new ImageRun({ type: "png", data: fs.readFileSync(PNG(file)), transformation: { width: px, height: px } });

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = {
  top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
  insideHorizontal: noBorder, insideVertical: noBorder,
};
const cellMargins = { top: 40, bottom: 40, left: 60, right: 60 };

// ---------- Hilfsbauer ----------
const ph = (text, opts = {}) => new TextRun({ text, color: ACCENT2, ...opts });
const t = (text, opts = {}) => new TextRun({ text, color: INK, ...opts });

const body = (children, opts = {}) =>
  new Paragraph({
    children,
    spacing: { line: 276, lineRule: LineRuleType.AUTO, ...(opts.spacing || {}) },
    alignment: opts.alignment,
    indent: opts.indent,
    border: opts.border,
  });

const spacer = (pt, after = 0) =>
  new Paragraph({ children: [t("", { size: pt * 2 })], spacing: { after, line: 240, lineRule: LineRuleType.AUTO } });

// Signatur-Element: Präzisionslinie (Akzent) + kurzes Versatzstück (Sekundärakzent)
// mode "full": über Satzspiegelbreite · mode "center": kurzes zentriertes Element
const precisionLine = (contentWidth, mainSize = 12, center = false) => {
  const segW = center ? 2270 : contentWidth;
  const side = (contentWidth - segW) / 2;
  const indent = center ? { left: side, right: side } : { right: contentWidth - 680 };
  return [
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: mainSize, color: ACCENT, space: 1 } },
      indent,
      spacing: { after: 20, line: 40, lineRule: LineRuleType.EXACT },
      children: [],
    }),
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: mainSize, color: ACCENT2, space: 1 } },
      indent: center
        ? { left: side + 800, right: side + 800 }
        : { right: contentWidth - 680 },
      spacing: { after: 160, line: 40, lineRule: LineRuleType.EXACT },
      children: [],
    }),
  ];
};

// Kapitelmarke: kleine gesperrte Zeile in Warmakzent über dem Seitentitel
const chapterMark = (label) =>
  new Paragraph({
    spacing: { after: 60 },
    children: [t(label, { font: MONT, size: 18, characterSpacing: 40, color: ACCENT })],
  });

// Bereichsüberschrift mit Inline-Icon + weißer Regellinie
const sectionHead = (png, title, contentWidth) =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: WHITE, space: 4 } },
    spacing: { before: 200, after: 80 },
    children: [icon(png, 16), t("  ", { size: 22 }), t(title, { font: MONT, size: 22, characterSpacing: 30 })],
  });

// Foto-Platzhalterzelle: weiße Karte, Akzentrahmen, fixe Größe
const photoCell = (wDxa, hDxa, caption, span) =>
  new TableCell({
    width: { size: wDxa, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.CLEAR, fill: WHITE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
      left: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
      right: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
    },
    ...(span ? { rowSpan: span } : {}),
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [t(caption, { size: 16 })],
      }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [t("(Seitenverhältnis 4:5)", { size: 14 })] }),
    ],
  });

const datePh = (text) => ph(text, { size: 20 });

const runs = (arr, iconFile) => ({ runs: arr, icon: iconFile });

// LC-Datenzeilen-Raster: Datum | Inhalt (Icons inline im Inhalt)
const dataRows = (rows, contentWidth, wDate = 2722) =>
  new Table({
    width: { size: contentWidth, type: WidthType.DXA },
    columnWidths: [wDate, contentWidth - wDate],
    borders: noBorders,
    rows: rows.map(
      ([date, item]) =>
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: wDate, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              borders: noBorders,
              margins: cellMargins,
              children: [new Paragraph({ children: date ? [date] : [] })],
            }),
            new TableCell({
              width: { size: contentWidth - wDate, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              borders: noBorders,
              margins: cellMargins,
              children: [
                new Paragraph({
                  children: item.icon
                    ? [icon(item.icon, 14), t("  ", { size: 18 }), ...item.runs]
                    : item.runs,
                }),
              ],
            }),
          ],
        })
    ),
  });

// ---------- Section 1: Deckblatt ----------
const W1 = 9072;

// Registrierungskreuz (CAD-Feinheit)
const cross = (alignment) =>
  new Paragraph({
    alignment,
    spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [t("+", { size: 20, color: ACCENT2 })],
  });

// Foto-Karte mittig: schmale 1-Spalten-Tabelle, zentriert
const deckblattFoto = new Table({
  alignment: AlignmentType.CENTER,
  width: { size: 3685, type: WidthType.DXA },
  columnWidths: [3685],
  borders: noBorders,
  rows: [
    new TableRow({
      height: { value: 4593, rule: HeightRule.EXACT },
      children: [photoCell(3685, 4593, "FOTO EINFÜGEN")],
    }),
  ],
});

// Anlagen-Karte unten rechts: weiße Karte mit Akzentkante links
const bullet = (children) =>
  new Paragraph({
    numbering: { reference: "anlagen", level: 0 },
    spacing: { after: 40, line: 240, lineRule: LineRuleType.AUTO },
    children,
  });

const anlagenKarte = new Table({
  alignment: AlignmentType.RIGHT,
  width: { size: 3970, type: WidthType.DXA },
  columnWidths: [3970],
  borders: noBorders,
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 3970, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: WHITE },
          borders: {
            top: noBorder, bottom: noBorder, right: noBorder,
            left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT },
          },
          margins: { top: 100, bottom: 100, left: 160, right: 120 },
          children: [
            new Paragraph({
              spacing: { after: 80 },
              children: [t("ANLAGEN", { font: MONT, size: 20, characterSpacing: 30, color: ACCENT })],
            }),
            bullet([t("Lebenslauf", { size: 20 })]),
            bullet([t("Schulzeugnisse", { size: 20 })]),
            bullet([t("Praktikumsbescheinigungen", { size: 20 })]),
            bullet([t("Zertifikate", { size: 20 })]),
            bullet([ph("[WEITERE NACHWEISE] – optional", { size: 20 })]),
          ],
        }),
      ],
    }),
  ],
});

const deckblatt = [
  cross(AlignmentType.RIGHT),
  ...precisionLine(W1, 12, true),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 60 },
    children: [t("BEWERBUNG", { font: MONT, size: 68 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360 },
    children: [ph("als [AUSBILDUNGSBERUF]", { font: MONT, size: 30, color: ACCENT })],
  }),
  deckblattFoto,
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 480 },
    children: [ph("[VORNAME NACHNAME]", { font: MONT, size: 28 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [
      icon("map-pin_1A1A1A.png", 14), t("  ", { size: 18 }), ph("[STRASSE HAUSNUMMER], [PLZ ORT]", { size: 20 }),
      t("    ·    ", { size: 20 }),
      icon("phone_1A1A1A.png", 14), t("  ", { size: 18 }), ph("[TELEFON]", { size: 20 }),
      t("    ·    ", { size: 20 }),
      icon("mail_1A1A1A.png", 14), t("  ", { size: 18 }), ph("[E-MAIL]", { size: 20 }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [
      icon("world_1A1A1A.png", 14), t("  ", { size: 18 }), ph("[WEBSITE] – optional, Zeile sonst löschen", { size: 20 }),
    ],
  }),
  new Paragraph({ spacing: { before: 400, after: 0 }, children: [] }),
  cross(AlignmentType.LEFT),
  anlagenKarte,
];

// ---------- Section 2: Anschreiben ----------
const line11 = (children) => body(children, { spacing: { after: 40, line: 240, lineRule: LineRuleType.AUTO } });
const addrCell = (w, lines) =>
  new TableCell({
    width: { size: w, type: WidthType.DXA },
    borders: noBorders,
    margins: cellMargins,
    children: lines.map((children) => line11(children)),
  });

const guide = (text) => new Paragraph({ spacing: { after: 160, line: 276, lineRule: LineRuleType.AUTO }, children: [ph(text)] });

const W2 = 9356;

const anschreiben = [
  chapterMark("01 · ANSCHREIBEN"),
  new Table({
    width: { size: W2, type: WidthType.DXA },
    columnWidths: [4290, 5066],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          addrCell(4290, [
            [ph("[VORNAME NACHNAME]", { bold: true })],
            [ph("[STRASSE HAUSNUMMER]")],
            [ph("[PLZ ORT]")],
            [ph("[TELEFON]")],
            [ph("[E-MAIL]")],
          ]),
          addrCell(5066, [
            [ph("[UNTERNEHMEN]", { bold: true })],
            [ph("[ABTEILUNG] – optional, Zeile sonst löschen")],
            [ph("[Herrn/Frau ANSPRECHPARTNER]")],
            [ph("[STRASSE HAUSNUMMER]")],
            [ph("[PLZ ORT]")],
          ]),
        ],
      }),
    ],
  }),
  spacer(11), spacer(11),
  body([t("TT.MM.JJJJ")], { alignment: AlignmentType.RIGHT, spacing: { line: 240, lineRule: LineRuleType.AUTO } }),
  spacer(11), spacer(11),
  body([t("Bewerbung um die Ausbildungsstelle als ", { bold: true }), ph("[AUSBILDUNGSBERUF]", { bold: true }), t(" – ", { bold: true }), ph("[Fundort/Ref.-Nr., optional]", { bold: true })], { spacing: { line: 240, lineRule: LineRuleType.AUTO } }),
  spacer(11),
  line11([t("Sehr geehrte/r "), ph("[ANSPRECHPARTNER]"), t(",")]),
  guide("[Einstieg: Wo hast du die Stelle gefunden und warum bewirbst du dich genau bei diesem Betrieb? (1–2 Sätze)]"),
  guide("[Bezug zum Beruf: Was reizt dich an der Arbeit als Technische/r Produktdesigner/in – zeichnen, konstruieren, am Bildschirm und am Produkt? (1–2 Sätze)]"),
  guide("[Praxisbezug: Praktikum, Schulfach oder Hobby, das dich dafür qualifiziert – konkret und belegbar. (2 Sätze)]"),
  guide("[Schulabschluss: Welchen Abschluss machst du und wann? Verwende dieselbe Schreibweise wie im Lebenslauf.]"),
  guide("[Schluss: Wunsch nach einem Vorstellungsgespräch oder Praktikum, freundlich und direkt. (1 Satz)]"),
  line11([t("Freundliche Grüße")]),
  spacer(11), spacer(11), spacer(11),
  line11([ph("[VORNAME NACHNAME]")]),
];

// ---------- Section 3: Lebenslauf ----------
const W3 = 9356;

// Kopfbereich: links Kontaktdaten mit Inline-Icons, rechts Foto-Karte
const lcKontakt = (png, children) =>
  new Paragraph({
    spacing: { after: 80, line: 240, lineRule: LineRuleType.AUTO },
    children: [icon(png, 14), t("  ", { size: 18 }), ...children],
  });

const lebenslaufKopf = new Table({
  width: { size: W3, type: WidthType.DXA },
  columnWidths: [5671, 3685],
  borders: noBorders,
  rows: [
    new TableRow({
      height: { value: 2835, rule: HeightRule.EXACT },
      children: [
        new TableCell({
          width: { size: 5671, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          borders: noBorders,
          margins: cellMargins,
          children: [
            lcKontakt("user_1A1A1A.png", [ph("[VORNAME NACHNAME]", { font: MONT, size: 28 })]),
            lcKontakt("calendar_1A1A1A.png", [ph("[GEBURTSDATUM] in [GEBURTSORT]")]),
            lcKontakt("map-pin_1A1A1A.png", [ph("[STRASSE HAUSNUMMER], [PLZ ORT]")]),
            lcKontakt("phone_1A1A1A.png", [ph("[TELEFON]")]),
            lcKontakt("mail_1A1A1A.png", [ph("[E-MAIL]")]),
          ],
        }),
        new TableCell({
          width: { size: 3685, type: WidthType.DXA },
          verticalAlign: VerticalAlign.CENTER,
          shading: { type: ShadingType.CLEAR, fill: WHITE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
            left: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
            right: { style: BorderStyle.SINGLE, size: 8, color: ACCENT },
          },
          margins: cellMargins,
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [t("FOTO EINFÜGEN", { size: 16 })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [t("(4:5, gleicher Zuschnitt wie Deckblatt)", { size: 14 })] }),
          ],
        }),
      ],
    }),
  ],
});

// lebenslaufKopf Fotozelle: 4 cm hoch statt volle Zeile — Höhe über Zeile steuern
const lebenslauf = [
  chapterMark("02 · LEBENSLAUF"),
  new Paragraph({
    spacing: { after: 60 },
    children: [t("LEBENSLAUF", { font: MONT, size: 32 })],
  }),
  ...precisionLine(W3, 10),
  lebenslaufKopf,

  sectionHead("school_C9B599.png", "SCHULBILDUNG", W3),
  dataRows([
    [datePh("[TT.MM.JJJJ – TT.MM.JJJJ]"), runs([ph("[SCHULE]"), t(", "), ph("[ORT]"), t(", Schulabschluss: "), ph("[ABSCHLUSS]"), t(", voraussichtlich "), ph("[MONAT JAHR]")])],
    [datePh("[TT.MM.JJJJ – TT.MM.JJJJ]"), runs([ph("[GRUNDSCHULE]"), t(", "), ph("[ORT]")])],
  ], W3),

  sectionHead("briefcase_C9B599.png", "PRAKTISCHE ERFAHRUNGEN", W3),
  dataRows([
    [datePh("[TT.MM.JJJJ – TT.MM.JJJJ]"), runs([ph("[Praktikum im Bereich]"), t(", "), ph("[UNTERNEHMEN]"), t(", "), ph("[ORT]")])],
    [datePh("[TT.MM.JJJJ – TT.MM.JJJJ]"), runs([ph("[Aushilfstätigkeit / Ehrenamt im Bereich]"), t(", "), ph("[BETRIEB]"), t(", "), ph("[ORT]")])],
  ], W3),

  sectionHead("adjustments_C9B599.png", "KENNTNISSE & KOMPETENZEN", W3),
  dataRows([
    [null, runs([t("Softwarekenntnisse: ", { bold: true }), ph("[Software]"), t(" – "), ph("[Kenntnisstand]")], "device-desktop-code_1A1A1A.png")],
    [null, runs([t("Sprachkenntnisse: ", { bold: true }), ph("[Sprache]"), t(" – "), ph("[Kenntnisstand]")], "language_1A1A1A.png")],
    [null, runs([t("CAD & Konstruktion: ", { bold: true }), ph("[CAD-Software / technisches Interesse]")], "cube-3d-sphere_1A1A1A.png")],
    [null, runs([t("Persönliche Stärken: ", { bold: true }), ph("[Stärke 1]"), t(", "), ph("[Stärke 2]"), t(", "), ph("[Stärke 3]")], "dumbbell_C9B599.png")],
  ], W3),

  sectionHead("device-gamepad_C9B599.png", "INTERESSEN & HOBBYS", W3),
  new Table({
    width: { size: W3, type: WidthType.DXA },
    columnWidths: [W3],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: W3, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            children: [
              new Paragraph({
                children: [ph("[Hobby 1]"), t(", "), ph("[Hobby 2]"), t(", "), ph("[Hobby 3]")],
              }),
            ],
          }),
        ],
      }),
    ],
  }),

  new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),
  body([ph("[ORT]"), t(", TT.MM.JJJJ")], { alignment: AlignmentType.RIGHT, spacing: { after: 160 } }),
  new Table({
    width: { size: W3, type: WidthType.DXA },
    columnWidths: [6356, 3000],
    borders: noBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 6356, type: WidthType.DXA },
            borders: noBorders,
            margins: cellMargins,
            children: [new Paragraph({ children: [] })],
          }),
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 6, color: INK } },
            margins: cellMargins,
            children: [new Paragraph({ children: [] })],
          }),
        ],
      }),
    ],
  }),
  body([t("Unterschrift", { size: 16 })], { alignment: AlignmentType.RIGHT, spacing: { before: 40 } }),
];

// ---------- Section 4: Motivationsschreiben ----------
const zitat = (text) =>
  new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 12 } },
    indent: { left: 227 },
    spacing: { after: 200, line: 276, lineRule: LineRuleType.AUTO },
    children: [ph(text)],
  });

const motivation = [
  chapterMark("03 · MOTIVATION"),
  new Paragraph({
    spacing: { after: 40 },
    children: [t("MOTIVATION", { font: MONT, size: 32 })],
  }),
  ...precisionLine(W3, 10),
  new Paragraph({
    spacing: { before: 120, after: 0 },
    children: [t("„", { font: MONT, size: 72, color: ACCENT })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 320 },
    children: [
      new TextRun({ text: "[Warum dieser Beruf? Ein Satz, der Neugier weckt.]", italics: true, color: ACCENT2, size: 28 }),
    ],
  }),
  zitat("[Erster Kontakt: Wie bist du auf technisches Produktdesign gestoßen – durch ein Praktikum, ein Hobby, ein Gespräch? Was hat dich gepackt? (2–3 Sätze)]"),
  zitat("[Begeisterung für die Verbindung von Technik und Gestaltung: Zeichnen, konstruieren, modelieren, verstehen, wie Dinge gebaut werden. Konkret bleiben. (2–3 Sätze)]"),
  zitat("[Passt der Beruf zu dir: Nenne persönliche Eigenschaften und verknüpfe sie mit der Ausbildung – ohne sich zu verkaufen. (2 Sätze)]"),
  zitat("[Lernen & Entwicklung: Was willst du in der Ausbildung lernen und können? Zeig Lernbereitschaft. (2 Sätze)]"),
  zitat("[Blick nach vorn: Wo siehst du dich, wenn die Ausbildung gelungen ist? Ein ruhiger, ehrlicher Schlusssatz. (1–2 Sätze)]"),
  new Paragraph({ spacing: { before: 240, after: 0 }, children: [] }),
  new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: WHITE, space: 8 } },
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 0, line: 240, lineRule: LineRuleType.AUTO },
    children: [ph("[ORT]"), t(", TT.MM.JJJJ")],
  }),
];

// ---------- Footer ----------
const FOOTER_TAB = W3;

const footerWith = (no) =>
  new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: WHITE, space: 4 } },
        tabStops: [{ type: "right", position: FOOTER_TAB }],
        spacing: { line: 240, lineRule: LineRuleType.AUTO },
        children: [
          ph("[VORNAME NACHNAME]", { size: 16 }),
          t(" · Bewerbung als ", { size: 16 }),
          ph("[AUSBILDUNGSBERUF]", { size: 16 }),
          ...(no
            ? [t("\t", { size: 16 }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: INK })]
            : []),
        ],
      }),
    ],
  });

// ---------- Dokument ----------
const doc = new Document({
  creator: "Bewerbungsmappe Vorlage",
  title: "Bewerbungsmappe_Vorlage",
  background: { color: BG },
  styles: {
    default: {
      document: {
        run: { font: F_BODY, size: 22, color: INK },
        paragraph: { spacing: { line: 276, lineRule: LineRuleType.AUTO } },
      },
    },
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
      properties: {
        page: { margin: { top: 1134, bottom: 1134, left: 1417, right: 1417 } },
      },
      footers: { default: footerWith(false) },
      children: deckblatt,
    },
    {
      properties: {
        page: { margin: { top: 1417, bottom: 1134, left: 1417, right: 1134 } },
        type: SectionType.NEXT_PAGE,
      },
      footers: { default: footerWith(true) },
      children: anschreiben,
    },
    {
      properties: {
        page: { margin: { top: 1134, bottom: 1134, left: 1417, right: 1134 } },
        type: SectionType.NEXT_PAGE,
      },
      footers: { default: footerWith(true) },
      children: lebenslauf,
    },
    {
      properties: {
        page: { margin: { top: 1134, bottom: 1134, left: 1417, right: 1134 } },
        type: SectionType.NEXT_PAGE,
      },
      footers: { default: footerWith(true) },
      children: motivation,
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(path.join(__dirname, "..", "Bewerbungsmappe_Vorlage.docx"), buf);
  console.log("OK: Bewerbungsmappe_Vorlage.docx geschrieben,", buf.length, "Bytes");
});
