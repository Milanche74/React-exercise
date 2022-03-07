const getSerbiaData = async () => {
  const response = await fetch(`http://localhost:7000/data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const dataObj = await response.json();
  const data = await dataObj.value;
  console.log(data);
  return data;
};

export default {
  getSerbiaData,
};
