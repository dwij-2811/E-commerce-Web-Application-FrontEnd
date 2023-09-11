import Modal from "react-bootstrap/Modal";
import AddOnForm from "./AddOnForm";
import { AddOn } from "./Types";
import { useEffect, useState } from "react";

interface AddOnPopup {
  isOpen: boolean;
  onClose: () => void;
  addon: AddOn | null;
  onSubmit: (addOnId: AddOn['id'], addon: AddOn) => void;
}

const AddOnPopup: React.FC<AddOnPopup> = ({
  isOpen,
  onClose,
  onSubmit,
  addon,
}) => {
  const [header, setHeader] = useState("");

  useEffect(() => {
    if (addon) {
      setHeader("Edit AddOn");
    } else {
      setHeader("New AddOn");
    }
  }, [addon]);

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-style">
        <AddOnForm onSubmit={onSubmit} addon={addon} />
      </Modal.Body>
    </Modal>
  );
};

export default AddOnPopup;
