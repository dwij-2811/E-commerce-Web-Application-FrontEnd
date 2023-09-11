import ProductMainPage from "./components/ProductMainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./components/AdminPage";
import ItemFormNew from "./components/ItemFormNew";
import Checkout from "./components/Checkout";
import OrderSuccessPage from "./components/OrderSuccessPage";
import NavBar from "./components/NavBar";
// import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignUpPage";
import { AuthProvider } from "./components/AuthContext";
import ContactUs from "./components/ContactUs";
import KitchenOrderPage from "./components/KitchenOrderPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <div className="app-container">
        <NavBar />
        <div className="page-content">
          <Router>
            <Routes>
              <Route path="/products" element={<ProductMainPage />} />
              <Route path="/addproducts" element={<ItemFormNew />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/kitchedorderpage" element={<KitchenOrderPage />} />
            </Routes>
          </Router>
        </div>
        {/* <Footer /> */}
      </div>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
