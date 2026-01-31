'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageSlideshowProps {
  images: string[]
  alt: string
}

export function ImageSlideshow({ images, alt }: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, images.length])

  const goToPrevious = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setIsAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlay(false)
    setCurrentIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-card border border-border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Không có hình ảnh</p>
      </div>
    )
  }

  return (
    <div className="relative w-full space-y-4">
      {/* Main Slideshow */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
        <Image
          src={images[currentIndex] || '/placeholder.svg'}
          alt={`${alt} - Hình ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Ảnh tiếp theo"
            >
              <ChevronRight size={24} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-primary'
                  : 'border-border hover:border-muted-foreground'
              }`}
              aria-label={`Xem ảnh ${index + 1}`}
            >
              <Image
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
