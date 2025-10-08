"use client"

import type React from "react"
import { useEffect, useMemo, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, Award, ChevronDown } from "lucide-react"

type BgItem = { src: string; alt: string }

// Teal/Green brand theme background images
const BACKGROUND_IMAGES: BgItem[] = [
  {
    src: "/1.png",
    alt: "Background image 1",
  },
  {
    src: "/2.png",
    alt: "Background image 2",
  },
  {
    src: "/3.png",
    alt: "Background image 3",
  },
]

const SLIDE_DURATION = 6500 // ms

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)

  // 🔹 Handle PDF Download
  const handleDownload = useCallback(() => {
    const link = document.createElement("a")
    link.href = "/Ascendio_Profile.pdf" // Make sure PDF is in public folder
    link.download = "Ascendio_Profile.pdf"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }, [])

  // Respect user motion preferences
  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handle = () => setReduced(mql.matches)
    handle()
    if (mql.addEventListener) mql.addEventListener("change", handle)
    else mql.addListener(handle)
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handle)
      else mql.removeListener(handle)
    }
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % BACKGROUND_IMAGES.length), SLIDE_DURATION)
    return () => clearInterval(id)
  }, [reduced])

  // Preload the next image for smoother crossfade
  useEffect(() => {
    const next = BACKGROUND_IMAGES[(index + 1) % BACKGROUND_IMAGES.length]?.src
    if (!next) return
    const img = new Image()
    img.decoding = "async"
    img.src = next
  }, [index])

  // Brand colors derived from a teal/green logo (emerald/teal blend)
  const brandStyle = useMemo(
    () =>
      ({
        ["--brand-start" as any]: "160 84% 39%", // emerald-500
        ["--brand-end" as any]: "173 80% 40%", // teal-500
      }) as React.CSSProperties,
    [],
  )

  return (
    <section id="home" aria-label="Hero" className="relative min-h-[100svh] isolate overflow-hidden" style={brandStyle}>
      {/* Ambient brand gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 600px at 80% 10%, hsl(var(--brand-start) / 0.22), transparent), radial-gradient(1000px 500px at 0% 100%, hsl(var(--brand-end) / 0.20), transparent)",
          }}
        />
      </div>

      {/* Background slideshow with smooth crossfade */}
      <div className="absolute inset-0 -z-20">
        <AnimatePresence mode="wait">
          <motion.img
            key={BACKGROUND_IMAGES[index].src}
            src={BACKGROUND_IMAGES[index].src}
            alt={BACKGROUND_IMAGES[index].alt}
            loading="eager"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.005 }}
            transition={{ duration: reduced ? 0 : 1.2, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Strong dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
      </div>

      <main className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 lg:py-40 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hhhh2.PNG-ZNPrnomxqafuPbE3PtYjskiGBRrvnQ.png"
                alt="Brand logo"
                width={120}
                height={48}
                className="h-12 w-auto opacity-95"
              />
            </div>

            {/* Headline */}
            <motion.h1
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white drop-shadow"
            >
              Engineering Excellence
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300">
                Built for Real-World Impact
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
              className="mt-5 text-lg md:text-xl text-white/90 mx-auto max-w-2xl drop-shadow"
            >
              Premium engineering, supply, and project solutions across electrical, mechanical, oil & gas, and
              industrial infrastructure.
            </motion.p>

            {/* Feature badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4">
              {[
                { Icon: Zap, label: "Innovative Solutions" },
                { Icon: Shield, label: "Reliable Execution" },
                { Icon: Award, label: "Quality Assured" },
              ].map(({ Icon, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur-md"
                >
                  <Icon className="h-5 w-5 text-emerald-300" aria-hidden />
                  <span className="text-sm font-medium text-white">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/15 ring-1 ring-white/10 transition-[transform,filter] hover:saturate-125"
              >
                Explore Services
              </motion.button>

              {/* 🔥 Updated Details Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-3 text-base font-semibold text-white/95 backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
              >
                Details
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="h-8 w-8 text-white/85" />
        <span className="sr-only">{"Scroll down"}</span>
      </motion.div>
    </section>
  )
}
