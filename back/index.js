const PORT = 7000;
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.json("working...");
});

app.get("/data", (req, res) => {
  const options = {
    method: "GET",
    url: `https://ghoapi.azureedge.net/api/BP_04?$filter=SpatialDim%20eq%20%27SRB%27`,
  };
  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(7000, () => console.log("server running"));
