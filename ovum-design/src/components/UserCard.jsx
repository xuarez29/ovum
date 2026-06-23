// src/components/UserCard.jsx
// Tarjeta de usuaria (Opción A · Arcilla). Las usuarias en ventana fértil u
// ovulación se resaltan con un contorno de color para que salten a la vista.
import { arcilla, FONT_UI, FONT_DISPLAY } from "../theme/arcilla";
import { fmt } from "../utils/dateUtils";
import CycleRing from "./CycleRing";
import PhasePill from "./PhasePill";
import Avatar from "./Avatar";

function Metric({ label, value, sub, pal }) {
  return (
    <div style={{ flex: 1, background: pal.surfaceAlt, borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontFamily: FONT_UI, fontSize: 10.5, color: pal.muted,
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: pal.ink }}>{value}</div>
      {sub && <div style={{ fontFamily: FONT_UI, fontSize: 11.5, color: pal.sub }}>{sub}</div>}
    </div>
  );
}

export default function UserCard({ user, onClick, pal = arcilla }) {
  const highlight = user.statusKey === "fertile" || user.statusKey === "ovulation";
  const accent = user.statusKey === "fertile" ? pal.fertile : pal.ovulation;

  return (
    <button
      onClick={onClick}
      style={{
        textAlign: "left", cursor: "pointer", width: "100%", font: "inherit",
        position: "relative", background: pal.surface, borderRadius: 20,
        padding: "18px 18px 16px", color: pal.ink,
        border: `1px solid ${highlight ? "transparent" : pal.line}`,
        outline: highlight ? `1.5px solid ${accent}` : "none", outlineOffset: -1,
        boxShadow: highlight ? `0 1px 0 ${pal.line}, 0 12px 30px -18px ${pal.ink}40` : "none",
      }}
    >
      {/* encabezado */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 10 }}>
        <Avatar name={user.name} size={42} pal={pal} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 15.5, fontWeight: 600, color: pal.ink,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: pal.muted }}>
            {user.age ? `${user.age} años · ` : ""}ciclo {user.cycleLen}d
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}><PhasePill user={user} pal={pal} /></div>

      {/* anillo */}
      <div style={{ display: "flex", justifyContent: "center", margin: "2px 0 14px" }}>
        <CycleRing user={user} size={140} pal={pal} />
      </div>

      {/* métricas */}
      {user.hasData ? (
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Metric label="Próx. periodo" value={fmt(user.nextPeriod)}
            sub={`en ${user.daysToPeriod} días`} pal={pal} />
          <Metric label="Ovulación" value={fmt(user.ovulation)}
            sub={user.daysToOvulation >= 0 ? `en ${user.daysToOvulation} días` : `hace ${-user.daysToOvulation} días`}
            pal={pal} />
        </div>
      ) : (
        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: pal.muted, textAlign: "center",
          padding: "10px 0 14px" }}>Aún sin ciclos registrados</div>
      )}

      {/* síntomas */}
      {user.symptoms?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {user.symptoms.map((s) => (
            <span key={s} style={{ fontFamily: FONT_UI, fontSize: 11.5, color: pal.sub,
              background: pal.surface, border: `1px solid ${pal.line}`, padding: "4px 9px",
              borderRadius: 999 }}>{s}</span>
          ))}
        </div>
      )}
    </button>
  );
}
