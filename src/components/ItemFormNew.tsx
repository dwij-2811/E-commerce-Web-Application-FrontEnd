import ItemForm from './ItemForm';
import axios from "axios";
import { Item } from "./Types";

const ItemFormNew = () => {

    const handleAddNewItem = (newItem: Item) => {
        axios
          .post("/products", newItem) // Send the new add-on data to the backend
          .then(() => {
          })
          .catch((error) => {
            console.error("Error adding add-on:", error);
          });
      };
      
    return (
        <ItemForm onSubmit={handleAddNewItem} />
    );
};

export default ItemFormNew;