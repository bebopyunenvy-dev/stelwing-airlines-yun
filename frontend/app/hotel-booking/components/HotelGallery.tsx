import Image from 'next/image';

export default function HotelGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-3 md:col-span-2 relative h-72 rounded-lg overflow-hidden">
        <Image
          src={images[0]}
          alt={name}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="hidden md:grid grid-cols-1 gap-2">
        {images.slice(1, 3).map((src, idx) => (
          <div key={idx} className="relative h-36 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={`${name}-${idx}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
