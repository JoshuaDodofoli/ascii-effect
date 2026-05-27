'use client'

import dynamic from "next/dynamic";

const AsciiCanvas = dynamic(() => import("./components/AsciiCanvas"), { ssr: false });
// const MovingParticles = dynamic(() => import("./components/MovingParticles"), { ssr: false });
const SpaceWarpTunnel = dynamic(() => import("./components/SpaceWarpTunnel"), { ssr: false });

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* <AsciiCanvas imageUrl="/img2.jpg" /> */}
      {/* <MovingParticles /> */}
      <SpaceWarpTunnel />
    </div>
  );
}

