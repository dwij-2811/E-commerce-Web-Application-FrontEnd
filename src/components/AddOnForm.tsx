// AddOnForm.tsx
import React, { useState, useEffect } from "react";
import { AddOn } from "./Types"; // Import the updated AddOn interface
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface AddOnFormProps {
  onSubmit: (addOnId: AddOn['id'], addOn: AddOn) => void;
  addon: AddOn | null;
}

const AddOnForm: React.FC<AddOnFormProps> = ({ onSubmit, addon }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (addon) {
      setName(addon.name);
      setPrice(addon.price.toString());
    }
  }, [addon]);

  const handleClick = () => {
    setIsClicked(true);
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = addon?.id ?? 1;

    // Create the new add-on object
    const newAddOn: AddOn = {
      id: id,
      name,
      price: parseFloat(price),
      isInStock: true,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(id, newAddOn);

    // Clear the form fields after submission
    setName("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create the new add-on object
    const newAddOn: AddOn = {
      id: generateAddOnId(), // You can generate a unique ID for the add-on
      name,
      price: parseFloat(price),
      isInStock: true,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(newAddOn.id, newAddOn);

    // Clear the form fields after submission
    setName("");
    setPrice("");
  };

  const generateAddOnId = () => {
    // Replace this with your own method to generate a unique add-on ID
    return Math.floor(Math.random() * 1000);
  };

  return (
    <div className="container-Fuild" style={{ border: 5, width: "500px" }}>
      <form onSubmit={addon ? handleEdit : handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            className="form-control"
            type="text"
            value={name}
            style={{ width: "200px" }}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            className="form-control"
            type="number"
            value={price}
            style={{ width: "200px" }}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button type="submit" onClick={handleClick} className={`submit-button ${isClicked ? "clicked" : ""}`}>
            <span className="button-icon">
              <FontAwesomeIcon icon={faCheck} />
            </span>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOnForm;
