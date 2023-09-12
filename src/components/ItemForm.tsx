// ItemForm.tsx
import React, { useState, useEffect } from "react";
import { Item, Customizations } from "./Types"; // Import the updated Item and AddOn interfaces
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface ItemFormProps {
  onSubmit: (item: Item) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null); // State to store the selected image file
  const [spiciness, setSpiciness] = useState(1);

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedAddOnsId, setSelectedAddOnsId] = useState<number[]>([]);

  const [customizations, setCustomizations] = useState<Customizations[]>([]);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Perform your form submission or other actions here
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = () => {
    axios
      .get("https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/customizations") // Adjust API endpoint
      .then((response) => {
        setCustomizations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching addons:", error);
      });
  };

  const handleAddOnsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedAddOns(selectedOptions);
    setSelectedAddOns(selectedOptions);
    const selectedOptionsnumbers = selectedOptions.map((string) =>
      parseInt(string, 10)
    );
    setSelectedAddOnsId(selectedOptionsnumbers);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let imageUrl = ""; // Initialize imageUrl variable

    if (!name) {
      console.error("Please provide a name");
      return;
    }
    if (!price) {
      console.error("Please provide a price");
      return;
    }

    // Upload the image if an image file is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      try {
        const response = await axios.post(
          "https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        imageUrl = response.data.path; // Update imageUrl with the uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    // Create the new item object
    const newItem: Item = {
      id: generateItemId(), // You can generate a unique ID for the item
      name,
      price: parseFloat(price),
      quantity,
      description,
      image: imageUrl,
      customizations: selectedAddOnsId,
      spiciness,
      isInStock: true,
    };

    // Call the onSubmit prop to submit the item to the parent component
    onSubmit(newItem);

    // Clear the form fields after submission
    setName("");
    setPrice("");
    setQuantity(0);
    setDescription("");
    setImageFile(null);
    setSelectedAddOns([]);
    setSpiciness(1);
    setImageFile(null);
  };

  const generateItemId = () => {
    // Replace this with your own method to generate a unique item ID
    return Math.floor(Math.random() * 1000);
  };

  return (
    <div>
      <h2>New Product:</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            className="form-control"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL:</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="addOns" className="form-label">
            Select Customization:
          </label>
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            id="customizations"
            multiple
            value={selectedAddOns}
            onChange={handleAddOnsChange}
          >
            {customizations.map((customization) => (
              <option key={customization.id} value={customization.id}>
                {customization.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          onClick={handleClick}
          className={`submit-button ${isClicked ? "clicked" : ""}`}
        >
          <span className="button-icon">
            <FontAwesomeIcon icon={faCheck} />
          </span>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
