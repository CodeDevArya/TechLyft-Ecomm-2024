import React from "react";
import {
  ChevronRight,
  Headphones,
  Home,
  Laptop,
  Smartphone,
  Watch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryCard = () => {
  const categories = [
    {
      icon: <Laptop />,
      title: "Computers & Laptops",
      description:
        "High-performance machines for work and play. From ultrabooks to gaming powerhouses.",
      link: "search=&sort=&category=Laptop&maxPrice=1000000&page=1",
    },
    {
      icon: <Smartphone />,
      title: "Smartphones & Tablets",
      description:
        "Stay connected with the latest mobile devices. Featuring top brands and cutting-edge technology.",
      link: "search=&sort=&category=Mobile&maxPrice=1000000&page=1",
    },
    {
      icon: <Headphones />,
      title: "Audio & Accessories",
      description:
        "Immerse yourself in sound. Headphones, speakers, and audio accessories for every need.",
      link: "search=&sort=&category=Headphones&maxPrice=1000000&page=1",
    },
    {
      icon: <Home />,
      title: "Smart Home Devices",
      description:
        "Transform your living space. Smart lighting, security, and home automation solutions.",
      link: "search=&sort=&category=Tv&maxPrice=1000000&page=1",
    },
    {
      icon: <Watch />,
      title: "Wearable Tech",
      description:
        "Technology that moves with you. Smartwatches, fitness trackers, and more.",
      link: "search=&sort=&category=Watches&maxPrice=1000000&page=1",
    },
  ];

  const navigate = useNavigate();

  return (
    <div>
      {/* Categories Section */}
      <section className="browse-categories">
        <div className="browse-categories__container">
          <div className="browse-categories__header">
            <h2 className="browse-categories__title">Browse Categories</h2>
            <p className="browse-categories__subtitle">
              Explore our wide range of cutting-edge technology products
            </p>
          </div>
          <div className="browse-categories__grid">
            {categories.map((category, index) => (
              <div key={index} className="browse-categories__card">
                <div className="browse-categories__card-header">
                  <div className="browse-categories__icon-wrapper">
                    {React.cloneElement(category.icon, {
                      className: "browse-categories__icon",
                    })}
                  </div>
                  <h3 className="browse-categories__card-title">
                    {category.title}
                  </h3>
                </div>
                <div className="browse-categories__card-content">
                  <p className="browse-categories__card-description">
                    {category.description}
                  </p>
                </div>
                <div className="browse-categories__card-footer">
                  <button
                    className="browse-categories__button"
                    onClick={() => navigate(`/shop?${category.link}`)}
                  >
                    Explore
                    <ChevronRight className="browse-categories__button-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryCard;
