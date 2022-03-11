import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useState } from "react";
import provideData from "../services/DataProvider";
import subjects from "../services/InputEmmiter";

const buttons = [
  { value: "Female", key: "FMLE", active: true },
  { value: "Median", key: "BTSX", active: true },
  { value: "Male", key: "MLE", active: true },
  { value: "Compare", key: "CMP", active: false },
];

const formatRangeValues = (data) => {
  const valuesArray = data.map(({ TimeDimensionValue }) => TimeDimensionValue);
  const rangeMinMaxValues = [
    Math.min(...valuesArray),
    Math.max(...valuesArray),
  ];
  subjects.rangeMinMaxValues.next(rangeMinMaxValues);
  return rangeMinMaxValues;
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

const getChartOptions = (buttons, data) => {
  let options;
  if (buttons[buttons.length - 1].active) {
    options = comparisonChartOptions(data);
  } else options = lineChartOptions(buttons, data);
  return options;
};

const lineChartOptions = (buttons, data) => {
  const series = [];
  let options = {};
  buttons.forEach((btn) => {
    if (btn.active) {
      series.push({
        name: btn.value,
        data: dataFilter(btn.key, data),
        color: `hsl(${buttons.indexOf(btn) * 120}, 100%, 50%)`,
        marker: {
          symbol: "circle",
        },
      });
    }
  });

  options = {
    chart: { type: "line", animation: false, marginRight: 50 },
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
    plotOptions: {
      series: {
        animation: false,
        stacking: undefined,
        events: {
          legendItemClick: function () {
            return false;
          },
        },
      },
    },

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
      animation: true,
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
        animation: false,
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
    let filteredData = data?.filter(
      (obj) =>
        obj.TimeDimensionValue >= rangeValues[0] &&
        obj.TimeDimensionValue <= rangeValues[1]
    );

    if (button.key !== "CMP") {
      let i = buttons.indexOf(button);
      buttons[i].active = !buttons[i].active;
      buttons[buttons.length - 1].active = false;

      options = lineChartOptions(buttons, filteredData);
      setChartOptions(options);
    } else {
      if (button.active) {
        buttons.forEach((btn) => {
          if (buttons.indexOf(btn) !== buttons.length - 1) {
            btn.active = true;
          } else {
            btn.active = false;
          }
        });

        options = lineChartOptions(buttons, filteredData);
        setChartOptions(options);
      } else {
        buttons.forEach((btn) => {
          if (buttons.indexOf(btn) !== buttons.length - 1) {
            btn.active = false;
          } else {
            btn.active = true;
          }
        });

        options = comparisonChartOptions(filteredData);
        setChartOptions(options);
      }
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await provideData(param);
      setData(data);
      const subscription = subjects.rangeEmmiter.subscribe((values) => {
        let options;
        if (values.length > 0) {
          setRangeValues(values);
          let filteredData = data?.filter(
            (obj) =>
              obj.TimeDimensionValue >= values[0] &&
              obj.TimeDimensionValue <= values[1]
          );

          options = getChartOptions(buttons, filteredData);
          setChartOptions(options);
        } else {
          let initialRangeValues = formatRangeValues(data);

          setRangeValues(initialRangeValues);
          setChartOptions(getChartOptions(buttons, data));
        }
      });

      return () => subscription.unsubscribe();
    };

    getData();
  }, [param]);

  return (
    <div className="graph-container">
      <h2 className="graph-header">{param.toUpperCase()} GRAPH</h2>
      <div className="buttons">
        {buttons.map((b) => {
          return (
            <button
              onClick={() => {
                optionSetter(b);
              }}
              key={b.key}
              className={b.active ? "button-active" : ""}
            >
              {b.value}
            </button>
          );
        })}
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default DataVisulization;
