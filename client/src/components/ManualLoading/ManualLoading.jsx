import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import "./ManualLoading.css";
import Loader from "../Loader";

export default function ManualLoading() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dataIsLoad, setDataIsLoad] = useState(false);
  const [dataIsLoadIng, setDataIsLoading] = useState(false);
  const today = useMemo(() => new Date().toISOString().split("T")[0], [dateTo]);

  /* запрос на сервер для графика */
  const graphRequestHandler = async (e) => {
    e.preventDefault();
    setDataIsLoading(true);
    const responce = await axios.get(`/manualLoader/${dateFrom}/${dateTo}`);
    const data = JSON.parse(responce.data);
    if (data.result === true) {
      setDataIsLoading(false);
      setDataIsLoad(true);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dataIsLoad === true) {
        setDataIsLoad(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dataIsLoad]);

  return (
    <div>
      <form onSubmit={(e) => graphRequestHandler(e)}>
        <input
          type="date"
          value={dateFrom}
          min={"2015-01-01"}
          max={!dateTo ? today : dateTo}
          onChange={(e) => setDateFrom(e.target.value)}
          required
        />
        <input
          type="date"
          value={dateTo}
          min={!dateFrom ? "2015-01-01" : dateFrom}
          max={today}
          onChange={(e) => setDateTo(e.target.value)}
          required
        />
        <button type={"submit"}>отправить</button>
      </form>
      {
        <div className={"dataisLoading"}>
          {dataIsLoadIng ? (
            <Loader type={"bars"} color={"grey"} height={20} width={20} />
          ) : dataIsLoad ? (
            <span>{"Данные загружены"}</span>
          ) : null}
        </div>
      }
    </div>
  );
}
