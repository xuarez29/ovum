// src/components/Dashboard.jsx
// Vista principal (Opción A · Arcilla). Recibe las usuarias en crudo, las calcula
// y ordena por prioridad, y muestra encabezado, resumen y la cuadrícula de tarjetas.
import { arcilla, FONT_UI, FONT_DISPLAY } from "../theme/arcilla";
import { fmtLong, startOfToday } from "../utils/dateUtils";
import { computeAndSort } from "../utils/cycleCalculations";
import UserCard from "./UserCard";

function Wordmark({ pal }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 14, height: 14, borderRadius: 999,
        background: `radial-gradient(circle at 35% 30%, ${pal.ovulation}, ${pal.period})`,
        boxShadow: `0 0 0 4px ${pal.surface}, 0 0 0 5px ${pal.line}` }} />
      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: pal.ink, fontWeight: 500 }}>Ovum</span>
    </div>
  );
}

function Legend({ pal }) {
  const items = [["Periodo", pal.period], ["Ventana fértil", pal.fertile], ["Ovulación", pal.ovulation]];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {items.map(([t, c]) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 11, height: 11, borderRadius: 4, background: c }} />
          <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: pal.sub }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ users = [], onAddUser, onSelectUser, today = startOfToday(), pal = arcilla }) {
  const computed = computeAndSort(users, today);
  const fertileCount = computed.filter((u) => u.statusKey === "fertile").length;
  const periodCount = computed.filter((u) => u.inPeriod).length;

  return (
    <div style={{ background: pal.bg, minHeight: "100vh", padding: "28px 30px 40px",
      fontFamily: FONT_UI, color: pal.ink }}>
      {/* barra superior */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <Wordmark pal={pal} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: FONT_UI, fontSize: 13.5, color: pal.sub,
            textTransform: "capitalize" }}>{fmtLong(today)}</span>
          <button onClick={onAddUser} style={{ display: "inline-flex", alignItems: "center", gap: 8,
            border: "none", background: pal.ink, color: pal.surface, padding: "10px 16px",
            borderRadius: 999, fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
            <span style={{ fontSize: 16, lineHeight: 0, marginTop: -1 }}>+</span>Nueva usuaria
          </button>
        </div>
      </div>

      {/* resumen */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", background: pal.surface, border: `1px solid ${pal.line}`,
        borderRadius: 16, marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: pal.ink }}>{computed.length}</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 14, color: pal.sub }}>
            usuarias en seguimiento
            {fertileCount > 0 && <> · <span style={{ color: pal.fertile, fontWeight: 600 }}>{fertileCount} en ventana fértil</span></>}
            {periodCount > 0 && <> · <span style={{ color: pal.period, fontWeight: 600 }}>{periodCount} en periodo</span></>}
          </span>
        </div>
        <Legend pal={pal} />
      </div>

      {/* cuadrícula */}
      {computed.length === 0 ? (
        <EmptyState onAddUser={onAddUser} pal={pal} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {computed.map((u) => (
            <UserCard key={u.id} user={u} pal={pal} onClick={() => onSelectUser?.(u)} />
          ))}
          <button onClick={onAddUser} style={{ border: `1.5px dashed ${pal.line}`, background: "transparent",
            borderRadius: 20, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 8, cursor: "pointer", color: pal.muted, fontFamily: FONT_UI }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, border: `1.5px solid ${pal.line}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>+</span>
            <span style={{ fontSize: 13.5 }}>Agregar usuaria</span>
          </button>
        </div>
      )}

      {/* aviso médico */}
      <p style={{ fontFamily: FONT_UI, fontSize: 12, color: pal.muted, textAlign: "center",
        marginTop: 32, maxWidth: 560, marginInline: "auto", lineHeight: 1.5 }}>
        Las fechas son estimaciones basadas en tus registros y no reemplazan asesoría médica.
      </p>
    </div>
  );
}

function EmptyState({ onAddUser, pal }) {
  return (
    <div style={{ textAlign: "center", padding: "70px 20px", background: pal.surface,
      border: `1px solid ${pal.line}`, borderRadius: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 999, margin: "0 auto 18px",
        background: `radial-gradient(circle at 35% 30%, ${pal.ovulationBg}, ${pal.periodBg})`,
        border: `1px solid ${pal.line}` }} />
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 500, color: pal.ink, margin: "0 0 8px" }}>
        Empieza tu primer seguimiento
      </h2>
      <p style={{ fontFamily: FONT_UI, fontSize: 14.5, color: pal.sub, margin: "0 auto 22px", maxWidth: 380, lineHeight: 1.5 }}>
        Agrega una usuaria y registra su último periodo para ver fases, ovulación y ventana fértil.
      </p>
      <button onClick={onAddUser} style={{ border: "none", background: pal.ink, color: pal.surface,
        padding: "12px 22px", borderRadius: 999, fontFamily: FONT_UI, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        + Nueva usuaria
      </button>
    </div>
  );
}
