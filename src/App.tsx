import ProductMainPage from "./components/ProductMainPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import RestPasswordPage from "./components/ResetPasswordPage";
import RequestResetPasswordPage from "./components/RequestResetPasswordPage";
import AboutUs from "./components/AboutUs";

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
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<RequestResetPasswordPage />} />
              <Route path="/reset-password" element={<RestPasswordPage />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/kitchedorderpage" element={<KitchenOrderPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/" element={<AboutUs />} />
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
