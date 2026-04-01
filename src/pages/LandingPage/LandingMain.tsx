import { useRef, useState } from 'react'
import HeroSection from './components/HeroSection'
import WorrySection from './components/WorrySection'
import PracticeSection from './components/PracticeSection'
import RequirementsSection from './components/RequirementsSection'
import FaqSection from './components/FaqSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import MainNav from '@/components/Nav/MainNav'
import Nav from '@/components/Nav/Nav'

export default function Main() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const [useMainNav, setUseMainNav] = useState(true)

  const handleScroll = () => {
    if (!sentinelRef.current || !mainRef.current) return
    const sentinelTop = sentinelRef.current.getBoundingClientRect().top
    setUseMainNav(sentinelTop > 0)
  }
  //보이지 않는 div를 추가해서 해당 div를 넘어가면 nav 변경하도록 함

  return (
    <main
      ref={mainRef}
      onScroll={handleScroll}
      className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
    >
      {useMainNav ? <MainNav /> : <Nav />}

      <HeroSection />
      <WorrySection />
      <div ref={sentinelRef} />
      <PracticeSection />
      <RequirementsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
