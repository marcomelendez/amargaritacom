import HeroSection from '@/components/home/HeroSection'
import FeaturedHotels from '@/components/home/FeaturedHotels'
import IslandsBanner from '@/components/home/IslandsBanner'
import FeaturedPackages from '@/components/home/FeaturedPackages'
import ExcursionsSection from '@/components/home/ExcursionsSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedHotels />
      <IslandsBanner />
      <FeaturedPackages />
      <ExcursionsSection />
      <WhyChooseUs />
    </>
  )
}
