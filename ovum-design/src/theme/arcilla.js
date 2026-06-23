// src/theme/arcilla.js
// Paleta "Arcilla" del rediseño de Ovum (Opción A).
// Semántica de color del ciclo: periodo = rojo-arcilla, ventana fértil = verde,
// ovulación = dorado (el pico). Mantén esta semántica consistente en toda la app.

export const arcilla = {
  bg: "#FBF6F0",
  surface: "#FFFFFF",
  surfaceAlt: "#FCF8F3",
  ink: "#322C27",
  sub: "#6F655C",
  muted: "#9C9087",
  line: "#ECE1D6",
  lineSoft: "#F2EAE0",

  period: "#CE6B54",
  periodBg: "#F8E6DF",
  fertile: "#6E9277",
  fertileBg: "#E6EFE7",
  ovulation: "#E0A23A",
  ovulationBg: "#F7EAD2",
  track: "#EBE0D4",
  normal: "#A89A8C",
};

// Tipografía. Agrega esto al <head> de tu index.html:
// <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet" />
export const FONT_UI = "'Hanken Grotesk', system-ui, sans-serif";
export const FONT_DISPLAY = "'Newsreader', Georgia, serif";

export default arcilla;
