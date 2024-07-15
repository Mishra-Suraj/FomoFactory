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
// mongoose.set("strictQuery", false);
// async function mongooseConnect() {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://Suraj:nHxgZ69bd4ndNlBi@cluster0.bzkrbit.mongodb.net/Fomo?retryWrites=true&w=majority&appName=Cluster0"
//     );
//     console.log("Successful");
//   } catch (error) {
//     console.log("ERROR ====> ", error);
//   }
// }
// mongooseConnect();
// const coinSchema = new mongoose.Schema({
//   code: String,
//   rate: Number,
//   volume: Number,
//   cap: Number,
// });
// const Coin = mongoose.model("Coin", coinSchema);
// const bitcoin = new Coin({ code: "bitcoin", rate: 12, volume: 12, cap: 12 });
// bitcoin
//   .save()
//   .then((savedCoin: any) => {
//     console.log("Bitcoin saved to database:", savedCoin);
//   })
//   .catch((err: any) => {
//     console.error(err);
//   });
setInterval(() => {
    app.get("/api/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("polling");
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
                    limit: 5,
                    meta: false,
                }),
            });
            let jsonData = yield data.json();
            res.json(jsonData);
            console.log(jsonData);
        }
        catch (error) {
            res.status(500).json({ error: "Error fetching data from API" });
        }
    }));
}, 5000);
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
