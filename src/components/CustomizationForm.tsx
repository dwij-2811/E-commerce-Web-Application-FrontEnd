// AddOnForm.tsx
import React, { useState, useEffect } from "react";
import { AddOn, Customizations } from "./Types"; // Import the updated AddOn interface
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface CustomizationFormProps {
  onSubmit: (customizationId: Customizations["id"], customization: Customizations) => void;
  customization: Customizations | null;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ onSubmit, customization }) => {
  const [name, setName] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedAddOnsId, setSelectedAddOnsId] = useState<number[]>([]);
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [required, setRequired] = useState(false);
  const [minimum, setMinimum] = useState("0");
  const [maximum, setMaximum] = useState("1");
  const [multiple, setMultiple] = useState("1");
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (customization) {
      setName(customization.name);
      setSelectedAddOns(
        customization.addOns.map((addOn) => addOn.toString())
      );
      setSelectedAddOnsId(customization.addOns);
    }
  }, [customization]);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = () => {
    axios
      .get("https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons") // Adjust API endpoint
      .then((response) => {
        setAddons(response.data);
      })
      .catch((error) => {
        console.error("Error fetching addons:", error);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create the new add-on object
    const newCustomizations: Customizations = {
      id: generateCustomizationsId(), // You can generate a unique ID for the add-on
      name,
      addOns: selectedAddOnsId,
      required,
      minimum: parseInt(minimum),
      maximum: parseInt(maximum),
      multiple: parseInt(multiple),
      isInStock: true,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(newCustomizations.id, newCustomizations);

    // Clear the form fields after submission
    setName("");
    setMinimum("");
    setMaximum("1");
    setMultiple("1");
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = customization?.id ?? 1;

    const newCustomizations: Customizations = {
      id,
      name,
      addOns: selectedAddOnsId,
      required,
      minimum: parseInt(minimum),
      maximum: parseInt(maximum),
      multiple: parseInt(multiple),
      isInStock: true,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(id, newCustomizations);

    // Clear the form fields after submission
    setName("");
  };

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinimum = event.target.value;
    const newMaximum = Math.max(parseInt(maximum), parseInt(newMinimum));
    if (parseInt(newMinimum) > 0) {
      setRequired(true);
    }else{
      setRequired(false);
    }

    setMinimum(newMinimum);
    setMaximum(String(newMaximum));
  };

  const handleAddOnsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedAddOns(selectedOptions);
    const selectedOptionsnumbers = selectedOptions.map((string) =>
      parseInt(string, 10)
    );
    setSelectedAddOnsId(selectedOptionsnumbers);
  };

  const generateCustomizationsId = () => {
    // Replace this with your own method to generate a unique add-on ID
    return Math.floor(Math.random() * 1000);
  };

  return (
    <div className="container-Fuild" style={{ border: 5, width: "500px" }}>
      <form onSubmit={customization ? handleEdit : handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Name<span style={{ color: "red" }}>*</span>:
          </label>
          <input
            className="form-control form-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            Select AddOns<span style={{ color: "red" }}>*</span>:
          </label>
          <select
            className="form-select form-input"
            id="addOns"
            multiple
            value={selectedAddOns}
            onChange={handleAddOnsChange}
            required
          >
            {addons.map((addOn) => (
              <option key={addOn.id} value={addOn.id}>
                {addOn.name} (+${addOn.price.toFixed(2)})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">
            What’s the minimum number of options a customer must select?
          </label>
          <input
            className="form-control form-input"
            type="number"
            value={minimum}
            min={0}
            onChange={handleMinChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            What’s the maximum number of options a customer must select?
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control form-input"
            type="number"
            value={maximum}
            min={1}
            onChange={(e) => setMaximum(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            How many times can customers select any single option?
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            className="form-control form-input"
            type="number"
            value={multiple}
            min={1}
            onChange={(e) => setMultiple(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
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
        </div>
      </form>
    </div>
  );
};

export default CustomizationForm;
