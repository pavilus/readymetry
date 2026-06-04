import { ImageResponse } from "next/og";

export const alt = "Readymetry Certification Readiness Engine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#18181b",
          padding: "72px",
          borderTop: "18px solid #6d28d9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 30, fontWeight: 700, color: "#6d28d9" }}>
          <div style={{ width: 54, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "#6d28d9", color: "#fff" }}>R</div>
          Readymetry
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "930px" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>Know if you are ready before exam day.</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#52525b" }}>
            Realistic certification practice exams, answer review, and measurable readiness analytics.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>readymetry.com</div>
      </div>
    ),
    size,
  );
}
