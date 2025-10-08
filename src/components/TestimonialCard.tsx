import StarRating from "./StarRating";

export default function TestimonialCard({ name, text, stars }: { name: string; text: string; stars?: number }) {
  return (
    <div className="card">
      <StarRating value={stars ?? 5} />
      <p className="mt-3 text-gray-700">“{text}”</p>
      <p className="mt-4 text-sm font-medium text-gray-900">{name}</p>
    </div>
  );
}
