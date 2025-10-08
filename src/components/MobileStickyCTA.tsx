"use client";
import Button from "./Button";

export default function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 p-3">
      <Button wide href="/contact">Boka din gratis demonstration hemma</Button>
    </div>
  );
}
