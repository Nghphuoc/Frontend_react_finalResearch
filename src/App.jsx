import { useState } from 'react'
import LandingPage from './Home.jsx/HomePage'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navtest from './Home.jsx/Nav';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/Home" element={<LandingPage />}></Route>
          <Route path="/" element={<Navtest />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
