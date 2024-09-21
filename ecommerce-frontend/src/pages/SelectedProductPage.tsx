import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useEffect, useState } from "react";
import {
  FaArrowLeftLong,
  FaArrowRightLong,
  FaRegStarHalfStroke,
} from "react-icons/fa6";
import Select, { OptionsOrGroups } from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useCartStore } from "../store/cartStore";
import Loader from "../components/admin/Loader";
import toast from "react-hot-toast";
import { server } from "../App";
import { useAuthStore } from "../store/authStore";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer";
import { useReviewStore } from "../store/reviewStore";
import {
  CircleChevronLeft,
  CircleChevronRight,
  Trash2Icon,
} from "lucide-react";

const SelectedProductPage = () => {
  const { user } = useAuthStore();
  const { getProductById, isLoading } = useProductStore();
  const { addToCart, cartItems } = useCartStore();
  const { fetchReviews, addReview, deleteReview, getUserReviews } =
    useReviewStore();
  const { productid } = useParams();

  const navigate = useNavigate();

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [img, setImg] = useState<string[]>();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>(0);

  const [reviews, setReviews] = useState<any>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: "",
    text: "",
    rating: 0,
    name: user?.name!,
  });
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageReviews, setAverageReviews] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isMyOnly, setIsMyOnly] = useState(Boolean);

  const options: OptionsOrGroups<any, any> | undefined = [
    { value: "All", label: "All" },
    { value: "My-Reviews", label: "My Reviews" },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(productid!);
      setImg(res.photos);
      setName(res.name);
      setCategory(res.category);
      setPrice(res.price);
      setStock(res.stock);
      setDescription(res.description);
      setAverageReviews(res.rating);
      setTotalReviews(res.totalReviews);

      // Assuming stock is available in the product details
      const existingItem = cartItems.find((c) => c.id === productid);
      if (existingItem) {
        setQuantity(existingItem?.quantity || 1);
      }
    };

    fetchProduct();
  }, [productid]);

  useEffect(() => {
    const fetchReviewsAndUpdate = async () => {
      const resTwo: any = await fetchReviews(productid!, page);
      setReviews(
        resTwo.reviews.map((review: any) => ({
          ...review,
          reviewDate: review.reviewDate.split("T")[0], // Format the date here
        }))
      );
      setPage(resTwo.currentPage);
      setMaxPage(resTwo.totalPages);
    };

    fetchReviewsAndUpdate();
  }, [productid, page]);

  const handleAddToCart = () => {
    if (!user) {
      return navigate("/login");
    }

    const existingItem = cartItems.find((item) => item.id === productid);

    if (existingItem) {
      toast.error("Product already added");
    } else {
      if (quantity <= stock) {
        addToCart({
          id: productid,
          name: name!,
          price: price!,
          imageSrc: server + "/" + img![0],
          quantity,
          stock,
        });
        toast.success("Product Added");
      } else {
        // If trying to add more than the stock
        alert("Cannot add more than available stock");
      }
    }
  };

  // ------------Review--------------------

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
    setErrors({ ...errors, rating: "" });
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!newReview.title.trim()) newErrors.title = "Title is required";
    if (newReview.title.trim().length < 3)
      newErrors.title = "Title must be more than 3 characters";
    if (!newReview.text.trim()) newErrors.text = "Review text is required";
    if (newReview.rating === 0) newErrors.rating = "Rating is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        await addReview(
          productid!,
          newReview.title,
          newReview.text,
          newReview.rating,
          user?.name!,
          user?._id!
        );
        setReviews((prevReviews: any) => [
          {
            ...newReview,
            _id: prevReviews.length + 1,
            reviewDate: new Date().toISOString().split("T")[0],
          },
          ...prevReviews,
        ]);
        setNewReview({ title: "", text: "", rating: 0, name: "" });
        setShowForm(false);
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add review");
    }
  };

  const ondeleteHandler = async (id: string) => {
    await deleteReview(productid!, id, user?._id!);
    setReviews(reviews.filter((review: any) => review._id !== id));
    toast.success("Review deleted successfully");
  };

  const onUserReviewOnly = async () => {
    setIsMyOnly(!isMyOnly);
    if (!isMyOnly) {
      try {
        const res: any = await getUserReviews(productid!, user?._id!);
        setReviews(
          res.reviews.map((review: any) => ({
            ...review,
            reviewDate: review.reviewDate.split("T")[0], // Format the date here
          }))
        );
        setMaxPage(1);
      } catch (error) {
        setTotalReviews(0);
        return setReviews([]);
      }
    } else {
      const res: any = await fetchReviews(productid!, page);
      setReviews(
        res.reviews.map((review: any) => ({
          ...review,
          reviewDate: review.reviewDate.split("T")[0], // Format the date here
        }))
      );
      setPage(res.currentPage);
      setMaxPage(res.totalPages);
      setTotalReviews(res.totalReviews);
    }
  };

  return (
    <div className="product-details container">
      {isLoading || !img ? (
        <Loader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={img.map((img) => `${server}/${img}`)}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={img.map((img) => `${server}/${img}`)}
                />
              )}
            </section>
            <section>
              <code>{category}</code>
              <h1>{name}</h1>
              <div className="SelectProductPage-Review-review-rating">
                {averageReviews !== 0 ? (
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFullStar = star <= Math.floor(averageReviews); // Check for full stars
                      const isHalfStar =
                        star === Math.ceil(averageReviews) &&
                        !Number.isInteger(averageReviews); // Check for half star

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
                    })}
                  </div>
                ) : (
                  <p>No reviews</p>
                )}
                ({totalReviews})
              </div>
              <h3>₹{price}</h3>
              <p>{!description ? "No Description" : description}</p>
              <article>
                {stock === 0 ? (
                  <button className="red">Out of Stock</button>
                ) : (
                  <button onClick={handleAddToCart} disabled={!stock}>
                    Add To Cart
                  </button>
                )}
              </article>
            </section>
          </main>
          <div className="SelectProductPage-Review-container">
            <h2 className="SelectProductPage-Review-title">
              Customer Reviews ({totalReviews}){" "}
            </h2>

            <div className="SelectProductPage-Review-add-container">
              <button
                onClick={() => {
                  if (user) {
                    setShowForm(true);
                  } else {
                    toast.error("Please login to write a review");
                  }
                }}
                className="SelectProductPage-Review-add-button"
              >
                Add Review
              </button>
              {user && (
                <Select
                  options={options}
                  placeholder="filters"
                  className="SelectProductPage-Review-filter-select"
                  defaultValue={options[0]}
                  onChange={onUserReviewOnly}
                />
              )}
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="SelectProductPage-Review-form-container"
                >
                  <h3 className="SelectProductPage-Review-form-title">
                    Write a Review
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="SelectProductPage-Review-form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newReview.title}
                        onChange={handleInputChange}
                        maxLength={30}
                        className={`SelectProductPage-Review-form-input ${
                          errors.title
                            ? "SelectProductPage-Review-input-error"
                            : ""
                        }`}
                        placeholder="Enter review title"
                      />
                      {errors.title && (
                        <p className="SelectProductPage-Review-error-text">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div className="SelectProductPage-Review-form-group">
                      <label htmlFor="text">Review</label>
                      <textarea
                        id="text"
                        name="text"
                        maxLength={150}
                        value={newReview.text}
                        onChange={handleInputChange}
                        className={`SelectProductPage-Review-form-input ${
                          errors.text
                            ? "SelectProductPage-Review-input-error"
                            : ""
                        }`}
                        rows={4}
                        placeholder="Write your review here"
                      ></textarea>
                      {errors.text && (
                        <p className="SelectProductPage-Review-error-text">
                          {errors.text}
                        </p>
                      )}
                    </div>
                    <div className="SelectProductPage-Review-form-group">
                      <label>Rating</label>
                      <div className="SelectProductPage-Review-rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`SelectProductPage-Review-star-icon ${
                              star <= newReview.rating
                                ? "SelectProductPage-Review-star-filled"
                                : "SelectProductPage-Review-star-empty"
                            }`}
                            onClick={() => handleRatingChange(star)}
                          />
                        ))}
                      </div>
                      {errors.rating && (
                        <p className="SelectProductPage-Review-error-text">
                          {errors.rating}
                        </p>
                      )}
                    </div>
                    <div className="SelectProductPage-Review-form-actions">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="SelectProductPage-Review-cancel-button"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="SelectProductPage-Review-submit-button"
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="SelectProductPage-Review-success-message"
                  role="alert"
                >
                  <p>
                    <strong>Success!</strong> Your review has been submitted
                    successfully.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="SelectProductPage-Review-reviews-grid">
              {reviews.map((review: any) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="SelectProductPage-Review-review-card"
                >
                  <h3 className="SelectProductPage-Review-review-title">
                    {review.title}
                  </h3>
                  <p className="SelectProductPage-Review-review-text">
                    {review.text}
                  </p>
                  <div className="SelectProductPage-Review-review-rating">
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= review.rating
                              ? "SelectProductPage-Review-star-filled"
                              : "SelectProductPage-Review-star-empty"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="SelectProductPage-Review-review-meta">
                    By {review.name} on {review.reviewDate}
                    {review.userId === user?._id && (
                      <div>
                        <Trash2Icon
                          className="SelectProductPage-Review-trash"
                          onClick={() => ondeleteHandler(review._id)}
                        />
                      </div>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
            {maxPage !== 1 && (
              <div className="SelectProductPage-Review-next-prev-div">
                <button
                  onClick={() => {
                    if (page !== 1) setPage(page - 1);
                  }}
                  disabled={page === 1}
                  className="SelectProductPage-Review-next-button"
                >
                  <CircleChevronLeft />
                </button>
                <p className="SelectProductPage-Review-para">{page}</p>
                <button
                  onClick={() => {
                    if (page !== maxPage) setPage(page + 1);
                  }}
                  disabled={page === maxPage}
                  className="SelectProductPage-Review-next-button"
                >
                  <CircleChevronRight />
                </button>
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

const NextButton: CarouselButtonType = () => (
  <button className="carousel-btn">
    <FaArrowRightLong />
  </button>
);

const PrevButton: CarouselButtonType = () => (
  <button className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default SelectedProductPage;
