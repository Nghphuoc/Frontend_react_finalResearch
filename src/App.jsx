import LandingPage from './Home/LandingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadImage from './Product/AddProduct';
import ProductDetail from './Product/ProductDetail';
import UserDetails from './Customer/User';
import LoginPage from './Auth/LoginPage';
import RegisterPage from './Auth/RegisterPage';
import AuthForm from './Auth/RegisterPage';
import SignUpLogInForm from './Auth/RegisterPage';
import Cart from './Cart/Cart';

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
          <Route path="/userDetail" element={<UserDetails />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/cart/delete/:id" element={<Cart />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
