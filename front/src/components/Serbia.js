import { useEffect, useState } from "react";
import DataProvider from "../services/DataProvider";

const SerbiaData = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let data = DataProvider.getSerbiaData();
    console.log(data);
  }, []);
  return (
    <div>
      <h4>Serbia Graph here</h4>
    </div>
  );
};

export default SerbiaData;
