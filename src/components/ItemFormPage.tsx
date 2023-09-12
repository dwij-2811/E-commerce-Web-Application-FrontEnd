// ItemFormPage.tsx
import { useState, useEffect } from "react";
// Import the ItemForm component
import axios from "axios";
import { Item, Customizations } from "./Types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
// import "./itemPage.css";
import ToastAlert from "./Alert";

interface ItemFormPageProps {
  onSelectPage: (any: string) => void;
}

const ItemFormPage: React.FC<ItemFormPageProps> = ({ onSelectPage }) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [products, setProducts] = useState<Item[]>([]); // Add this state
  const [customizations, setCustomizations] = useState<Customizations[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleEditProduct = (_product: Item) => {};

  const handleDeleteProduct = (productId: Item["id"]) => {
    axios
      .delete(`https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/products/${productId}`)
      .then(() => {
        fetchProducts();
        setAlertMessage("Product Delete Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Deleting Product: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleProductStatusChange = (
    productId: Item["id"],
    newStatus: boolean
  ) => {
    // Update the product status on the server
    axios
      .put(`https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/products/instock/${productId}`, {
        isInStock: newStatus,
      })
      .then(() => {
        // Update the local state with the updated product
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, isInStock: newStatus }
              : product
          )
        );
        setAlertMessage("Product Status Change Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error updating Product status: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
    fetchCustomizations();
  }, []);

  const fetchCustomizations = () => {
    axios
      .get("https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/customizations") // Adjust API endpoint
      .then((response) => {
        setCustomizations(response.data);
      })
      .catch((error) => {
        setAlertMessage("Error fetching Customizations: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const fetchProducts = () => {
    axios
      .get("https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/products") // Adjust API endpoint
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        setAlertMessage("Error fetching Products: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  return (
    <div>
      {showSuccessAlert && (
        <ToastAlert
          message={alertMessage}
          onClose={() => setShowSuccessAlert(false)}
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
      <h2>Current Products</h2>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search Products..."
          value={searchQuery}
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="main-container">
        <button
          className="professional-button"
          onClick={() => onSelectPage("newProduct")}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} /> New
          Product
        </button>
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "16.7%" }} />
            <col style={{ width: "16.7%" }} />
            <col style={{ width: "16.7%" }} />
            <col style={{ width: "16.7%" }} />
            <col style={{ width: "16.7%" }} />
            <col style={{ width: "16.7%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Description</th>
              <th>Customizations</th>
              <th>Instock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", padding: "5px" }}
                  />
                  {product.name}
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.description}</td>
                <td>
                  {product.customizations.length > 0
                    ? product.customizations.map((customizationsId, index) => {
                        const matchedCustomizations = customizations.find(
                          (customizations) =>
                            customizations.id === customizationsId
                        );
                        return matchedCustomizations ? (
                          <span key={matchedCustomizations.id}>
                            {index > 0 ? ", " : ""}
                            {matchedCustomizations.name}
                          </span>
                        ) : null;
                      })
                    : "None"}
                </td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`switch-${product.id}`}
                    label={product.isInStock ? "In Stock" : "Out of Stock"}
                    checked={product.isInStock}
                    onChange={() =>
                      handleProductStatusChange(product.id, !product.isInStock)
                    }
                  />
                </td>
                <td>
                  <Button
                    className="action-button edit-button me-2"
                    variant="primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="icon" /> Edit
                  </Button>
                  <Button
                    className="action-button delete-button me-2"
                    variant="danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="icon" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemFormPage;
