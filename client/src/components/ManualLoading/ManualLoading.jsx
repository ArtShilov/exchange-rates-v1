import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import "./ManualLoading.css";
import Loader from "../Loader";
import Button from "../Button/Button";
import DateInput from "../DateInput/index";

export default function ManualLoading({setDataToSelectInput}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
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
      setDataIsLoaded(true);
      const responce = await axios.get(`/fillSelectInput`);
      const data = JSON.parse(responce.data);
      if (data.result === false) {
        return
      }
      else{
        setDataToSelectInput(data)
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dataIsLoaded === true) {
        setDataIsLoaded(false);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dataIsLoaded]);

  return (
    <div className={'ManualLoading'}>
      <form onSubmit={(e) => graphRequestHandler(e)}>
        <DateInput
          value={dateFrom}
          min={"2015-01-01"}
          max={!dateTo ? today : dateTo}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <DateInput
          value={dateTo}
          min={!dateFrom ? "2015-01-01" : dateFrom}
          max={today}
          onChange={(e) => setDateTo(e.target.value)}
        />
        <Button type={"submit"}>отправить</Button>
      </form>

      {
        <div className={"ManualLoading__dataisLoading"}>
        {/* <span>{"Данные загружены"}</span> */}
          {dataIsLoadIng ? (
            <Loader type={"bars"} color={"grey"} height={70} width={70} />
          ) : dataIsLoaded ? (
            <span>{"Данные загружены"}</span>
          ) : null}
        </div>
      }
    </div>
  );
}
