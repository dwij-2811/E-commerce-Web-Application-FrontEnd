import ProductCard from "./ProductCard";
import CartPage from "./CartPage";
import { CartProvider } from "./CartProvider";
import "./Cart.css";

const ProductMainPage = () => {
  return (
    <CartProvider>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-9">
            <div className="py-3" id="maincontainer">
              <ProductCard />
            </div>
          </div>
          <div className="col-md-3">
            <div className="py-1" id="cart-container">
              <CartPage />
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
};

export default ProductMainPage;
