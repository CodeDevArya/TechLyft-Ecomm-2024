const NotFound = () => {
  return (
    <div className="NotFound">
      <div className="NotFound__content">
        <div className="NotFound__icon" />
        <h1 className="NotFound__title NotFound__title--large">
          404 - Page Not Found
        </h1>
        <p className="NotFound__description">
          Oops, the page you are looking for does not exist. Please check the
          URL or go back to the homepage.
        </p>
        <div className="NotFound__button-container">
          <a href="/" className="NotFound__button">
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
