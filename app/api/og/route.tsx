import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0F15",
          backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(0,229,160,0.12) 0%, transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-2px",
              display: "flex",
            }}
          >
            Método R.E.S.T.
          </div>
          <div
            style={{
              width: "80px",
              height: "4px",
              backgroundColor: "#00E5A0",
              borderRadius: "2px",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.7)",
              maxWidth: "700px",
              textAlign: "center",
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            Recupera el descanso que mereces
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "20px",
            }}
          >
            {["Ritmo", "Eje intestinal", "Sistema nervioso", "Timing"].map((p) => (
              <div
                key={p}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#00E5A0",
                    display: "flex",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", display: "flex" }}>{p}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(0,229,160,0.6)",
              marginTop: "24px",
              display: "flex",
            }}
          >
            Protocolo clínico de sueño · Joaquín Adi
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
