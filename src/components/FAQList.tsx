"use client";
import { useState } from "react";

export default function FAQList({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="card">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full text-left">
            <h3 className="text-lg font-medium">{item.q}</h3>
          </button>
          {openIndex === i && <p className="mt-2 text-gray-700">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
