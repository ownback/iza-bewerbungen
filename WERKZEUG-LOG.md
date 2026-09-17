# WERKZEUG-LOG — Stufe 2 (Build-Agent)

Protokoll der Werkzeugnutzung gemäß PLAN-STUFE2.md §7. Jede Nichtnutzung eines
vorgesehenen Werkzeugs ist begründet. Wird laufend geführt.

| Schritt | Aufgabe | Werkzeug(e) | Anmerkung / Begründung |
|---|---|---|---|
| B.0 | Plan-Gate | Read (PLAN-STUFE2.md) | Datei + Abschlusszeile verifiziert: Zeile 292 `==== STUFE 2 PLAN FERTIG — BEREIT ZUR ÜBERGABE AN BUILD-AGENT ====`, Basis-Commits `51758eb`/`8d1a8d1` = HEAD. |
| B.1 | dieses Log | Write | — |
| B.2 | P0-1/P0-2 | context7-MCP | API-Prüfung TextRun (`style`/`color`/Options-Spread) vor dem Fix — §7-Zuordnung „docx-js-API beim P0-Fix". |
| B.2 | P0-1/P0-2 | Edit (built-in) | `build/build_template.js`, `platzhalter.json`, `ANLEITUNG.md`, `DESIGN-SYSTEM.md` exakt nach Plan §1/§2. |
| B.2 | Regressions-Render | Bash: `node`, `soffice` (LibreOffice), `pdftoppm`, `pdftotext`, `pdfinfo` | Master-Rebuild + PDF-Render + XML-Greps. qa/*.png (V3) bleiben als historischer Beleg unangetastet. |
| B.2 | Commit | Bash: `git` | „eigener Commit" für die P0-Fixes, nur Hauptrepo. |
| B.3–B.7 | Ordner-/Dateiops in `/profiles/` | Bash (`mkdir`/`cp`/`rm`), Write/Edit (built-in) | **Abweichung von §7:** das `filesystem`-MCP ist auf `/home/ownback/Work/iza-bewerbungen` beschränkt (Allowed Directories geprüft) — `/profiles/` liegt außerhalb und ist dem MCP nicht zugänglich. Ersatzweise Bash/built-in-Tools, gleiche Invarianten (§3) werden skriptseitig erzwungen. |
| B.3–B.7 | `/profiles/` = kein git, kein gh, kein github-MCP | — | Invariante 4 (§3) ausnahmslos; Git-Commits betreffen ausschließlich das Hauptrepo. |
| B.8 | Push | Bash: `git push origin main` | **Abweichung von §7 („github-MCP oder gh"):** Push des bereits konfigurierten Remotes `origin/main` ist ein elementarer Git-Vorgang; `gh`/github-MCP brächten keinen Mehrwert. Kein Zugriff auf `/profiles/` (Invariante 4). |
| — | Stellenanzeige-Link lesen (playwright-MCP) | **nicht genutzt** | Kein Bestandteil von B.1–B.8; Playwright kommt erst im echten Bewerbungs-Interview (Phase 0, §5) zum Einsatz. |
| — | `uploads/` lesen (pdf-, processing-pdf-, docx-Skill) | **nicht genutzt** | `uploads/` der Test- und-Leerprofile ist leer; es liegen keine Zeugnisse/Lebensläufe zum Einlesen vor. |
| — | docx-Skill (DOCX bauen) | **nicht genutzt** | Der Build läuft über das repo-eigene `build/build_template.js` (docx-js) — der docx-Skill (python-docx) würde am bestehenden System vorbeibauen; PLAN-STUFE2 §10 fixiert den Build-Weg. |
| — | humanizer-Skill | **nicht genutzt (in B.1–B.8)** | Anwendungsplacebo-Texte des Testprofils sind QA-Fixtures ohne Freigabeprozess (§5 Phase 3 gilt für echte Bewerbungen); kommt beim echten Profil-Interview zum Einsatz. |
| B.6 | Screenshots visuell prüfen | reviewing-interface-quality-Skill + Read (PNG) | §7-Zuordnung „Gerenderte Seiten visuell prüfen". |
| B.7/B.8 | Vor „fertig"-Behauptungen | verifying-before-completion-Skill | §7-Zuordnung; Verifikationskommandos mit Ausgabebeleg in QA-BERICHT-STUFE2.md. |
