import LandingPage from './Home/LandingPage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UploadImage from './Product/AddProduct';
import ProductDetail from './Product/ProductDetail';
import UserDetails from './Customer/User';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<LandingPage />}></Route>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/uploadimg" element={<UploadImage />}></Route>
          <Route path="/detail/:id" element={<ProductDetail />}></Route>
          <Route path="/userDetail" element={<UserDetails />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
