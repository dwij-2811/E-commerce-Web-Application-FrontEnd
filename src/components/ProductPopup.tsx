import Modal from "react-bootstrap/Modal";
import ProductForm from "./ProductForm";
import { AddOn, Customizations, Item } from "./Types";

interface ProductPopupProp {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  customizations: Customizations[];
  addOns: AddOn[];
}

const ProductPopup: React.FC<ProductPopupProp> = ({ isOpen, onClose, item, customizations, addOns}) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Body className="modal-body-style">
        <ProductForm isOpen={isOpen} product={item} onClose={onClose} customizations={customizations} addOns={addOns}/>
      </Modal.Body>
    </Modal>
  );
};

export default ProductPopup;