import { useEffect, useState } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import { BiSolidDownArrowAlt } from "react-icons/bi";
import { ImCross } from "react-icons/im";
import { ShoppingBag } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { logout, isAuthenticated, user, isLoading, isCheckingAuth } =
    useAuthStore();

  const navigate = useNavigate();
  const location = useLocation(); // Get current path

  // Update active link based on the current URL path
  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/") {
      setActiveLink("home");
    } else if (currentPath === "/shop") {
      setActiveLink("products");
    } else if (currentPath === "/about-us") {
      setActiveLink("about us");
    } else {
      setActiveLink("");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    if (link === "home") {
      navigate("/");
    } else if (link === "products") {
      navigate("/shop");
    } else if (link === "about us") {
      navigate("/about-us");
    } else if (link === "cart") {
      navigate("/cart");
    }
  };

  return (
    <nav className="navbar container">
      {isLoading || isCheckingAuth ? (
        <div></div>
      ) : (
        <>
          <div
            className={`navbar-container navbar-container-sm navbar-container-lg`}
          >
            <div className="navbar-header">
              <div className="flex-shrink-0 flex items-center">
                <a
                  href="/"
                  className="navbar-logo"
                  onClick={() => handleLinkClick("home")}
                >
                  TechLyft
                </a>
              </div>

              <div className="navbar-links hidden sm:flex">
                {["Home", "Products", "About Us"].map((item) => (
                  <span
                    key={item.toLowerCase()}
                    className={`${
                      activeLink === item.toLowerCase()
                        ? "navbar-link-active"
                        : "navbar-link"
                    } cursor-pointer`}
                    onClick={() => (
                      handleLinkClick(item.toLowerCase()),
                      navigate(
                        item === "Home"
                          ? "/"
                          : item === "Products"
                          ? "/shop"
                          : "/about-us"
                      )
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="header-cart-user flex">
                <div>
                  {isAuthenticated ? (
                    <>
                      {" "}
                      <div className="flex">
                        <button
                          className="navbar-cart-button"
                          onClick={() => (
                            handleLinkClick("cart"), navigate("/cart")
                          )}
                        >
                          <div className="relative">
                            <ShoppingBag
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </div>
                        </button>
                        <button
                          className="navbar-user-button"
                          id="user-menu"
                          aria-expanded="false"
                          aria-haspopup="true"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <div className="relative">
                            <FaUser aria-hidden="true" />
                            {!isDropdownOpen ? (
                              <BiSolidDownArrowAlt />
                            ) : (
                              <ImCross aria-hidden="true" />
                            )}
                          </div>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <button
                        className="navbar-login-button"
                        onClick={() => navigate("/login")}
                      >
                        Login
                      </button>
                    </div>
                  )}

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="navbar-dropdown"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                      >
                        {(user?.role === "admin"
                          ? ["Dashboard", "Orders"]
                          : ["Orders"]
                        ).map((item) => (
                          <span
                            key={item}
                            className="navbar-dropdown-item"
                            role="menuitem"
                            onClick={() => {
                              handleLinkClick(item.toLowerCase());
                              setIsDropdownOpen(false);
                              navigate(
                                item === "Dashboard"
                                  ? "/admin/dashboard"
                                  : "/orders"
                              );
                            }}
                          >
                            {item}
                          </span>
                        ))}
                        <a
                          href="#"
                          className="navbar-dropdown-item"
                          role="menuitem"
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                        >
                          Logout
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="Choti-sreen-navbar">
                <button
                  className="navbar-mobile-menu-button"
                  onClick={() => (handleLinkClick("cart"), navigate("/cart"))}
                >
                  <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="navbar-mobile-menu-button"
                  aria-expanded="false"
                >
                  {isOpen ? (
                    <FaTimes className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FaBars className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden"
              >
                <div className="navbar-mobile-menu">
                  {["Home", "Products", "About Us"].map((item) => (
                    <a
                      key={item.toLowerCase()}
                      href={
                        item === "Home"
                          ? "/"
                          : item === "Products"
                          ? "/shop"
                          : "/about-us"
                      }
                      className={`navbar-link navbar-mobile-link`}
                      onClick={() => {
                        handleLinkClick(item.toLowerCase());
                        setIsOpen(false);
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
                <div className="navbar-user-info">
                  <div className="flex user-info-cart">
                    <div className="navbar-user-avatar">
                      <FaUser
                        className="navbar-user-avatar"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="navbar-user-details">
                      <div className="navbar-user-name">{user?.name}</div>
                      <div className="navbar-user-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {(user?.role === "admin"
                      ? ["Dashboard", "Orders"]
                      : ["Orders"]
                    ).map((item) => (
                      <a
                        key={item}
                        href={
                          item === "Dashboard" ? "/admin/dashboard" : "/orders"
                        }
                        className="navbar-mobile-link"
                        onClick={() => {
                          handleLinkClick(item.toLowerCase());
                          setIsOpen(false);
                        }}
                      >
                        {item}
                      </a>
                    ))}
                    <a
                      href="#"
                      className="navbar-mobile-link"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </nav>
  );
};

export default NavBar;
