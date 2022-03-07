import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UKDataData from "./components/UnitedKingdom";
import HungaryData from "./components/Hungary";
import SerbiaData from "./components/Serbia";
import Nav from "./components/Nav";
import RangeSelector from "./components/RangeSelector";

const App = () => {
  return (
    <BrowserRouter>
      <h1>Blood Pressure Study</h1>
      <Nav></Nav>
      <RangeSelector></RangeSelector>
      <Routes>
        <Route path="/" element={<SerbiaData />}></Route>
        <Route path="/uk" element={<UKDataData />}></Route>
        <Route path="/hungary" element={<HungaryData />}></Route>
      </Routes>
      <footer>Milanche_74</footer>
    </BrowserRouter>
  );
};
export default App;
