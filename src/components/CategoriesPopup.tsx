import Modal from 'react-bootstrap/Modal';
import CategoriesForm from './CategoriesForm';
import { Categories } from "./Types";
import { useEffect, useState } from "react";

interface CategoriesPopupProp {
  isOpen: boolean;
  onClose: () => void;
  category: Categories | null;
  onSubmit: (categoryId: Categories["id"],
  editItem: Categories) => void;
}

const CategoriesPopup: React.FC<CategoriesPopupProp> = ({ isOpen, onClose, onSubmit, category }) => {
  const [header, setHeader] = useState("");

  useEffect(() => {
    if (category) {
      setHeader("Edit Category");
    } else {
      setHeader("New Category");
    }
  }, [category]);
  
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body-style'>
        <CategoriesForm onSubmit={onSubmit} category={category}/>
      </Modal.Body>
    </Modal>
  );
};

export default CategoriesPopup;