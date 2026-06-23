// src/data/sampleUsers.js
// Datos de ejemplo con la forma que esperan los componentes.
// Cada usuaria tiene un historial de `cycles`; el cálculo deriva ciclo promedio,
// duración del periodo, fase actual, ovulación y ventana fértil.

export const sampleUsers = [
  {
    id: "u1", name: "Mariana López", age: 29,
    cycles: [
      { start: "2026-03-26", end: "2026-03-30" },
      { start: "2026-04-23", end: "2026-04-27" },
      { start: "2026-05-21", end: "2026-05-25", symptoms: ["Energía alta", "Sensibilidad"],
        note: "Se siente con mucha energía esta semana." },
    ],
  },
  {
    id: "u2", name: "Sofía Ramírez", age: 33,
    cycles: [
      { start: "2026-03-21", end: "2026-03-24" },
      { start: "2026-04-20", end: "2026-04-23" },
      { start: "2026-05-20", end: "2026-05-23", symptoms: ["Libido alta", "Moco cervical"] },
    ],
  },
  {
    id: "u3", name: "Lucía Fernández", age: 24,
    cycles: [
      { start: "2026-03-18", end: "2026-03-22" },
      { start: "2026-04-13", end: "2026-04-17" },
      { start: "2026-05-09", end: "2026-05-13", symptoms: ["Hinchazón", "Antojos"],
        note: "Recordar comprar lo del periodo." },
    ],
  },
  {
    id: "u4", name: "Camila Torres", age: 38,
    cycles: [
      { start: "2026-03-31", end: "2026-04-05" },
      { start: "2026-04-30", end: "2026-05-05" },
      { start: "2026-05-30", symptoms: ["Cólicos", "Fatiga"], note: "Día pesado, descansar." },
    ],
  },
  {
    id: "u5", name: "Valentina Cruz", age: 27,
    cycles: [
      { start: "2026-03-29", end: "2026-04-01" },
      { start: "2026-04-27", end: "2026-04-30" },
      { start: "2026-05-25", end: "2026-05-28", symptoms: ["Piel clara"] },
    ],
  },
];

export default sampleUsers;
