import React from "react";
import CategoryCard from "../components/CategoryCard";
import LatestproductSection from "../components/LatestproductSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import CustomerReview from "./CustomerReview";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page container">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <CategoryCard />

      {/* Latest Products Section */}
      <LatestproductSection />

      {/* Customer Review Section */}
      <CustomerReview />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
