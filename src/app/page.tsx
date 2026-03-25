import HeroSection from '@/components/home/HeroSection'
import FeaturedHotels from '@/components/home/FeaturedHotels'
import IslandsBanner from '@/components/home/IslandsBanner'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import ExcursionsSection from '@/components/home/ExcursionsSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import NewsletterSection from '@/components/home/NewsletterSection'
import MobileSearchForm from '@/components/home/MobileSearchForm'
import MobileDestinations from '@/components/home/MobileDestinations'
import PaymentLogos from '@/components/home/PaymentLogos'

export default function HomePage() {
  return (
    <>
      {/* Mobile only */}
      <MobileSearchForm />

      {/* Desktop only */}
      <div className="hidden md:block">
        <HeroSection />
      </div>

      {/* Desktop only */}
      <div className="hidden md:block">
        <IslandsBanner />
      </div>

      {/* Mobile only — inside component */}
      <MobileDestinations />

      {/* Has mobile + desktop versions inside */}
      <FeaturedHotels />
      <FeaturedPackages />
      <ExcursionsSection />

      {/* Desktop only */}
      <div className="hidden md:block">
        <WhyChooseUs />
      </div>

    </>
  )
}
