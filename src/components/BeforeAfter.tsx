import Image from "next/image";

export default function BeforeAfter({ before, after, caption }: { before: string; after: string; caption: string }) {
  return (
    <div className="card">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-xl">
            <Image src={before} alt="Före" fill className="object-cover" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Före</p>
        </div>
        <div>
          <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-xl">
            <Image src={after} alt="Efter" fill className="object-cover" />
          </div>
          <p className="mt-2 text-sm text-gray-600">Efter</p>
        </div>
      </div>
      <p className="mt-4 text-gray-800">{caption}</p>
    </div>
  );
}
