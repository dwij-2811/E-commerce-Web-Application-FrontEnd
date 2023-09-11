import { useState } from "react";
import { Item, AddOn, Customizations, Categories } from "./Types";
import axios from "axios";
import ProductForm from "./ProductForm";
import "./ProductCard.css";
import { useQuery } from "@tanstack/react-query";

function ProductCard() {
  // const [items, setItems] = useState<Item[]>([]);
  const [popUpItems, setPopUpItems] = useState<Item>();

  // const [customizations, setCustomizations] = useState<Customizations[]>([]);
  // const [categories, setCategories] = useState<Categories[]>([]);

  // const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const handleOpenNewItemModal = (item: Item) => {
    setPopUpItems(item);
    setShowNewItemModal(true);
  };

  const handleCloseNewItemModal = () => {
    setShowNewItemModal(false);
  };

  const fetchCategories = () =>
    axios
      .get<Categories[]>(
        "https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/categories"
      )
      .then((res) => res.data);

  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesIsLoading,
  } = useQuery<Categories[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (categoriesError) return <p>{categoriesError.message}</p>;
  const categories = categoriesData;

  const fetchProducts = () =>
    axios
      .get<Item[]>(
        "https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/products"
      )
      .then((res) => res.data);

  const {
    data: productsData,
    error: productsError,
    isLoading: productsIsLoading,
  } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: fetchProducts,
  });

  if (productsError) return <p>{productsError.message}</p>;
  const items = productsData;

  const fetchAddOns = () =>
    axios
      .get<AddOn[]>(
        "https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/addons"
      )
      .then((res) => res.data);

  const {
    data: addOnsData,
    error: addOnsError,
    isLoading: addOnsIsLoading,
  } = useQuery<AddOn[], Error>({
    queryKey: ["addons"],
    queryFn: fetchAddOns,
  });

  if (addOnsError) return <p>{addOnsError.message}</p>;
  const addOns = addOnsData;

  const fetchCustomizations = () =>
    axios
      .get<Customizations[]>(
        "https://czvjcvb9y3.execute-api.us-west-2.amazonaws.com/Prod/customizations"
      )
      .then((res) => res.data);

  const {
    data: customizationsData,
    error: customizationsError,
    isLoading: customizationsIsLoading,
  } = useQuery<Customizations[], Error>({
    queryKey: ["customizations"],
    queryFn: fetchCustomizations,
  });

  if (customizationsError) return <p>{customizationsError.message}</p>;
  if (customizationsIsLoading || addOnsIsLoading || productsIsLoading || categoriesIsLoading)
    return (
      <>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    );
  const customizations = customizationsData;

  return (
    <>
      <h1>Menu</h1>

      {popUpItems && (
        <ProductForm
          isOpen={showNewItemModal}
          onClose={handleCloseNewItemModal}
          product={popUpItems}
          customizations={customizations}
          addOns={addOns}
        />
      )}

      <div className="row">
        <div className="col-2">
          <nav
            id="navbar-example3"
            className="h-100 flex-column align-items-stretch pe-4 border-end"
          >
            <nav className="nav nav-pills flex-column">
              {categories.map((category) => (
                <a
                  className="nav-link"
                  href={"#" + category.id.toString()}
                  key={category.id}
                >
                  {category.name}
                </a>
              ))}
            </nav>
          </nav>
        </div>

        <div className="col-8">
          <div
            data-bs-spy="scroll"
            data-bs-target="#navbar-example3"
            data-bs-smooth-scroll="true"
            className="scrollspy-example-2"
          >
            {categories.map((category) => (
              <div
                className="main-container"
                key={category.id}
                id={category.id.toString()}
              >
                <h2 className="category-name">{category.name}</h2>
                {items
                  .filter((product) => category.products.includes(product.id))
                  .filter((product) => product.isInStock)
                  .map((product) => (
                    <button
                      className="product-button"
                      onClick={() => handleOpenNewItemModal(product)}
                      key={product.id}
                    >
                      <div className="product-card">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                        />
                        <p className="product-name">{product.name}</p>
                        <p className="product-description">
                          {product.description}
                        </p>
                        <p className="product-price">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
