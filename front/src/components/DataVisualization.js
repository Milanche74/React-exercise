import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import DataProvider from "../services/DataProvider";
import InputEmmiter from "../services/InputEmmiter";

const buttons = [
  { value: "Female", key: "FMLE" },
  { value: "Male", key: "MLE" },
  { value: "Both Genders", key: "BTSX" },
  { value: "Compare", key: "CMP" },
];

const formatRangeValues = (data) => {
  const valuesArray = data.map(({ TimeDimensionValue }) =>
    parseInt(TimeDimensionValue)
  );
  InputEmmiter.rangeMinMaxValues.next([
    Math.min(...valuesArray),
    Math.max(...valuesArray),
  ]);
};

const dataFilter = (key, data) => {
  let series;

  series = data
    ?.filter(({ Dim1 }) => Dim1 === key)
    .map(({ TimeDimensionValue, NumericValue }) => [
      parseInt(TimeDimensionValue),
      NumericValue,
    ])
    .sort((a, b) => {
      return a[0] - b[0];
    });

  return series;
};

const getMinYAxisValue = (data) => {
  let extractedValues = [];
  data.forEach((arr) => {
    extractedValues.push(arr[1]);
  });

  return Math.ceil(Math.min(...extractedValues));
};

const singleDataChartOptions = (gender, data) => {
  let options = {
    title: { text: "Blood Pressure index for population" },
  };
  const series = dataFilter(gender.key, data);
  options = {
    ...options,
    yAxis: {
      min: null,
      max: null,
    },
    xAxis: {
      reversed: false,
      labels: {
        step: 1,
      },
      accessibility: {
        description: `Blood pressure index ${gender.value}`,
      },
    },
    chart: { type: "line" },
    series: { name: gender.value, data: series },
  };
  return options;
};

const comparisonChartOptions = (data) => {
  let options = {
    title: { text: "Blood Pressure index comparison by gender" },
  };
  const femaleSeries = dataFilter("FMLE", data);
  const maleSeries = dataFilter("MLE", data);
  maleSeries.forEach((s) => {
    s[1] = s[1] * -1;
  });

  const yAxisMinValue = getMinYAxisValue(maleSeries);
  const yAxisMaxValue = yAxisMinValue * -1;

  options = {
    ...options,
    chart: {
      type: "bar",
    },
    accessibility: {
      point: {
        valueDescriptionFormat: "{index}. Age {xDescription}, {value}%.",
      },
    },
    xAxis: [
      {
        reversed: false,
        labels: {
          step: 1,
        },
        accessibility: {
          description: "Blood pressure index (female)",
        },
      },
      {
        // mirror axis on right side
        opposite: true,
        reversed: false,
        linkedTo: 0,
        labels: {
          step: 1,
        },
        accessibility: {
          description: "Blood pressure index (male)",
        },
      },
    ],
    yAxis: {
      title: {
        text: null,
      },
      min: yAxisMinValue,
      max: yAxisMaxValue,
      labels: {
        formatter: function () {
          return Math.abs(this.value);
        },
      },
      accessibility: {
        description: "Blood pressure index, comparison by gender in Serbia",
      },
    },
    plotOptions: {
      series: {
        stacking: "normal",
        pointWidth: 5,
      },
    },
    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          this.series.name +
          ", year " +
          this.point.category +
          "</b><br/>" +
          "BP index: " +
          Highcharts.numberFormat(Math.abs(this.point.y), 1)
        );
      },
    },
    series: [
      {
        name: "Male",
        data: maleSeries,
      },
      {
        name: "Female",
        data: femaleSeries,
      },
    ],
  };
  return options;
};

const DataVisulization = ({ param }) => {
  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  const optionSetter = (button) => {
    if (button.key !== "CMP") {
      const options = singleDataChartOptions(button, data);
      setChartOptions(options);
    } else {
      const options = comparisonChartOptions(data);
      setChartOptions(options);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await DataProvider.getData(param);
      setData(data);
      // set chart options for initial render
      const options = singleDataChartOptions(buttons[0], data);
      setChartOptions(options);
      formatRangeValues(data);
    };
    getData();
  }, [param]);

  useEffect(() => {
    let filteredData;
    const subscription = InputEmmiter.rangeEmmiter.subscribe((values) => {
      filteredData = data.filter(
        ({ TimeDimensionValue }) =>
          parseInt(TimeDimensionValue) > values[0] ||
          parseInt(TimeDimensionValue) < values[1]
      );
      console.log(filteredData);
    });
    setData(filteredData);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h2>{param.toUpperCase()} Graph</h2>
      {buttons.map((b) => {
        return (
          <button
            onClick={() => {
              optionSetter(b);
            }}
            key={b.key}
          >
            {b.value}
          </button>
        );
      })}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DataVisulization;
