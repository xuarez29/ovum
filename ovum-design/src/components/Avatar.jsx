// src/components/Avatar.jsx
import { arcilla, FONT_UI } from "../theme/arcilla";

export default function Avatar({ name = "", size = 42, pal = arcilla }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: size, flex: "0 0 auto",
      background: pal.surfaceAlt, border: `1.5px solid ${pal.line}`, color: pal.sub,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT_UI, fontWeight: 600, fontSize: size * 0.36,
    }}>
      {initials}
    </div>
  );
}
