import { useLocation, useNavigate } from "react-router-dom";
import logo from "../Assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/Store/Store";

export const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("authUser") || "null");

  const navigate = useNavigate();

  const cartItem = useSelector((state: RootState) => state.cart);

  const cartItemLen = cartItem.length;

  function handleSignOut() {
    navigate("/login");
    localStorage.removeItem("authUser");
  }

  function handleHomeClick() {
    navigate("/home");
  }

  function handleContactClick() {
    navigate("/contact");
  }

  function handleAboutClick() {
    navigate("/about");
  }

  function handleProductClick() {
    navigate("/product");
  }

  function handleCartClick() {
    navigate("/cart");
  }

  function handleDashboardClick() {
    navigate("/dashboard");
  }

  const location = useLocation();
  const isOnProductPage = location.pathname.startsWith("/product");

  return (
    <div className="bg-[#232422] z-50 h-[80px] fixed top-0 left-0 w-full flex items-center justify-between px-6 text-white">
      <div className="flex-shrink-0">
        <img src={logo} className="object-contain w-[100px]" />
      </div>

      <div className="flex-1 flex justify-center ">
        <ul className="flex gap-x-6">
          <li
            onClick={handleHomeClick}
            className="cursor-pointer hover:text-[#dcf149]"
          >
            Home
          </li>

          <li
            onClick={handleProductClick}
            className="cursor-pointer hover:text-[#dcf149]"
          >
            Product
          </li>
          <li
            onClick={handleContactClick}
            className="cursor-pointer hover:text-[#dcf149]"
          >
            Contact
          </li>
          <li
            onClick={handleAboutClick}
            className="cursor-pointer hover:text-[#dcf149]"
          >
            About us
          </li>
          {user?.role === "admin" && (
            <li
              onClick={handleDashboardClick}
              className="cursor-pointer hover:text-[#dcf149]"
            >
              Dashboard
            </li>
          )}
        </ul>
      </div>

      <div className="flex gap-5 items-center relative">
        {isOnProductPage && (
          <div className="relative">
            <FontAwesomeIcon
              onClick={handleCartClick}
              className="cursor-pointer"
              icon={faShoppingCart}
              size="lg"
            />
            {cartItemLen != 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemLen}
              </span>
            )}
          </div>
        )}

        <li
          onClick={handleSignOut}
          className="cursor-pointer list-none hover:text-[#dcf149]"
        >
          Sign Out
        </li>
      </div>
    </div>
  );
};
