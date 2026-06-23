# Ovum — Dashboard rediseñado (Opción A · Arcilla)

Componentes React listos para tu proyecto **Vite + React**. Estilos en línea con un
objeto de tema (`theme/arcilla.js`), así que **no dependen de Tailwind** y se ven
idénticos al mockup. Si prefieres Tailwind, puedes mover los colores a `tailwind.config`.

## Archivos

```
src/
├─ theme/
│  └─ arcilla.js              # paleta + fuentes
├─ utils/
│  ├─ dateUtils.js            # fechas (parse seguro, formato es-MX)
│  └─ cycleCalculations.js    # reglas del ciclo (sin cambios) + orden por prioridad
├─ components/
│  ├─ CycleRing.jsx           # anillo de fases (ovulación dorada, fértil verde, "hoy")
│  ├─ PhasePill.jsx           # píldora de estado
│  ├─ Avatar.jsx              # iniciales
│  ├─ UserCard.jsx            # tarjeta de usuaria
│  └─ Dashboard.jsx           # vista principal (incluye estado vacío + aviso médico)
└─ data/
   └─ sampleUsers.js          # datos de ejemplo
```

## 1. Fuentes

Agrega esto al `<head>` de tu `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet" />
```

## 2. Uso

```jsx
import Dashboard from "./components/Dashboard";
import sampleUsers from "./data/sampleUsers";

export default function App() {
  return (
    <Dashboard
      users={sampleUsers}
      onAddUser={() => {/* abrir UserForm */}}
      onSelectUser={(user) => {/* navegar a UserDetail */}}
    />
  );
}
```

`Dashboard` recibe las usuarias **en crudo**, las calcula con `computeAndSort` y las
ordena por prioridad del ciclo (ventana fértil → ovulación cercana → periodo → normal).

## 3. Forma de los datos

```js
{
  id: "u1",
  name: "Mariana López",
  age: 29,
  settings: { avgCycle: 28, periodDuration: 5 }, // opcional; si falta se calcula del historial
  cycles: [
    { start: "2026-05-21", end: "2026-05-25", symptoms: ["Energía alta"], note: "..." },
    // ...
  ],
}
```

- `start` / `end`: strings `'YYYY-MM-DD'` (o `Date`). `end` es opcional.
- Con 2+ ciclos se estima `avgCycle` del promedio entre inicios; `periodDuration` del
  promedio de duración. Sin historial, la tarjeta muestra un estado "sin datos".

## 4. Reglas de cálculo (intactas)

- Próximo periodo = inicio del último periodo + duración promedio del ciclo
- Ovulación = próximo periodo − 14 días
- Ventana fértil = 5 días antes de ovulación hasta 1 día después
- "cerca" = faltan 3 días o menos para ovulación o periodo

## 5. Notas

- El parámetro `pal` está en todos los componentes por si luego quieres ofrecer la
  paleta **Ciruela** como alternativa: `import { ciruela } from "./theme/ciruela"` y
  pásala como `pal={ciruela}`.
- `Dashboard` es responsive (la cuadrícula usa `auto-fill minmax(300px, 1fr)`).
- El aviso "las fechas son estimaciones…" ya viene incluido al pie.
