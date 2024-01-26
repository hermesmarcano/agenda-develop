import React from "react";
import Navbar from "../../components/Navbar";
import Hero from "./components/Hero";
import RecommendedShops from "./components/RecommendedShops";
import Articles from "./components/Articles";
import PhotoText from "./components/PhotoText";
import RecommendedServices from "./components/RecommendedServices";
import Footer from "./components/Footer";
import PhotoTextReversed from "./components/PhotoTextReversed";
import Subscription from "./components/Subscription";

function Home() {


  return (
    <div>
      <Navbar />
      <Hero />
       {/* <RecommendedShops />  */}
      <PhotoText />
      <PhotoTextReversed />
      <PhotoText />
      <Articles />
      {/* <RecommendedServices /> */}
      <Subscription />
      <Footer />
    </div>
  );
}

export default Home;
