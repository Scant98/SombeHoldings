"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const slides = [
  {
    src: "/projects/door-installation.jpg",
    title: "Hardwood door installation, Kivule Hospital",
    caption: "Supplied, fitted and finished by our own team",
  },
  {
    src: "/projects/pugu-seminar.png",
    title: "Seminar building, Pugu Secondary School",
    caption: "Renovation and new construction in progress",
  },
  {
    src: "/projects/kitunda-toilet-block.jpg",
    title: "Sanitation block, Kitunda Secondary School",
    caption: "Modern facilities for over 500 students",
  },
  {
    src: "/projects/kivule-doors.jpg",
    title: "Solid hardwood doors",
    caption: "Our signature timber and joinery work",
  },
  {
    src: "/team.jpg",
    title: "The Sombe Holdings team",
    caption: "The people who quote your project stand on site",
  },
]

const INTERVAL_MS = 5000

export function HeroSlideshow({ className }: { className?: string }) {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const timer = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      INTERVAL_MS
    )
    return () => clearInterval(timer)
  }, [paused])

  return (
    <div
      className={cn("group relative overflow-hidden rounded-2xl", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === active ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.src}
            alt={slide.title}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={cn(
              "object-cover transition-transform duration-[6000ms] ease-linear",
              i === active ? "scale-105" : "scale-100"
            )}
          />
        </div>
      ))}

      {/* Caption */}
      <div className="absolute right-4 bottom-4 left-4 z-10 rounded-xl bg-white/92 p-4 backdrop-blur-sm">
        <p className="text-ink text-sm font-semibold">{slides[active].title}</p>
        <p className="text-ink-soft mt-0.5 text-xs">{slides[active].caption}</p>
        {/* Dots */}
        <div className="mt-3 flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${i + 1}: ${slide.title}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 [transition-timing-function:var(--ease-snap)]",
                i === active
                  ? "bg-brand-strong w-6"
                  : "bg-ink/20 hover:bg-ink/40 w-1.5"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
