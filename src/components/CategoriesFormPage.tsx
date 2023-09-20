// ItemFormPage.tsx
import React, { useState, useEffect } from "react";
// Import the ItemForm component
import axios from "axios";
import { Categories, Item } from "./Types";
import Button from "react-bootstrap/Button";
import CategoriesPopup from "./CategoriesPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ToastAlert from "./Alert";

const CategoriesFormPage: React.FC = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categories, setCategories] = useState<Categories[]>([]); // Add this state
  const [products, setProducts] = useState<Item[]>([]);
  const [editCategory, setEditCategory] = useState<Categories | null>(null);

  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const handleOpenNewItemModal = () => {
    setShowNewItemModal(true);
  };

  const handleCloseNewItemModal = () => {
    setShowNewItemModal(false);
    setEditCategory(null);
    fetchCategories();
  };

  const handleEditProduct = (category: Categories) => {
    setEditCategory(category);
    handleOpenNewItemModal();
  };

  const handleEditSubmit = (
    categoryId: Categories["id"],
    editItem: Categories
  ) => {
    axios
      .put(`/categories/${categoryId}`, editItem)
      .then(() => {
        fetchCategories();
        handleCloseNewItemModal();
        setAlertMessage("Category Edit Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Editing Category: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleDeleteProduct = (categoryId: Categories["id"]) => {
    axios
      .delete(`/categories/${categoryId}`)
      .then(() => {
        fetchCategories();
        setAlertMessage("Category Delete Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Deleting Category: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleAddNewItem = (
    _categoryId: Categories["id"],
    newItem: Categories
  ) => {
    axios
      .post("/categories", newItem)
      .then(() => {
        fetchCategories();
        handleCloseNewItemModal();
        setAlertMessage("New Category Added!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error adding Category: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories on component mount
    fetchProducts();
  }, []);

  const fetchCategories = () => {
    axios
      .get("/categories") // Adjust API endpoint
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        setAlertMessage("Error fetching Category: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const fetchProducts = () => {
    axios
      .get("/products") // Adjust API endpoint
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
      <h2>Current Categories</h2>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search Categories..."
          value={searchQuery}
          className="search-input"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={{ paddingBottom: "10px" }}></div>
      <button className="professional-button" onClick={handleOpenNewItemModal}>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} /> New
        Categories
      </button>
      <div className="main-container">
        <div style={{ paddingTop: "50px" }}>
          {filteredCategories.map((category) => (
            <div className="common-container">
              <div className="d-flex align-items-center justify-content-between">
                <h4>{category.name}</h4>
                <div>
                  <Button
                    className="action-button edit-button me-2"
                    variant="primary"
                    onClick={() => handleEditProduct(category)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="icon" /> Edit
                  </Button>
                  <Button
                    className="action-button delete-button me-2"
                    variant="danger"
                    onClick={() => handleDeleteProduct(category.id)}
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
                  {category.products.length > 0
                    ? category.products.map((product) => {
                        const matchedAddon = products.find((item) => item.id === product);
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

      <CategoriesPopup
        isOpen={showNewItemModal}
        onClose={handleCloseNewItemModal}
        onSubmit={editCategory ? handleEditSubmit : handleAddNewItem}
        category={editCategory}
      />
    </div>
  );
};

export default CategoriesFormPage;
