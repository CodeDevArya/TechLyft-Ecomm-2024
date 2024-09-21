import { useProductStore } from "../store/productStore";
import { useEffect, useState } from "react";
import { ListProduct } from "../types/types";
import ListProductCard from "./ProductCard";

const LatestproductSection = () => {
  const { latestProducts } = useProductStore();
  const [AllLatestProduct, setAllLatestProduct] = useState<any>([]);

  useEffect(() => {
    const allProducts = async () => {
      const res: any = await latestProducts();
      setAllLatestProduct(res);
    };
    allProducts();
  }, []);

  return (
    <section className="latest-products">
      <div className="latest-products__container">
        <h2 className="latest-products__title">Latest Products</h2>
        <p className="latest-products__subtitle">
          Discover our newest tech innovations
        </p>
        <div className="latest-products__grid">
          {AllLatestProduct.map((product: ListProduct) => (
            <ListProductCard
              key={product._id}
              photo={product.photos[0]}
              name={product.name}
              price={product.price}
              link={product._id}
              rating={product.rating}
              totalReviews={product.totalReviews}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestproductSection;
