const getSerbiaData = async () => {
  const response = await fetch(
    `https://ghoapi.azureedge.net/api/BP_04?$filter=SpatialDim%20eq%20%27SRB%27`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const dataObj = await response.json();
  const data = dataObj?.value;
  return data;
};

export default {
  getSerbiaData,
};
