"use client"

import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Products from "./components/Products"
import WhyChooseUs from "./components/WhyChooseUs"
import Blog from "./components/Blog"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Career from "./components/Career"

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      {/* <Products /> */}
      <WhyChooseUs />
      <Blog />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Update ScrollTrigger on scroll
    lenis.on("scroll", ScrollTrigger.update)

    setTimeout(() => {
      lenis.scrollTo(0, { immediate: true })
    }, 100)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-neutral-50">
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/career" element={<Career />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
