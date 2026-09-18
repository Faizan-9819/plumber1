import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import About from "@/app/components/About";
import Stats from "@/app/components/Stats";
import Services from "@/app/components/Services";
import WhyChooseUs from "@/app/components/WhyChooseUs";
import HowItWorks from "@/app/components/HowItWorks";
import Gallery from "@/app/components/Gallery";
import Team from "@/app/components/Team";
import Reviews from "@/app/components/Reviews";
import CtaBanner from "@/app/components/CtaBanner";
import Areas from "@/app/components/Areas";
import Blog from "@/app/components/Blog";
import Faq from "@/app/components/Faq";
import Contact from "@/app/components/Contact";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <WhyChooseUs />
        <HowItWorks />
        <Gallery />
        <Team />
        <Reviews />
        <CtaBanner />
        <Areas />
        <Blog />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
