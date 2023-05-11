import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RecommendedShopsSlider from "../components/RecommendedShops";
import ArticlesSlider from "../components/Articles";
import PhotoAndTextSection from "../components/PhotoText";
import RecommendedServicesSection from "../components/RecommendedServices";
import Footer from "../components/Footer";
import PhotoAndTextSectionReversed from "../components/PhotoTextOpposite";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <RecommendedShopsSlider />
      <ArticlesSlider />
      <PhotoAndTextSection />
      <PhotoAndTextSectionReversed />
      <RecommendedServicesSection />
      <Footer />
    </div>
  );
}

export default Home;
