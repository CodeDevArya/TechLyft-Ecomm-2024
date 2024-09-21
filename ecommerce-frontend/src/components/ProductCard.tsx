import { server } from "../App";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

const ListProductCard = ({
  photo,
  name,
  price,
  link,
  rating,
  totalReviews,
}: {
  photo: string;
  name: string;
  price: number;
  link: string;
  rating: number;
  totalReviews: number;
}) => {
  const navigate = useNavigate();
  return (
    <div>
      <div key={link} className="latest-products__item">
        <div className="latest-products__image-container">
          <img
            src={`${server}/${photo}`}
            alt={name}
            className="latest-products__image"
          />
          <div className="latest-products__overlay">
            <button
              className="latest-products__quick-view"
              onClick={() => navigate(`/shop/product/visit/${link}`)}
            >
              Quick View
            </button>
          </div>
        </div>
        <div className="latest-products__info">
          <h3 className="latest-products__name">{name}</h3>
          <p className="latest-products__price">₹{price}</p>
          <div className="latest-products__rating">
            <div className="latest-products__stars">
              {rating !== 0 ? (
                [1, 2, 3, 4, 5].map((star) => {
                  const isFullStar = star <= Math.floor(rating); // Check for full stars
                  const isHalfStar =
                    star === Math.ceil(rating) && !Number.isInteger(rating); // Check for half star

                  return (
                    <span key={star}>
                      {isFullStar ? (
                        <FaStar className="SelectProductPage-Review-star-filled TitleStar" />
                      ) : isHalfStar ? (
                        <FaRegStarHalfStroke className="SelectProductPage-Review-star-half TitleStar" />
                      ) : (
                        <FaStar className="SelectProductPage-Review-star-empty TitleStar" />
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="latest-products__reviews">No Reviews</span>
              )}
            </div>
            <span className="latest-products__reviews">({totalReviews})</span>
          </div>
          {/* <p>No reviews</p> */}
        </div>
      </div>
    </div>
  );
};

export default ListProductCard;
