"use client";

import Image from "next/image";
// import styles from "./page.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

import { useDispatch, useSelector } from "react-redux";
import { coinsList } from "./store/coinSlice";
import { exchangeList } from "./store/exchangeSlice";
import { useEffect } from "react";

export default function Home() {
  const coins = useSelector((state: any) => state.coins.data);
  const exchange = useSelector((state: any) => state.exchange.data);

  const dispatch = useDispatch();
  let rows;

  async function getData() {
    const res = await fetch("http://localhost:3001/api/data/coins");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }

  async function getExchangeData() {
    const res = await fetch("http://localhost:3001/api/data/exchanges");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (localStorage.getItem("key") === "currency") {
        let data = await getData();
        dispatch(coinsList(data));
      } else {
        let data = await getExchangeData();
        dispatch(exchangeList(data));
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  function createData(code: string, rate: number, volume: number, cap: number) {
    return { code, rate, volume, cap };
  }

  function createExchange(
    name: String,
    centralized: Boolean,
    usCompliant: Boolean,
    code: String,
    markets: Number,
    volume: Number
  ) {
    return { name, centralized, usCompliant, code, markets, volume };
  }

  function createRowsForExchange(exchange: any) {
    let totalRows = exchange.data.map((item: any) =>
      createExchange(
        item.name,
        item.centralized,
        item.usCompliant,
        item.code,
        item.markets,
        item.volume
      )
    );
    return totalRows;
  }

  rows = createRowsForExchange(exchange);

  function createRows(coins: any) {
    let totalrows = coins.data.map((item: any) =>
      createData(item.code, item.rate, item.volume, item.cap)
    );
    return totalrows;
  }

  rows = createRows(coins);

  function handleExchangeChange() {
    localStorage.setItem("key", "exchange");
  }

  function handleCurrencyChange() {
    localStorage.setItem("key", "currency");
  }

  return (
    <>
      <TableContainer component={Paper} elevation={3} sx={{ padding: "6vw" }}>
        <Table
          sx={{ minWidth: 650, border: "2px solid black" }}
          aria-label="simple table"
        >
          <TableHead component={Paper} elevation={3}>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell align="right">Rate</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.code}
                </TableCell>
                <TableCell align="right">{row.rate}</TableCell>
                <TableCell align="right">{row.volume}</TableCell>
                <TableCell align="right">{row.cap}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}> */}
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "fixed", bottom: 16, right: 20 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<CurrencyExchangeIcon />}
          tooltipTitle={"Go to exchange"}
          onClick={handleExchangeChange}
        />
        <SpeedDialAction
          icon={<CurrencyBitcoinIcon />}
          tooltipTitle={"Go to currency"}
          onClick={handleCurrencyChange}
        />
      </SpeedDial>
      {/* </Box> */}
    </>
  );
}
