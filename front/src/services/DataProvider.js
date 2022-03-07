const getSerbiaData = async () => {
  const response = await fetch(`http://localhost:7000/data-serbia`, {
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
      TimeDimensionValue,
    })
  );

  return data;
};

export default {
  getSerbiaData,
};
