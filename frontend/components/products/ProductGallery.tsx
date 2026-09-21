"use client";

import { useState } from "react";

type Props = {
  title: string;
  images: string[];
};

export default function ProductGallery({ title, images }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(
    images.length > 0 ? images[0] : "",
  );

  return (
    <div className="flex flex-col gap-3">
      {/* تصویر اصلی */}
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={title}
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
            تصویری موجود نیست
          </div>
        )}
      </div>

      {/* تصاویر کوچک (Thumbnail) */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(url)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition-all ${
                selectedImage === url
                  ? "border-green-600 shadow-md"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={url}
                alt={`${title} - ${idx + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
