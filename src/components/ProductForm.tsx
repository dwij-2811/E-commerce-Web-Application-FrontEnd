import React, { useState } from "react";
import { AddOn, Customizations, Item } from "./Types";
import "./PopupProduct.css";
import { useCartContext } from "./CartProvider";
import Modal from "react-bootstrap/Modal";
import ToastAlert from "./Alert";

const SPICINESS_OPTIONS = [0.5, 1, 1.5, 2];

interface Props {
  product: Item;
  isOpen: boolean;
  onClose: () => void;
  customizations: Customizations[];
  addOns: AddOn[];
}

const ProductForm: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
  customizations,
  addOns,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>(
    {}
  );

  const { handleAddToCart } = useCartContext();

  const [itemSpiciness, setItemSpiciness] = useState<number>(0.5);

  const [itemQuantities, setItemQuantities] = useState<number>(0);

  const handleAddOnChange = (
    itemId: number,
    addOnId: number,
    CustomizationId: number,
    isChecked: boolean
  ) => {
    setSelectedAddOns((prevSelectedAddOns) => {
      const newSelectedAddOns = { ...prevSelectedAddOns };
      const key = itemId + "-" + addOnId + "-" + CustomizationId;

      if (isChecked) {
        newSelectedAddOns[key] = true;
      } else {
        delete newSelectedAddOns[key];
      }

      return newSelectedAddOns;
    });
  };

  const getSelectedAddOns = (itemId: number): AddOn[] => {
    const selectedAddOnIds = Object.keys(selectedAddOns)
      .filter((key) => key.startsWith(itemId + "-"))
      .map((key) => parseInt(key.split("-")[1]));

    return addOns.filter((addOn) => selectedAddOnIds.includes(addOn.id)) || [];
  };

  const handleIncrement = () => {
    setItemQuantities((prevQuantities) => {
      var newQuantities = prevQuantities;
      newQuantities++;
      return newQuantities;
    });
  };

  const handleDecrement = () => {
    setItemQuantities((prevQuantities) => {
      var newQuantities = prevQuantities;
      if (newQuantities > 0) {
        newQuantities--;
      }
      return newQuantities;
    });
  };

  const handleSpicinessChange = (value: number) => {
    if (value > 1) {
      console.warn("Warning: Spiciness above 100% may be too hot!");
    }
    setItemSpiciness((prevSpiciness) => {
      var newSpiciness = prevSpiciness;
      newSpiciness = value;
      return newSpiciness;
    });
  };

  const handleAddToCartPopup = (
    item: Item,
    quantity: number,
    selectedAddOns: AddOn[],
    spiciness: number
  ) => {
    if (quantity <= 0) {
      setAlertMessage("Quantity must be greater than zero!");
      setShowErrorAlert(true);

      // Automatically hide the alert after a certain time (e.g., 5 seconds)
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 5000);
      return;
    }
    handleAddToCart(item, quantity, selectedAddOns, spiciness);

    setItemQuantities((prevQuantities) => {
      var newQuantities = prevQuantities;
      newQuantities = 0;
      return newQuantities;
    });

    onClose();

    setAlertMessage("Product Added to Cart!");
    setShowAlert(true);

    // Automatically hide the alert after a certain time (e.g., 5 seconds)
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  return (
    <div>
      <Modal show={isOpen} onHide={onClose}>
        {showAlert && (
          <ToastAlert
            message={alertMessage}
            onClose={() => setShowAlert(false)}
            type="success"
            duration={5000}
          />
        )}
        {showErrorAlert && (
          <ToastAlert
            message={alertMessage}
            onClose={() => setShowErrorAlert(false)}
            type="error"
            duration={5000}
          />
        )}
        <Modal.Header className="modal-header-product">
          <div>
            <button
              type="button"
              className="btn-close position-absolute top-1 start-1"
              onClick={onClose}
            ></button>
            <img
              src={product.image}
              alt={product.name}
              className="popup-product-image"
            />
          </div>
        </Modal.Header>
        <Modal.Body className="modal-body-style">
          <div className="container-Fuild popup-container">
            <div className="product-details">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              {product.customizations.map((customizationsId) => {
                const matchedCustomizations = customizations
                  .filter((customization) => customization.isInStock)
                  .find(
                    (customization) => customization.id === customizationsId
                  );
                if (matchedCustomizations) {
                  var message = matchedCustomizations.required
                    ? "Selection required"
                    : "Optional selection";
                  var selectionQuantity =
                    matchedCustomizations.maximum ===
                    matchedCustomizations.minimum
                      ? String(matchedCustomizations.maximum)
                      : "up to " + String(matchedCustomizations.maximum);
                  return (
                    <div
                      key={matchedCustomizations.id}
                      className="customization-container"
                    >
                      <p className="customization-message">{message}</p>
                      <h6 className="customization-title">
                        Choose {selectionQuantity}:
                      </h6>
                      {matchedCustomizations.addOns.map((addOnId: number) => {
                        const matchedAddOn = addOns.find(
                          (addOn) => addOn.id === addOnId
                        );
                        const isAnyCheckBoxSelected =
                          matchedCustomizations.addOns.some(
                            (addOnId: number) =>
                              selectedAddOns[
                                product.id +
                                  "-" +
                                  addOnId +
                                  "-" +
                                  matchedCustomizations.id
                              ]
                          );
                        if (matchedAddOn) {
                          return (
                            <p
                              key={matchedAddOn.id}
                              className="customization-option"
                            >
                              <label>
                                <input
                                  type="checkbox"
                                  className="addon-checkbox"
                                  checked={
                                    selectedAddOns[
                                      product.id +
                                        "-" +
                                        matchedAddOn.id +
                                        "-" +
                                        matchedCustomizations.id
                                    ] || false
                                  }
                                  onChange={(e) =>
                                    handleAddOnChange(
                                      product.id,
                                      matchedAddOn.id,
                                      matchedCustomizations.id,
                                      e.target.checked
                                    )
                                  }
                                  disabled={
                                    isAnyCheckBoxSelected &&
                                    !selectedAddOns[
                                      product.id +
                                        "-" +
                                        matchedAddOn.id +
                                        "-" +
                                        matchedCustomizations.id
                                    ]
                                  }
                                />
                                <span className="addon-label">
                                  {matchedAddOn.name}
                                  {matchedAddOn.price > 0 && (
                                    <span>
                                      (+${matchedAddOn.price.toFixed(2)})
                                    </span>
                                  )}
                                </span>
                              </label>
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                }
                return null;
              })}
              <div className="spiciness-container">
                <label className="spiciness-label">
                  Spiciness:
                  <input
                    type="range"
                    min={0}
                    max={SPICINESS_OPTIONS.length - 1}
                    step={1}
                    value={SPICINESS_OPTIONS.indexOf(itemSpiciness)}
                    onChange={(e) =>
                      handleSpicinessChange(
                        SPICINESS_OPTIONS[parseInt(e.target.value)]
                      )
                    }
                  />
                  <span className="spiciness-value">
                    {itemSpiciness * 100}%
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-Footer">
            <div className="quantity-container">
              <button onClick={() => handleDecrement()}>-</button>
              <span className="quantity">{itemQuantities}</span>
              <button onClick={() => handleIncrement()}>+</button>
            </div>
            <button
              className="add-to-cart-button"
              onClick={() =>
                handleAddToCartPopup(
                  product,
                  itemQuantities,
                  getSelectedAddOns(product.id),
                  itemSpiciness
                )
              }
            >
              Add to Cart
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductForm;
