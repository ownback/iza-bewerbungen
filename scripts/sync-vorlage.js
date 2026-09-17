#!/usr/bin/env node
// sync-vorlage.js — Stufe 2 (PLAN-STUFE2.md §3/§6)
// Kopiert das Build-System des Repos nach <Work>/profiles/.vorlage/ (reine Laufzeitkopie).
// Invariante 1: profiles/.vorlage wird AUSSCHLIESSLICH durch dieses Skript aktualisiert.
// CLI: node scripts/sync-vorlage.js

const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const PROFILES = path.resolve(REPO, "..", "profiles");
const ZIEL = path.join(PROFILES, ".vorlage");

const QUELLEN = [
  { src: path.join(REPO, "build"), dest: path.join(ZIEL, "build") },
  { src: path.join(REPO, "assets"), dest: path.join(ZIEL, "assets") },
  { src: path.join(REPO, "platzhalter.json"), dest: path.join(ZIEL, "platzhalter.json") },
  { src: path.join(REPO, "scripts"), dest: path.join(ZIEL, "scripts") },
];

const fehlt = QUELLEN.filter((q) => !fs.existsSync(q.src));
if (fehlt.length > 0) {
  console.error("FEHLER: Quellen fehlen im Repo:", fehlt.map((q) => q.src).join(", "));
  process.exit(1);
}

fs.mkdirSync(PROFILES, { recursive: true });
fs.rmSync(ZIEL, { recursive: true, force: true });
fs.mkdirSync(ZIEL, { recursive: true });
for (const q of QUELLEN) fs.cpSync(q.src, q.dest, { recursive: true });

console.log(`OK: ${ZIEL} aktualisiert (build/, assets/, platzhalter.json, scripts/)`);
