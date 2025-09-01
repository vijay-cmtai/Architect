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
import BrandPartnersSection from "@/components/BrandPartnersSection";
import SellersSection from "@/components/SellersSection";
import ContractorsSection from "@/components/ContractorsSection";
import ConstructionPartnersSection from "@/components/ConstructionPartnersSection";
import TopBar from "@/components/TopBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />
      <Hero />
      <ReadymadePlansSection />
      <CustomDesignSection />
      <FeaturedProducts />
      <ConstructionPartnersSection />
      <ContractorsSection />
      <SellersSection />
      <StandardPackagesSection />
      <PremiumPackagesSection />
      <CorporatePackagesSection />
      <RegionalPlansSection />
      <BrandPartnersSection />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
