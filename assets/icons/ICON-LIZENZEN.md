# Icon-Lizenzen & Herkunft

Alle Icons stammen aus einem einzigen Set: **Tabler Icons** (Outline-Variante).

- **Icon-Set:** Tabler Icons
- **Quelle:** https://tabler.io/icons / offizielles Repository `tabler/tabler-icons`
- **Download-Pfad:** `https://raw.githubusercontent.com/tabler/tabler-icons/main/icons/outline/<name>.svg`
- **Lizenz:** MIT License, Copyright (c) 2020–2026 Paweł Kuna
  (LICENSE des Repos geprüft am 16.09.2026; erlaubt Nutzung, Anpassung und Weiterverbreitung)
- **Quell-Commit (gepinnt):** `55f87a73f45cf1d9eaf16d7da705065483a9e4f9`
- **Stil:** Outline/Line-Icons, ViewBox `0 0 24 24`, originale `stroke-width="2"` unverändert

## Verwendete Icons

Status: **aktiv** = aktuell in der DOCX eingebunden · **Reserve** = lokal vorhanden, nicht eingebunden

| Zweck | Icon-Name | Datei (SVG) | Farben (PNG) | Status | Einsatz |
|---|---|---|---|---|---|
| E-Mail | `mail` | `svg/mail.svg` | `mail_1A1A1A.png` / `mail_C9B599.png` | aktiv | Kontaktdaten |
| Telefon | `phone` | `svg/phone.svg` | `phone_1A1A1A.png` / `phone_C9B599.png` | aktiv | Kontaktdaten |
| Adresse | `map-pin` | `svg/map-pin.svg` | `map-pin_1A1A1A.png` / `map-pin_C9B599.png` | aktiv | Kontaktdaten |
| Geburtsdatum | `calendar` | `svg/calendar.svg` | `calendar_1A1A1A.png` / `calendar_C9B599.png` | aktiv | Lebenslauf, personenbezogene Daten |
| Website | `world` | `svg/world.svg` | `world_1A1A1A.png` / `world_C9B599.png` | aktiv (optional) | Kontaktdaten |
| Name / Person | `user` | `svg/user.svg` | `user_1A1A1A.png` / `user_C9B599.png` | aktiv | Lebenslauf, Namenszeile |
| Interessen (generisch) | `compass` | `svg/compass.svg` | `compass_1A1A1A.png` / `compass_C9B599.png` | aktiv | Interessen & Hobbys (3 Zellen) |
| Schulbildung | `school` | `svg/school.svg` | `school_C9B599.png` / `school_1A1A1A.png` | aktiv | Lebenslauf-Bereich |
| Praktische Erfahrungen | `briefcase` | `svg/briefcase.svg` | `briefcase_C9B599.png` / `briefcase_1A1A1A.png` | aktiv | Lebenslauf-Bereich |
| Kenntnisse & Kompetenzen | `adjustments` | `svg/adjustments.svg` | `adjustments_C9B599.png` / `adjustments_1A1A1A.png` | aktiv | Lebenslauf-Bereich |
| Softwarekenntnisse | `device-desktop-code` | `svg/device-desktop-code.svg` | `device-desktop-code_1A1A1A.png` / `device-desktop-code_C9B599.png` | aktiv | Lebenslauf-Sublabel |
| Sprachkenntnisse | `language` | `svg/language.svg` | `language_1A1A1A.png` / `language_C9B599.png` | aktiv | Lebenslauf-Sublabel |
| CAD / Konstruktion | `cube-3d-sphere` | `svg/cube-3d-sphere.svg` | `cube-3d-sphere_1A1A1A.png` / `cube-3d-sphere_C9B599.png` | aktiv | Lebenslauf-Sublabel |
| Persönliche Stärken | `dumbbell` | `svg/dumbbell.svg` | `dumbbell_C9B599.png` / `dumbbell_1A1A1A.png` | aktiv | Lebenslauf-Sublabel |
| Interessen & Hobbys | `device-gamepad` | `svg/device-gamepad.svg` | `device-gamepad_C9B599.png` / `device-gamepad_1A1A1A.png` | aktiv | Lebenslauf-Bereich |
| Zertifikate (Ersatz: Anlagen) | `file-certificate` | `svg/file-certificate.svg` | `file-certificate_C9B599.png` / `file-certificate_1A1A1A.png` | Reserve | Bereich auf User-Wunsch entfernt |

## Verwendete Icons in Kurzform

```
mail                → Tabler Icons → MIT → offizielle Quelle → svg/mail.svg
phone               → Tabler Icons → MIT → offizielle Quelle → svg/phone.svg
map-pin             → Tabler Icons → MIT → offizielle Quelle → svg/map-pin.svg
calendar            → Tabler Icons → MIT → offizielle Quelle → svg/calendar.svg
world               → Tabler Icons → MIT → offizielle Quelle → svg/world.svg
user                → Tabler Icons → MIT → offizielle Quelle → svg/user.svg
compass             → Tabler Icons → MIT → offizielle Quelle → svg/compass.svg
school              → Tabler Icons → MIT → offizielle Quelle → svg/school.svg
briefcase           → Tabler Icons → MIT → offizielle Quelle → svg/briefcase.svg
adjustments         → Tabler Icons → MIT → offizielle Quelle → svg/adjustments.svg
device-desktop-code → Tabler Icons → MIT → offizielle Quelle → svg/device-desktop-code.svg
language            → Tabler Icons → MIT → offizielle Quelle → svg/language.svg
cube-3d-sphere      → Tabler Icons → MIT → offizielle Quelle → svg/cube-3d-sphere.svg
dumbbell            → Tabler Icons → MIT → offizielle Quelle → svg/dumbbell.svg
device-gamepad      → Tabler Icons → MIT → offizielle Quelle → svg/device-gamepad.svg
file-certificate    → Tabler Icons → MIT → offizielle Quelle → svg/file-certificate.svg (Reserve)
```

## Anpassungen an den Originalen

- **Farbe:** `stroke="currentColor"` wurde beim PNG-Export gegen `#1A1A1A` bzw. `#C9B599` ersetzt
  (temporäre Kopie; die SVG-Originale in `svg/` bleiben unverändert).
- **Größe:** PNG-Rasterisierung mit 256 × 256 px (~18× Überabtastung gegenüber der Anzeigegröße
  von 14/16 px) für druckfreundliche Skalierung.
- **Keine Formänderungen:** Geometrie, Stroke-Breite und ViewBox entsprechen dem Original.

## Konvertierung (Reproduktion)

```bash
tmp=$(mktemp -d)
for icon in <name>; do
  sed "s/currentColor/#1A1A1A/g" svg/${icon}.svg > $tmp/${icon}_1A1A1A.svg
  sed "s/currentColor/#C9B599/g" svg/${icon}.svg > $tmp/${icon}_C9B599.svg
  rsvg-convert -w 256 -h 256 $tmp/${icon}_1A1A1A.svg > png/${icon}_1A1A1A.png
  rsvg-convert -w 256 -h 256 $tmp/${icon}_C9B599.svg > png/${icon}_C9B599.png
done
```

## Bemerkungen zur Icon-Auswahl

- **Bizeps-Icon:** Gewünscht für „Persönliche Stärken“, in Tabler aber nicht vorhanden
  (`arm`, `bicep`, `muscle` existieren nicht). Entsprechend dem Ein-Set-Prinzip wurde
  `dumbbell` (Hantel, Stärke/Belastbarkeit) gewählt statt eines Bizeps-Icons aus einem
  fremden Set.
- **Profil-/Mensch-Icon** für die Namenszeile im Lebenslauf: `user` (Outline).
- **Icon-Farbrolle (V3):** alle in der DOCX eingebundenen Icons nutzen ausschließlich
  `#1A1A1A` (eine Farbrolle, D8). Die `C9B599`-Varianten bleiben als Reserve im Repo.
