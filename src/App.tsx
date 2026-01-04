"use client"

import { useEffect, Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import WhyChooseUs from "./components/WhyChooseUs"
import Blog from "./components/Blog"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Career from "./components/Career"
import AdminPanel from "./pages/AdminPanel"
import WhatsAppFloat from "./components/WhatsAppFloat"

// Lazy load Products component for better performance
const Products = lazy(() => import("./components/Products"))

gsap.registerPlugin(ScrollTrigger)

// Loading component for Products page
function ProductsLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-[hsl(var(--brand-primary))]"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading Products...</p>
      </div>
    </div>
  )
}

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
      <WhyChooseUs />
      <Blog />
      <Contact />
      <Footer />
    </>
  )
}

// Products Page with Footer
function ProductsPage() {
  return (
    <>
      <Suspense fallback={<ProductsLoading />}>
        <Products />
      </Suspense>
      <Footer />
    </>
  )
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={
            <>
              <Header />
              <HomePage />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/products" element={
            <>
              <Header />
              <ProductsPage />
              <WhatsAppFloat />
            </>
          } />
          <Route path="/career" element={
            <>
              <Header />
              <Career />
              <WhatsAppFloat />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
