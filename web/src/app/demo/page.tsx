import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MN Hack 26 Demo",
  description: "Crowdsourced protest intelligence platform demo.",
  openGraph: {
    title: "MN Hack 26 Demo",
    description: "Crowdsourced protest intelligence platform demo.",
    url: "https://mnhack26.vercel.app/demo",
    type: "video.other",
    videos: [
      {
        url: "https://mnhack26.vercel.app/recording.mp4",
        width: 1280,
        height: 720,
        type: "video/mp4",
      },
    ],
    images: [
      {
        url: "https://mnhack26.vercel.app/thumbnail.jpg", // optional but recommended
        width: 1280,
        height: 720,
      },
    ],
  },
};

export default function DemoPage() {
  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>MN Hack 26 Demo</h1>

      <video
        controls
        style={{
          width: "100%",
          maxWidth: "900px",
          marginTop: "2rem",
          borderRadius: "12px",
        }}
      >
        <source
          src="https://mnhack26.vercel.app/recording.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </main>
  );
}