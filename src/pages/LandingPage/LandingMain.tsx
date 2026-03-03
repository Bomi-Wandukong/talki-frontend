import HeroSection from './components/HeroSection'
import WorrySection from './components/WorrySection'
import PracticeSection from './components/PracticeSection'
import RequirementsSection from './components/RequirementsSection'
import FaqSection from './components/FaqSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import MainNav from '@/components/Nav/MainNav'

export default function Main() {
  return (
    <main className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <MainNav />

      <HeroSection />
      <WorrySection />
      <PracticeSection />
      <RequirementsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
