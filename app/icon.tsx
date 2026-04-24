import { ImageResponse } from "next/og";

// Brand favicon — InvestingPro monogram in v3 tokens.
// Matches the "InvestingPro India" channel identity.
//
// Design: ink (#0A1F14) rounded square + indian-gold (#D97706) serif "IP"
// monogram, Playfair Display-style capitals. 32x32 base; Next generates
// 16x16 automatically.

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A1F14", // ink
        borderRadius: "4px",
        // Edge-runtime ImageResponse font stack — keep conservative so
        // it renders consistently at 16px scale-down.
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 900,
        color: "#D97706", // indian-gold
        letterSpacing: "-1px",
        fontSize: 20,
        // Vertical alignment nudge because cap-heights drift at tiny sizes
        lineHeight: "20px",
        paddingBottom: 1,
      }}
    >
      IP
    </div>,
    size,
  );
}
