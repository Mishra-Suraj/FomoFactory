const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

(async function mongooseConnect() {
  try {
    await mongoose.connect(
      "mongodb+srv://Suraj:nHxgZ69bd4ndNlBi@cluster0.bzkrbit.mongodb.net/Fomo?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (error) {
    console.log(error);
  }
})();

const coinSchema = new mongoose.Schema({
  data: [
    {
      code: String,
      rate: Number,
      volume: Number,
      cap: Number,
    },
  ],
});

const coinExchangesSchema = new mongoose.Schema({
  data: [
    {
      name: String,
      centralized: Boolean,
      usCompliant: Boolean,
      code: String,
      markets: Number,
      volume: Number,
    },
  ],
});

const CoinExchanges = mongoose.model("Exchanges", coinExchangesSchema);
const Coin = mongoose.model("Coin", coinSchema);

async function CoinExchangesFetching() {
  try {
    let data = await fetch(
      new Request("https://api.livecoinwatch.com/exchanges/list"),
      {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": "da8da3dd-6d4f-431c-9b8c-f89dab347ed9",
        }),
        body: JSON.stringify({
          currency: "USD",
          sort: "visitors",
          order: "descending",
          offset: 0,
          limit: 20,
          meta: true,
        }),
      }
    );
    let jsonData = await data.json();
    mapExchangeJsonToSchema(jsonData);
  } catch (error) {
    console.log({ error: "Error fetching data from API" });
  }
}

function mapExchangeJsonToSchema(jsonData: any) {
  let data = jsonData.map((item: any) => {
    return {
      name: item.name,
      centralized: item.centralized,
      usCompliant: item.usCompliant,
      code: item.code,
      markets: item.markets,
      volume: item.volume,
    };
  });
  const exchange = new CoinExchanges({
    data: data,
  });
  exchange.save();
}

async function coinDataFetching() {
  try {
    let data = await fetch(
      new Request("https://api.livecoinwatch.com/coins/list"),
      {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          "x-api-key": "da8da3dd-6d4f-431c-9b8c-f89dab347ed9",
        }),
        body: JSON.stringify({
          currency: "USD",
          sort: "rank",
          order: "ascending",
          offset: 0,
          limit: 20,
          meta: false,
        }),
      }
    );
    let jsonData = await data.json();
    mapJsonToSchema(jsonData);
  } catch (error) {
    console.log({ error: "Error fetching data from API" });
  }
}

setInterval(coinDataFetching, 5000);
setInterval(CoinExchangesFetching, 5000);

function mapJsonToSchema(jsonData: any) {
  let data = jsonData.map((item: any) => {
    return {
      code: item.code,
      rate: item.rate,
      volume: item.volume,
      cap: item.cap,
    };
  });
  const bitcoin = new Coin({
    data: data,
  });
  bitcoin.save();
}

app.get("/api/data", async (req: any, res: any) => {});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
