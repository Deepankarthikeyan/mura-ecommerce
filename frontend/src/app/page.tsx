import type { Metadata } from "next";
import MuraiHomePage from "@/components/murai/MuraiHomePage";

export const metadata: Metadata = {
  title: "MuRa@23 — Sale Sarees Online",
  description:
    "Shop premium sale sarees online at MuRa@23. Silk, cotton, Banarasi, Kanjivaram and designer sarees at up to 70% off.",
};

export default function Home() {
  return <MuraiHomePage />;
}
