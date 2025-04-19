import { DemoSection } from '@/components/landing/demo-section';
import { FaqSection } from '@/components/landing/faq-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <FaqSection />
      </div>
      
      <Footer />
    </main>
  );
}