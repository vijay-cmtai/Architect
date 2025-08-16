import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CategoriesSection from "@/components/CategoriesSection";
import RegionalPlansSection from "@/components/RegionalPlansSection";
import ReadymadePlansSection from "../components/ReadymadePlansSection";
import CustomDesignSection from "../components/CustomDesignSection";
import StandardPackagesSection from "../components/StandardPackagesSection";
import PremiumPackagesSection from "../components/PremiumPackagesSection";
import CorporatePackagesSection from "../components/CorporatePackagesSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ReadymadePlansSection />
      <CustomDesignSection />
      <StandardPackagesSection />
      <PremiumPackagesSection />
      <CorporatePackagesSection />

      <Services />
      <FeaturedProducts />
      <CategoriesSection />
      <RegionalPlansSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
