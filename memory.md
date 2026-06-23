# Memory

## Proyecto

Se creó una web app MVP llamada **Ovum** para monitoreo menstrual multiusuaria. Es una app privada de frontend solamente, sin backend, con datos persistidos en `localStorage`.

## Stack

- React 18
- Vite
- Tailwind CSS
- JavaScript moderno
- `lucide-react` para iconos
- Persistencia local mediante `localStorage`
- Surge para deploy estático

## Funcionalidades implementadas

- Dashboard principal rediseñado con paleta **Arcilla**, tipografías Hanken Grotesk/Newsreader, tarjetas por usuaria, avatar, píldora de fase y anillo visual de ciclo.
- Orden automático de tarjetas por prioridad de ciclo:
  - Ventana fértil
  - Cerca de ovulación
  - En observación cercana
  - Periodo o próximo periodo cercano
  - Lejos de ovulación
- Gestión de usuarias:
  - Agregar
  - Editar
  - Eliminar
  - Listar
- Campos de usuaria:
  - Nombre
  - Edad opcional
  - Duración promedio del ciclo
  - Duración promedio del periodo
  - Fecha de inicio del último periodo
  - Notas
- Registro de ciclos por usuaria:
  - Fecha de inicio
  - Fecha de fin opcional
  - Síntomas
  - Notas libres
- Vista detalle por usuaria:
  - Datos generales
  - Resumen actual
  - Anillo visual del ciclo
  - Historial de ciclos
  - Síntomas registrados
  - Acciones para editar, eliminar y agregar ciclo
- Calendario mensual con dos modos:
  - **Ovulación global**: vista por defecto, muestra solamente los días de ovulación de todas las usuarias, agrupadas por fecha y con nombres en cada día.
  - **Ciclo individual**: conserva la vista por usuaria.
- Vista de ciclo individual:
  - Marca días de periodo
  - Marca ovulación estimada
  - Marca ventana fértil
  - Marca próximo periodo estimado
- Privacidad/datos:
  - Exportar JSON
  - Importar JSON
  - Borrar todos los datos con confirmación
- Se eliminaron los avisos visibles de advertencia médica/estimaciones de la interfaz por solicitud del usuario.

## Reglas de cálculo

Implementadas en `src/utils/cycleCalculations.js`.

- Próximo periodo = inicio del último periodo + duración promedio del ciclo.
- Ovulación estimada = próximo periodo - 14 días.
- Ventana fértil = desde 5 días antes de ovulación hasta 1 día después.
- Cerca de ovulación = faltan 3 días o menos para ovulación.
- Próximo periodo cercano = faltan 3 días o menos para próximo periodo.
- Se agregó `toCycleDisplayUser` / `getCycleDisplayUsers` como adaptador visual para que los componentes del rediseño consuman el modelo actual sin cambiar persistencia ni import/export.

## Archivos principales

```text
src/
  main.jsx
  App.jsx
  styles.css
  theme/
    arcilla.js
  components/
    Navbar.jsx
    Dashboard.jsx
    UserCard.jsx
    Avatar.jsx
    PhasePill.jsx
    CycleRing.jsx
    UserForm.jsx
    CycleForm.jsx
    UserDetail.jsx
    CalendarView.jsx
  utils/
    cycleCalculations.js
    dateUtils.js
    storage.js
  data/
    symptomOptions.js
```

## Decisiones tomadas

- No se agregó backend en esta versión.
- El historial de ciclos vive dentro de cada objeto de usuaria.
- Al crear una usuaria se crea también un ciclo inicial basado en `lastPeriodStart`.
- Al agregar un nuevo ciclo, `lastPeriodStart` se actualiza con la fecha más reciente del historial.
- Los cálculos se mantienen como funciones puras para facilitar pruebas y evolución.
- El diseño usa la propuesta de `/Volumes/CognytIA/Projects/Playground/ovum/ovum-design`, adaptada al modelo real de datos del proyecto.
- Se mantuvo compatibilidad con la estructura actual de usuarias: `cycleLength`, `periodLength`, `lastPeriodStart`, ciclos con `startDate/endDate`.
- La vista global de calendario solo marca ovulación; las demás marcas quedan en el modo de ciclo individual.

## Deploy

- Sitio publicado en Surge: https://ovumww.surge.sh/
- Comando usado: `npx surge dist ovumww.surge.sh`
- Cuenta usada por Surge durante deploy: `cognytia.solutions@gmail.com`

## Verificación realizada

- `npm install` ejecutado correctamente.
- `npm run build` compila sin errores.
- Se probó `calculateCycle` directamente con datos de ejemplo en Node.
- Se probó `getCycleDisplayUsers` con datos de ejemplo para validar el adaptador de tarjetas/anillo.
- Se levantó Vite en `http://127.0.0.1:5173/`.
- Se verificó respuesta HTTP local `200 OK`.
- Se verificó producción en `https://ovumww.surge.sh/` con `HTTP/1.1 200 OK`.

## Pendientes o posibles mejoras

- Agregar pruebas unitarias para `cycleCalculations.js`.
- Mejorar la importación JSON con validación más estricta por campo.
- Permitir edición/eliminación de ciclos individuales.
- Añadir filtros por estado en dashboard.
- Agregar selector de mes/año más directo en calendario.
- Considerar cifrado local o contraseña si se requiere mayor privacidad en el navegador.
