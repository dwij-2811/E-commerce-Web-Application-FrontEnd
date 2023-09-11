import Modal from 'react-bootstrap/Modal';
import CustomizationForm from './CustomizationForm';
import { Customizations } from "./Types";
import { useEffect, useState } from "react";

interface CustomizationPopup {
  isOpen: boolean;
  onClose: () => void;
  customization: Customizations | null;
  onSubmit: (id: Customizations["id"], newItem: Customizations) => void;
}

const CustomizationPopup: React.FC<CustomizationPopup> = ({ isOpen, onClose, onSubmit, customization }) => {
  const [header, setHeader] = useState("");

  useEffect(() => {
    if (customization) {
      setHeader("Edit Customization");
    } else {
      setHeader("New Customization");
    }
  }, [customization]);

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body-style'>
        <CustomizationForm onSubmit={onSubmit} customization={customization}/>
      </Modal.Body>
    </Modal>
  );
};

export default CustomizationPopup;