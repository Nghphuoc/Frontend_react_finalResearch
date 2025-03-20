import LandingPage from "./Home/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadImage from "./AdminPage/AddProduct";
import ProductDetail from "./Product/ProductDetail";
import UserDetails from "./Customer/User";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import AuthForm from "./Auth/RegisterPage";
import SignUpLogInForm from "./Auth/RegisterPage";
import Cart from "./Cart/Cart";
import CheckOrderPage from "./AdminPage/CheckOrderPage";


import OrderSummary from "./Order/orderSummary";
import PrivateRoute from "./CheckUserRequest/PrivateRouter";
import ForgotPasswordPopup from "./Auth/ForgotPassword";
import OrdersDashboard from "./AdminPage/CheckOrderPage";
import ListProduct from "./AdminPage/ListProduct";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/home" element={<SignUpLogInForm />}></Route>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/admin/uploadimg" element={<UploadImage />}></Route>
          <Route path="/detail/:id" element={<ProductDetail />}></Route>
          <Route
            path="/userDetail"
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/admin/orderPage" element={<OrdersDashboard />}></Route>

          <Route path="/order" element={<OrderSummary />}></Route>
          <Route path="/admin/managementProduct" element={<ListProduct />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
