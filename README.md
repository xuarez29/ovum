# Ovum

Aplicación web MVP para monitoreo menstrual multiusuaria. Guarda datos en `localStorage`, no usa backend y muestra estimaciones aproximadas de periodo, ovulación y ventana fértil.

## Aviso

Esta app no entrega diagnósticos médicos. Las fechas calculadas son estimaciones simples basadas en los datos ingresados por la usuaria.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
npm run dev
```

Luego abre la URL local que muestre Vite.

## Funciones incluidas

- Gestión de usuarias: agregar, editar, eliminar y listar.
- Registro de ciclos con fechas, notas y síntomas.
- Dashboard ordenado por cercanía a ovulación o ventana fértil.
- Vista detalle por usuaria con historial y estimaciones.
- Calendario mensual simple con marcas de periodo, ovulación, ventana fértil y próximo periodo.
- Exportación, importación y borrado total de datos locales.

## Estructura

```text
src/
  main.jsx
  App.jsx
  components/
    UserCard.jsx
    UserForm.jsx
    CycleForm.jsx
    Dashboard.jsx
    UserDetail.jsx
    CalendarView.jsx
    Navbar.jsx
  utils/
    cycleCalculations.js
    dateUtils.js
    storage.js
  data/
    symptomOptions.js
```

## Reglas de cálculo

- Próximo periodo = inicio del último periodo + duración promedio del ciclo.
- Ovulación estimada = próximo periodo - 14 días.
- Ventana fértil = 5 días antes de ovulación a 1 día después.
- Cerca de ovulación = faltan 3 días o menos.
- Próximo periodo cercano = faltan 3 días o menos.
