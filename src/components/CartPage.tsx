// Cart.tsx
import { AddOn } from "./Types"; // Import the CartItem and AddOn interfaces
import { Link } from "react-router-dom";
import { useCartContext } from "./CartProvider";

const Cart = () => {
  const { cart, handleRemoveItem } = useCartContext();
  const cartItems = cart.items;

  const hasHighSpiciness = cartItems.some((item) => item.spiciness > 1);

  // Function to calculate the total price of items in the cart

  return (
    <div>
      <h1>Cart</h1>
      {hasHighSpiciness && (
        <div style={{ color: "red" }}>
          Warning: Some items have spiciness above 100%!
        </div>
      )}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.cartItemId}>
              <div className="cart-item-details">
                <p className="cart-item-name">
                  <span className="cart-item-quantity">{item.quantity}x</span>
                  <span className="cart-item-title">{item.name}</span>
                  <span className="cart-item-price">
                    ${item.itemTotal.toFixed(2)}
                  </span>
                </p>
                <div className="cart-item-info-details">
                  <p className="cart-quantity">Spiciness: {item.spiciness * 100}%</p>
                  {item.addOns.length > 0 && (
                    <div className="selected-addons">
                      <ul>
                        {item.addOns.map((addOn: AddOn) => (
                          <li key={addOn.id}>
                            <div className="cart-addon">
                              {addOn.name} {addOn.price > 0 ? ` (+$${addOn.price.toFixed(2)})` : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button
                className="cart-delete-button"
                onClick={() =>
                  handleRemoveItem(item.cartItemId, item.itemTotal)
                }
              >
                Delete
              </button>
              </div>
              
            </div>
          ))}
          
          <Link to="/checkout">
            <button type="button" className="cart-checkout-button">
              Checkout ${cart.cartTotal.toFixed(2)}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
