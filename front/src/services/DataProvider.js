const provideData = async (param) => {
  const response = await fetch(`http://localhost:7000/data-${param}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataObj = await response.json();
  const data = await dataObj.value.map(
    ({ NumericValue, Dim1, TimeDimensionValue }) => ({
      Dim1,
      NumericValue,
      TimeDimensionValue: parseInt(TimeDimensionValue),
    })
  );

  return data;
};

export default provideData;
