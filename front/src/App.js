import { BrowserRouter, Route, Routes } from "react-router-dom";

import DataVisulization from "./components/DataVisualization";
import Nav from "./components/Nav";
import RangeSelector from "./components/RangeSelector";

const App = () => {
  return (
    <BrowserRouter>
      <h1>Blood Pressure Study</h1>
      <Nav></Nav>
      <RangeSelector></RangeSelector>
      <Routes>
        <Route path="/" element={<DataVisulization param={"serbia"} />}></Route>
        <Route path="/uk" element={<DataVisulization param={"uk"} />}></Route>
        <Route
          path="/hungary"
          element={<DataVisulization param={"hungary"} />}
        ></Route>
      </Routes>
      <footer>Milanche_74</footer>
    </BrowserRouter>
  );
};
export default App;
