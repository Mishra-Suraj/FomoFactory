"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
(function mongooseConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose.connect("mongodb+srv://Suraj:nHxgZ69bd4ndNlBi@cluster0.bzkrbit.mongodb.net/Fomo?retryWrites=true&w=majority&appName=Cluster0");
        }
        catch (error) {
            console.log(error);
        }
    });
})();
const coinSchema = new mongoose.Schema({
    data: [
        {
            code: String,
            rate: Number,
            volume: Number,
            cap: Number,
            // createdAt: { type: Date, default: Date.now },
        }, // createdAt: { type: Date, default: Date.now },
    ],
    createdAt: { type: Date, default: Date.now },
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
            createdAt: { type: Date, default: Date.now },
        },
    ],
});
const CoinExchanges = mongoose.model("Exchanges", coinExchangesSchema);
const Coin = mongoose.model("Coin", coinSchema);
function CoinExchangesFetching() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield fetch(new Request("https://api.livecoinwatch.com/exchanges/list"), {
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
            });
            let jsonData = yield data.json();
            mapExchangeJsonToSchema(jsonData);
        }
        catch (error) {
            console.log({ error: "Error fetching data from API" });
        }
    });
}
function mapExchangeJsonToSchema(jsonData) {
    let data = jsonData.map((item) => {
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
function coinDataFetching() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield fetch(new Request("https://api.livecoinwatch.com/coins/list"), {
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
            });
            let jsonData = yield data.json();
            mapJsonToSchema(jsonData);
        }
        catch (error) {
            console.log({ error: "Error fetching data from API" });
        }
    });
}
setInterval(coinDataFetching, 5000);
setInterval(CoinExchangesFetching, 5000);
function mapJsonToSchema(jsonData) {
    let data = jsonData.map((item) => {
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
app.get("/api/data/coins", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield Coin.findOne({}).sort({ createdAt: -1 });
    res.json(data);
}));
app.get("/api/data/exchanges", (req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
