import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import DataProvider from "../services/DataProvider";
import InputEmmiter from "../services/InputEmmiter";

const buttons = [
  { value: "Female", key: "FMLE", active: true },
  { value: "Male", key: "MLE", active: true },
  { value: "Median", key: "BTSX", active: true },
  { value: "Compare", key: "CMP", active: false },
];

const formatRangeValues = (data) => {
  const valuesArray = data.map(({ TimeDimensionValue }) => TimeDimensionValue);
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
      TimeDimensionValue,
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

  return Math.floor(Math.min(...extractedValues));
};

const lineChartOptions = (buttons, data) => {
  let series = [];
  let options;
  buttons.forEach((btn) => {
    if (btn.active) {
      series.push({
        name: btn.value,
        data: dataFilter(btn.key, data),
      });
    }
  });

  options = {
    title: { text: "Blood Pressure index for population" },
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
        description: `Blood pressure index for chosen categories`,
      },
    },
    chart: { type: "line" },
    series: series,
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
  const [rangeValues, setRangeValues] = useState([]);

  const optionSetter = (button) => {
    let options;
    let i = buttons.indexOf(button);
    buttons[i].active = !buttons[i].active;
    if (button.key !== "CMP") {
      if (rangeValues.length > 0) {
        let dataFilter1 = data?.filter(
          (obj) => obj.TimeDimensionValue > rangeValues[0]
        );
        const dataFilter2 = dataFilter1?.filter(
          (obj) => obj.TimeDimensionValue < rangeValues[1]
        );

        options = lineChartOptions(buttons, dataFilter2);
      } else {
        lineChartOptions(buttons, data);
      }
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
      formatRangeValues(data);
    };

    getData();
  }, [param]);

  useEffect(() => {
    const subscription = InputEmmiter.rangeEmmiter.subscribe((values) => {
      let options;
      setRangeValues(values);
      if (values.length > 0) {
        let dataFilter1 = data?.filter(
          (obj) => obj.TimeDimensionValue > values[0]
        );
        const dataFilter2 = dataFilter1?.filter(
          (obj) => obj.TimeDimensionValue < values[1]
        );

        // setData(dataRange);
        options = lineChartOptions(buttons, dataFilter2);
      } else {
        options = lineChartOptions(buttons, data);
      }
      setChartOptions(options);
    });
    return () => subscription.unsubscribe();
  }, [data]);

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
