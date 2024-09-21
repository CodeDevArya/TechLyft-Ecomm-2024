import { FaStar } from "react-icons/fa";

const CustomerReview = () => {
  return (
    <div>
      <section className="reviews">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="review-grid">
            {[
              {
                name: "John Doe",
                review: "Amazing products and excellent customer service!",
                img: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "Elina Smith",
                review:
                  "The quality of their gadgets is unmatched. Highly recommended!",
                img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
              {
                name: "Mike Johnson",
                review:
                  "Fast shipping and the products exceed expectations. Will buy again!",
                img: "https://images.unsplash.com/photo-1524952249965-023a2a31663d?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              },
            ].map((review) => (
              <div key={review.name} className="review-item">
                <div className="review-header">
                  <img src={review.img} alt={review.name} />
                  <h3>{review.name}</h3>
                </div>
                <p>{review.review}</p>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="Review-Star" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerReview;
