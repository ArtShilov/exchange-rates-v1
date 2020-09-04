import React, { useState, useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import SelectInput from "../SelectInput";
import options from "./optionForGraph";
import "./Graph.css";
import DateInput from "../DateInput/index";
import Button from "../Button/index";

export default function Graph({ dataToSelectInput }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [dataToSelectInputFromDB, setDataToSelectInputFromDB] = useState("");
  const [valuteData, setValuteData] = useState("");
  const [jsonDataToDownload, setJsonDataToDownload] = useState("");
  const [HighchartsReactOptions, setHighchartsReactOptions] = useState(options);
  const today = useMemo(() => new Date().toISOString().split("T")[0], [dateTo]);

  useEffect(() => {
    const data = dataToSelectInputFromDB
      ? dataToSelectInputFromDB
      : dataToSelectInput;
    setValuteData(data[0]);
  }, [dataToSelectInput, dataToSelectInputFromDB]);

  useEffect(() => {
    if (dataToSelectInput.length === 0) {
      requestForFillSelect();
    }
    async function requestForFillSelect() {
      const responce = await axios.get(`/fillSelectInput`);
      const data = JSON.parse(responce.data);
      if (data.result === false) {
        return;
      } else {
        setDataToSelectInputFromDB(data);
      }
    }
  }, [dataToSelectInput]);

  /* запрос на сервер для графика */
  const graphRequestHandler = async (e) => {
    e.preventDefault();

    const responce = await axios.get(
      `/course-valute-on-period/${dateFrom}/${dateTo}/${valuteData.value}`
    );
    const data = JSON.parse(responce.data);
    setJsonDataToDownload(data);
    const { dateArray, valueArray } = data;
    const { to, from } = data.periodDate;
    const newOptions = {
      ...HighchartsReactOptions,
      title: {
        text: `Динамика изменения курса, ${from} - ${to}`,
      },
      series: { data: valueArray, name: valuteData.label },
      xAxis: {
        categories: dateArray,
      },
    };
    setHighchartsReactOptions(newOptions);
  };

  return (
    <div className={"graph"}>
      <div className={"graphMenu"}>
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
        <SelectInput
          options={
            dataToSelectInputFromDB
              ? dataToSelectInputFromDB
              : dataToSelectInput
          }
          isMulti={false}
          selectHandler={(value) => setValuteData(value)}
          closeMenuOnSelect={true}
          defaultValue={valuteData}
        />
          <div className={'Button--right'}>
        {jsonDataToDownload ? (
          <Button type={"button"}>
            <a
              style={{ textDecoration: "inherit", color: "inherit" }}
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(jsonDataToDownload)
              )}`}
              download={`${valuteData.label}_period_${dateFrom}_to_${dateTo}.json`}
            >
              {`Download Json`}
            </a>
          </Button>
        ) : null}
        </div>
      </div>
      {jsonDataToDownload ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={HighchartsReactOptions}
        />
      ) : (
        <div style={{ height: "90%" }}></div>
      )}
    </div>
  );
}
