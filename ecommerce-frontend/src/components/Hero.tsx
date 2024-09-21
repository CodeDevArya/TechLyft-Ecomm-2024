import HeroImg from "../assets/HeroImage.jpg";

const Hero = () => {
  return (
    <div>
      <section className="hero">
        <div>
          <div className="hero-content">
            <div className="hero-text">
              <h2>Cutting-Edge Tech at Your Fingertips</h2>
              <p>
                Discover the latest in laptops, smartphones, and audio gear.
                Elevate your digital lifestyle with our premium selection.
              </p>
              <a href="/shop">
              <button>Shop Now</button>
              </a>
            </div>
            <div className="hero-image">
              <img src={HeroImg} alt="Latest Tech Devices" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
