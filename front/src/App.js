import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import DataVisulization from "./components/DataVisualization";
import Nav from "./components/Nav";
import RangeSelector from "./components/RangeSelector";

const App = () => {
  return (
    <BrowserRouter>
      <h1 className="header">Blood Pressure Study</h1>
      <Nav></Nav>
      <RangeSelector></RangeSelector>
      <Routes>
        {/*There was no requirement for setting up a dashboard element so home route will redirect user to "/serbia"*/}
        <Route path="/" element={<Navigate to="/serbia"></Navigate>}></Route>
        <Route
          path="/serbia"
          element={<DataVisulization param={"serbia"} />}
        ></Route>
        <Route path="/uk" element={<DataVisulization param={"uk"} />}></Route>
        <Route
          path="/hungary"
          element={<DataVisulization param={"hungary"} />}
        ></Route>
      </Routes>
      <footer className="footer">Milanche_74</footer>
    </BrowserRouter>
  );
};
export default App;
