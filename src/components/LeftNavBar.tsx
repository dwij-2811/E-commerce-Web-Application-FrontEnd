import './LeftNavBar.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBoxOpen,
  faPaintBrush,
  faPuzzlePiece,
  faListAlt
} from "@fortawesome/free-solid-svg-icons";
import './components.css';

interface LeftNavBarProps {
  onSelectPage: (any: string) => void;
}

const LeftNavBar: React.FC<LeftNavBarProps> = ({ onSelectPage }) => {
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-3 px-0 bg-dark left-nav-bar" id="sidebar">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white vh-100">
        <div className="nav-button" onClick={() => onSelectPage("orders")}>
          <FontAwesomeIcon icon={faShoppingCart} className="icon" />
           Orders
        </div>
        <div className="nav-button" onClick={() => onSelectPage("categories")}>
        <FontAwesomeIcon icon={faListAlt} className="icon" />
           Categories
        </div>
        <div className="nav-button" onClick={() => onSelectPage("products")}>
        <FontAwesomeIcon icon={faBoxOpen} className="icon" />
           Products
        </div>
        <div className="nav-button" onClick={() => onSelectPage("addCustomizations")}>
        <FontAwesomeIcon icon={faPaintBrush} className="icon" />
           Customizations
        </div>
        <div className="nav-button" onClick={() => onSelectPage("addAddons")}>
        <FontAwesomeIcon icon={faPuzzlePiece} className="icon" />
           Addons
        </div>
      </div>
    </div>
  );
};

export default LeftNavBar;
