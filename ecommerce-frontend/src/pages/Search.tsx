import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { ListProduct, ShopFiltersAndProduct } from "../types/types";
import toast from "react-hot-toast";
import Select from "react-select";
import ListProductCard from "../components/ProductCard";
import NotFoundImg from "../assets/no-results.png";
import { BsFilterSquareFill } from "react-icons/bs";
import Footer from "../components/Footer";

const Search = () => {
  const { shopAllProducts, categoriesOfProducts, error, isLoading } =
    useProductStore();

  // State and query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [maxPrice, setMaxPrice] = useState(
    Number(searchParams.get("maxPrice")) || 1000000
  );
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [maxPages, setMaxPages] = useState(1);
  const [inputValue, setInputValue] = useState(search);
  const debounceTimeout = useRef<number | null>(null);
  const [allProducts, setAllProducts] = useState<ListProduct[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  const isPrevPage = page > 1;
  const isNextPage = page < maxPages;

  ///////----------------------------------------
  const [showModal, setShowModal] = useState<boolean>(false);
  const [phoneActive, setPhoneActive] = useState<boolean>(
    window.innerWidth < 1100
  );

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);
  ///////----------------------------------------

  const handleSearchChange = (value: string) => {
    setInputValue(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = window.setTimeout(() => {
      setSearch(value);
      setSearchParams({
        search: value,
        sort,
        category,
        maxPrice: maxPrice.toString(),
        page: page.toString(),
      });
    }, 500);
  };

  // Update filters in URL whenever they change
  useEffect(() => {
    setSearchParams({
      search,
      sort,
      category,
      maxPrice: maxPrice.toString(),
      page: page.toString(),
    });
  }, [search, sort, category, maxPrice, page]);

  useEffect(() => {
    const getAllProductsAndCategory = async () => {
      try {
        const products: ShopFiltersAndProduct = await shopAllProducts(
          search,
          sort,
          category,
          maxPrice,
          page
        );
        const categories = await categoriesOfProducts();

        setAllProducts(products?.products);
        setMaxPages(products?.totalPage);

        const categoryOptions = [
          { value: "", label: "All" },
          ...categories.map((cat: any) => ({
            value: cat,
            label: cat,
          })),
        ];
        setOptions(categoryOptions);
      } catch (err) {
        toast.error("Failed to load data");
        console.error(err);
      }
    };

    getAllProductsAndCategory();
  }, [
    shopAllProducts,
    categoriesOfProducts,
    search,
    sort,
    category,
    maxPrice,
    page,
  ]);

  if (error) {
    toast.error(error);
    console.log(error);
  }

  return (
    <>
      <div className="products-search-page container">
        {/* ////--------------------------------------- */}

        <aside
          style={
            phoneActive
              ? {
                  width: "100vw",
                  height: "100vh",
                  position: "fixed",
                  top: 0,
                  left: showModal ? "0" : "-100vw",
                  transition: "all 0.5s",
                  backgroundColor: "white",
                  zIndex: "999",
                  display: "block",
                }
              : {}
          }
        >
          {/* //-------------- */}
          <>
            <h2>Filters</h2>

            <div className="radios">
              <h4>Category</h4>
              <Select
                options={options}
                id="category"
                placeholder="Choose Category"
                value={options.find((option) => option.value === category)}
                onChange={(selectedOption) => {
                  setCategory(selectedOption?.value || "");
                  setSearchParams({
                    search,
                    sort,
                    category: selectedOption?.value || "",
                    maxPrice: maxPrice.toString(),
                    page: page.toString(),
                  });
                }}
              />
            </div>
            <div className="border-bottom">
              <h4>Sort</h4>
              <div className="radios">
                <div className="input-shop">
                  <input
                    type="radio"
                    id="price-none"
                    name="price-none"
                    value=""
                    checked={sort === ""}
                    onChange={() => setSort("")}
                  />
                  <label htmlFor="price-none">None</label>
                </div>
                <div className="input-shop">
                  <input
                    type="radio"
                    id="low-to-high"
                    name="price-low-high"
                    value="low-to-high"
                    checked={sort === "low-to-high"}
                    onChange={() => setSort("low-to-high")}
                  />
                  <label htmlFor="low-to-high">Low to High</label>
                </div>
                <div className="input-shop">
                  <input
                    type="radio"
                    id="high-to-low"
                    name="price-low-high"
                    value="high-to-low"
                    checked={sort === "high-to-low"}
                    onChange={() => setSort("high-to-low")}
                  />
                  <label htmlFor="high-to-low">High to Low</label>
                </div>
              </div>
            </div>

            <div className="border-bottom">
              <h4>Max Price: {maxPrice || ""}</h4>
              <input
                className="price-range"
                type="range"
                min={100}
                max={200000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </>
          {/* //-------------- */}

          {phoneActive && (
            <button id="close-shop-sidebar" onClick={() => setShowModal(false)}>
              Apply Filters
            </button>
          )}
        </aside>

        {/* ////--------------------------------------- */}

        <main>
          <h1>
            Products
            <BsFilterSquareFill
              id="Shop-hamburger"
              onClick={() => setShowModal(true)}
            />
          </h1>

          <input
            type="text"
            placeholder="Search by name...."
            value={inputValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          {isLoading ? (
            <div>Loader...</div>
          ) : (
            <div className="search-products-list">
              {allProducts.length > 0 ? (
                allProducts.map((product: ListProduct) => (
                  <ListProductCard
                    key={product._id}
                    photo={product.photos[0]}
                    name={product.name}
                    price={product.price}
                    link={product._id}
                    rating={product.rating}
                    totalReviews={product.totalReviews}
                  />
                ))
              ) : (
                <img src={NotFoundImg} alt="" />
              )}
            </div>
          )}

          {maxPages > 1 && (
            <article>
              <button
                disabled={!isPrevPage}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span>
                {page} of {maxPages}
              </span>
              <button
                disabled={!isNextPage}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </article>
          )}
        </main>
      </div>
      {/* //////--------------------------------------- */}
      <Footer />
    </>
  );
};

export default Search;
