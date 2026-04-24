import { ImageResponse } from "next/og";

// Apple touch icon — same brand as icon.tsx but sized for iOS home-screen
// (180x180). Ink rounded square + indian-gold serif "IP".

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0A1F14", // ink
        borderRadius: "24px",
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 900,
        color: "#D97706", // indian-gold
        letterSpacing: "-4px",
        fontSize: 110,
        lineHeight: "110px",
        paddingBottom: 6,
      }}
    >
      IP
    </div>,
    size,
  );
}
