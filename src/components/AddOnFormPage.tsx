// AddOnFormPage.tsx
import React, { useState, useEffect } from "react";
import { AddOn } from "./Types";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AddOnPopup from "./AddOnPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ToastAlert from "./Alert";

const AddOnFormPage: React.FC = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editAddOns, setEditAddOns] = useState<AddOn | null>(null);

  const filteredAddons = searchQuery
    ? addons.filter((addon) =>
        addon.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : addons;

  const handleOpenNewItemModal = () => {
    setShowNewItemModal(true);
  };

  const handleCloseNewItemModal = () => {
    setShowNewItemModal(false);
    setEditAddOns(null);
    fetchAddons();
  };

  const handleEditAddOn = (addon: AddOn) => {
    setEditAddOns(addon);
    handleOpenNewItemModal();
  };

  const handleEditSubmit = (
    addOnId: AddOn["id"],
    editAddOn: AddOn
  ) => {
    axios
      .put(`https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons/${addOnId}`, editAddOn)
      .then(() => {
        fetchAddons();
        handleCloseNewItemModal();
        setAlertMessage("AddOns Edit Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Editing AddOns: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleDeleteAddOn = (addOnId: AddOn["id"]) => {
    axios
      .delete(`https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons/${addOnId}`)
      .then(() => {
        fetchAddons();
        setAlertMessage("AddOns Delete Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error Deleting AddOns: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleAddonStatusChange = (addonId: AddOn["id"], newStatus: boolean) => {
    // Update the addon status on the server
    axios
      .put(`https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons/instock/${addonId}`, {
        isInStock: newStatus,
      })
      .then(() => {
        setAddons((prevAddons) =>
          prevAddons.map((addon) =>
            addon.id === addonId ? { ...addon, isInStock: newStatus } : addon
          )
        );
        setAlertMessage("AddOn Status Change Success!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error updating addon status: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const handleAddNewAddOn = (_addOnId: AddOn["id"],
    newAddOn: AddOn) => {
    axios
      .post("https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons", newAddOn) // Send the new add-on data to the backend
      .then(() => {
        fetchAddons();
        handleCloseNewItemModal();
        setAlertMessage("New AddOns Added!");
        setShowSuccessAlert(true);

        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 5000);
      })
      .catch((error) => {
        setAlertMessage("Error adding AddOns: " + error.message);
        setShowErrorAlert(true);

        setTimeout(() => {
          setShowErrorAlert(false);
        }, 5000);
      });
  };

  const fetchAddons = () => {
    axios
      .get("https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons") // Adjust API endpoint
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

  useEffect(() => {
    fetchAddons();
  }, []);

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
      <h2>Current AddOns</h2>
      <div
        style={{ position: "relative", display: "flex", alignItems: "center" }}
      >
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        />
        <input
          type="text"
          placeholder="Search AddOns..."
          value={searchQuery}
          style={{
            width: "100%",
            padding: "10px 30px 10px 30px",
            fontSize: "16px",
            border: "2px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            transition: "border-color 0.2s",
            position: "relative",
            zIndex: 1,
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="main-container">
        <button
          className="professional-button"
          onClick={handleOpenNewItemModal}
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} /> New
          Addons
        </button>
        <table className="table table-striped">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>AddOns</th>
              <th>Price</th>
              <th>Instock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAddons.map((addon) => (
              <tr key={addon.id}>
                <td>{addon.name}</td>
                <td>${addon.price.toFixed(2)}</td>
                <td>
                  <Form.Check
                    type="switch"
                    id={`switch-${addon.id}`}
                    label={addon.isInStock ? "In Stock" : "Out of Stock"}
                    checked={addon.isInStock}
                    onChange={() =>
                      handleAddonStatusChange(addon.id, !addon.isInStock)
                    }
                  />
                </td>
                <td>
                  <Button
                    className="action-button edit-button me-2"
                    variant="primary"
                    onClick={() => handleEditAddOn(addon)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="icon" /> Edit
                  </Button>
                  <Button
                    className="action-button delete-button me-2"
                    variant="danger"
                    onClick={() => handleDeleteAddOn(addon.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="icon" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddOnPopup
        isOpen={showNewItemModal}
        onClose={handleCloseNewItemModal}
        onSubmit={editAddOns ? handleEditSubmit : handleAddNewAddOn}
        addon={editAddOns}
      />
    </div>
  );
};

export default AddOnFormPage;
