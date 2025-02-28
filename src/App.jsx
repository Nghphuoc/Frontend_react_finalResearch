import LandingPage from "./Home/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadImage from "./Product/AddProduct";
import ProductDetail from "./Product/ProductDetail";
import UserDetails from "./Customer/User";
import LoginPage from "./Auth/LoginPage";
import RegisterPage from "./Auth/RegisterPage";
import AuthForm from "./Auth/RegisterPage";
import SignUpLogInForm from "./Auth/RegisterPage";
import Cart from "./Cart/Cart";
import CheckOrderPage from "./AdminPage/CheckOrderPage";
import ProductGallery from "./Product/newDetail";
import ProductPage from "./Product/newDetail";

import OrderSummary from "./Order/orderSummary";
import PrivateRoute from "./CheckUserRequest/PrivateRouter";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/home" element={<SignUpLogInForm />}></Route>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/uploadimg" element={<UploadImage />}></Route>
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
          <Route path="/admin/orderPage" element={<CheckOrderPage />}></Route>
          <Route path="/detail" element={<ProductPage />}></Route>
          <Route path="/order" element={<OrderSummary />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
