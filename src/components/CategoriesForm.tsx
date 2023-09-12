// AddOnForm.tsx
import React, { useState, useEffect } from "react";
import { Item, Categories } from "./Types"; // Import the updated AddOn interface
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface CategoriesFormProps {
  onSubmit: (categoryId: Categories["id"], categories: Categories) => void;
  category: Categories | null;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  onSubmit,
  category,
}) => {
  const [name, setName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedProductsId, setSelectedProductsId] = useState<number[]>([]);
  const [products, setProducts] = useState<Item[]>([]);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedProducts(
        category.products.map((product) => product.toString())
      );
      setSelectedProductsId(category.products);
    }
  }, [category]);

  const handleClick = () => {
    setIsClicked(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("https://ijitkkifyi.execute-api.us-west-2.amazonaws.com/production/products") // Adjust API endpoint
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create the new add-on object
    const newCategoriess: Categories = {
      id: generateCategoriessId(),
      name,
      products: selectedProductsId,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(newCategoriess.id, newCategoriess);

    // Clear the form fields after submission
    setName("");
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = category?.id ?? 1;

    // Create the new add-on object
    const newCategoriess: Categories = {
      id: id,
      name,
      products: selectedProductsId,
    };

    // Call the onSubmit prop to submit the add-on to the parent component
    onSubmit(id, newCategoriess);

    // Clear the form fields after submission
    setName("");
  };

  const handleProductsChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setSelectedProducts(selectedOptions);
    const selectedOptionsnumbers = selectedOptions.map((string) =>
      parseInt(string, 10)
    );
    setSelectedProductsId(selectedOptionsnumbers);
  };

  const generateCategoriessId = () => {
    // Replace this with your own method to generate a unique add-on ID
    return Math.floor(Math.random() * 1000);
  };

  return (
    <div className="container-Fuild" style={{ border: 5, width: "500px" }}>
      <form onSubmit={category ? handleEdit : handleSubmit}>
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
            Select Products<span style={{ color: "red" }}>*</span>:
          </label>
          <select
            className="form-select form-input"
            id="products"
            multiple
            value={selectedProducts}
            onChange={handleProductsChange}
            required
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
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

export default CategoriesForm;
