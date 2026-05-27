'use client'

import dynamic from "next/dynamic";

const AsciiCanvas = dynamic(() => import("./components/AsciiCanvas"), { ssr: false });

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AsciiCanvas imageUrl="/img2.jpg" />
    </div>
  );
}
