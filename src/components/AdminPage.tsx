import { useState } from 'react';
import LeftNavBar from './LeftNavBar'; // Create this component
import ProductsPage from './ItemFormPage'; // Create this component
import AddProductsPage from './ItemFormNew'; // Create this component
import AddAddonsPage from './AddOnFormPage'; // Create this component
import OrdersPage from './OrderPage';
import CustomizationFormPage from './CustomizationFormPage';
import CategoriesFormPage from './CategoriesFormPage';

const AdminPage = () => {
  const [currentPage, setCurrentPage] = useState('orders'); // Default page

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsPage onSelectPage={setCurrentPage}/>;
      case 'newProduct':
        return <AddProductsPage />;
      case 'addAddons':
        return <AddAddonsPage />;
      case 'orders':
        return <OrdersPage />;
      case 'addCustomizations':
        return <CustomizationFormPage />;
        case 'categories':
          return <CategoriesFormPage />;
      // Add more cases for other pages
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
        <div className="row flex-nowrap">
                <LeftNavBar onSelectPage={setCurrentPage} />
        <div className="col py-3" id="maincontainer">
                {renderPage()}
        </div>
        </div>
    </div>
  );
};

export default AdminPage;
