import HeroSection from './components/HeroSection'
import WorrySection from './components/WorrySection'
import PracticeSection from './components/PracticeSection'
import RequirementsSection from './components/RequirementsSection'
import FaqSection from './components/FaqSection'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'

export default function Main() {
  return (
    <main className="h-screen w-full snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <section className="w-full snap-start">
        <HeroSection />
      </section>
      <section className="w-full snap-start">
        <WorrySection />
      </section>
      <section className="w-full snap-start">
        <PracticeSection />
      </section>
      <section className="w-full snap-start">
        <RequirementsSection />
      </section>
      <section className="w-full snap-start">
        <FaqSection />
      </section>
      <section className="w-full snap-start">
        <CtaSection />
        <Footer />
      </section>
    </main>
  )
}
