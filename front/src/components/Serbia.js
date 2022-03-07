import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import DataProvider from "../services/DataProvider";

const SerbiaData = () => {
  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const buttons = ["Female", "Male", "Both", "Compare"];
  //TODO reformat to avoid boilerplate
  const dataFilter = (data, gender) => {
    let options = {
      title: { text: "Blood Pressure index for Serbia population" },
    };
    let series;

    switch (gender) {
      case "Both":
        series = data
          .filter(({ Dim1 }) => Dim1 === "BTSX")
          .map(({ TimeDimensionValue, NumericValue }) => [
            parseInt(TimeDimensionValue),
            NumericValue,
          ]);
        options = {
          ...options,
          chart: {
            type: "line",
          },
          series: { name: "Both Genders", data: series },
        };
        break;
      case "Female":
        series = data
          .filter(({ Dim1 }) => Dim1 === "FMLE")
          .map(({ TimeDimensionValue, NumericValue }) => [
            parseInt(TimeDimensionValue),
            NumericValue,
          ]);
        options = {
          ...options,
          chart: {
            type: "line",
          },
          series: { name: "Female Population", data: series },
        };
        break;
      case "Male":
        series = data
          .filter(({ Dim1 }) => Dim1 === "MLE")
          .map(({ TimeDimensionValue, NumericValue }) => [
            parseInt(TimeDimensionValue),
            NumericValue,
          ]);
        options = {
          ...options,
          series: { name: "Male Population", data: series },
        };
        break;
      case "Compare":
        const maleData = data
          .filter(({ Dim1 }) => Dim1 === "MLE")
          .map(({ TimeDimensionValue, NumericValue }) => [
            parseInt(TimeDimensionValue),
            NumericValue,
          ]);
        const femaleData = data
          .filter(({ Dim1 }) => Dim1 === "FMLE")
          .map(({ TimeDimensionValue, NumericValue }) => [
            parseInt(TimeDimensionValue),
            NumericValue,
          ]);

        console.log(maleData);

        options = {
          chart: {
            type: "bar",
          },
          xAxis: [
            {
              // categoties: categories,
              reversed: false,
              labels: {
                step: 1,
              },
            },
            {
              // categories: categories,
              opposite: true,
              // reversed: false,
              linkedTo: 0,
              labels: {
                step: 1,
              },
            },
          ],
          series: [
            {
              name: "Female",
              data: femaleData,
            },
            {
              name: "Male",
              data: maleData,
            },
          ],
          plotOptions: {
            series: {
              stacking: "normal",
            },
          },
        };
        break;
    }
    setChartOptions(options);
  };

  useEffect(() => {
    const getData = async () => {
      const data = await DataProvider.getSerbiaData();
      setData(data);

      dataFilter(data, "Both");
    };
    getData();
  }, []);
  return (
    <div>
      <h2>Serbia Graph here</h2>
      {buttons.map((b, index) => {
        return (
          <button
            onClick={() => {
              dataFilter(data, b);
            }}
            key={index}
          >
            {b}
          </button>
        );
      })}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SerbiaData;
