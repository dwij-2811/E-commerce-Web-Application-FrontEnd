// ItemFormPage.tsx
import React, { useState, useEffect } from "react";
// Import the ItemForm component
import axios from "axios";
import { Customizations, AddOn } from "./Types";
import Button from "react-bootstrap/Button";
import CustomizationPopup from "./CustomizationPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ToastAlert from "./Alert";

const CustomizationFormPage: React.FC = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [products, setProducts] = useState<Customizations[]>([]); // Add this state
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [editCustomizations, setEditCustomizations] = useState<Customizations | null>(null);

  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomization = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleOpenNewItemModal = () => {
    setShowNewItemModal(true);
  };

  const handleCloseNewItemModal = () => {
    setShowNewItemModal(false);
    fetchProducts();
  };

  const handleEditProduct = (customization: Customizations) => {
    setEditCustomizations(customization);
    handleOpenNewItemModal();
  };

  const handleEditSubmit = (
    customizationsId: Customizations["id"],
    editCustomizations: Customizations
  ) => {
    axios
      .put(`/customizations/${customizationsId}`, editCustomizations)
      .then(() => {
        fetchAddons();
        handleCloseNewItemModal();
        setAlertMessage("Customization Edit Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Editing Customization: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleDeleteProduct = (productId: Customizations["id"]) => {
    axios
      .delete(`/customizations/${productId}`)
      .then(() => {
        fetchProducts();
        setAlertMessage("Customization Delete Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Deleting Customization: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  // const handleProductStatusChange = (
  //   productId: Customizations["id"],
  //   newStatus: boolean
  // ) => {
  //   // Update the product status on the server
  //   axios
  //     .put(`/customizations/instock/${productId}`, {
  //       isInStock: newStatus,
  //     })
  //     .then(() => {
  //       // Update the local state with the updated product
  //       setProducts((prevProducts) =>
  //         prevProducts.map((product) =>
  //           product.id === productId
  //             ? { ...product, isInStock: newStatus }
  //             : product
  //         )
  //       );
  //       setAlertMessage("Customization Status Change Success!");
  //       setShowSuccessAlert(true);

  //       setTimeout(() => {
  //         setShowSuccessAlert(false);
  //       }, 5000);
  //     })
  //     .catch((error) => {
  //       setAlertMessage("Error updating Customization status: " + error.message);
  //       setShowErrorAlert(true);

  //       setTimeout(() => {
  //         setShowErrorAlert(false);
  //       }, 5000);
  //     });
  // };

  const handleAddNewItem = (_Id:Customizations["id"], newItem: Customizations) => {
    console.log(newItem);
    axios
      .post("/customizations", newItem, {headers: {"Content-Type": "application/json"}})
      .then(() => {
        fetchProducts();
        handleCloseNewItemModal();
        setAlertMessage("New Customization Added!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error adding Customization: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
    fetchAddons();
  }, []);

  const fetchAddons = () => {
    axios
      .get("/addons") // Adjust API endpoint
      .then((response) => {
        setAddons(response.data);
      })
      .catch((error) => {
        setAlertMessage("Error fetching AddOns: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const fetchProducts = () => {
    axios
      .get("/customizations") // Adjust API endpoint
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        setAlertMessage("Error fetching Customizations: " + error.message);
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
      <h2>Current Customization</h2>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search Customization..."
          value={searchQuery}
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={{ paddingBottom: "10px" }}></div>
      <button className="professional-button" onClick={handleOpenNewItemModal}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} /> New
        Customization
      </button>
      <div className="main-container">
        <div style={{ paddingTop: "50px" }}>
          {filteredCustomization.map((product) => (
            <div className="common-container">
              <div className="d-flex align-items-center justify-content-between">
                <h4>{product.name}</h4>
                <label>Minimum selection required: {product.minimum}</label>
                <label>Maximum selection required: {product.maximum}</label>
                <label>Multiple selection allowed: {product.multiple}</label>
                <label>Selection Required: {String(product.required)}</label>
                <div>
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
                </div>
              </div>
              <table className="table table-striped">
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.addOns.length > 0
                    ? product.addOns.map((addOnId) => {
                        const matchedAddon = addons.find(
                          (addon) => addon.id === addOnId
                        );
                        return matchedAddon ? (
                          <tr key={matchedAddon.id}>
                            <td>{matchedAddon.name}</td>
                            <td>${matchedAddon.price.toFixed(2)}</td>
                          </tr>
                        ) : null;
                      })
                    : "None"}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <CustomizationPopup
        isOpen={showNewItemModal}
        onClose={handleCloseNewItemModal}
        onSubmit={editCustomizations ? handleEditSubmit : handleAddNewItem}
        customization={editCustomizations}
      />
      
    </div>
  );
};

export default CustomizationFormPage;
