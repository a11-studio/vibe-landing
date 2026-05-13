import { Analytics } from "@vercel/analytics/react";
import { HeroLanding } from "@/app/components/HeroLanding";

export default function App() {
  return (
    <>
      <HeroLanding />
      <Analytics />
    </>
  );
}
