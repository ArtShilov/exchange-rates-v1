import React, { useState, useMemo, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import SelectInput from "../SelectInput";
import options from "./optionForGraph";
import "./Graph.css";

export default function Graph({ dataToSelectInput }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [valuteData, setValuteData] = useState("");
  const [jsonDataToDownload, setJsonDataToDownload] = useState("");
  const [HighchartsReactOptions, setHighchartsReactOptions] = useState(options);
  const today = useMemo(() => new Date().toISOString().split("T")[0], [dateTo]);

  useEffect(() => {
    setValuteData(dataToSelectInput[0]);
  }, [dataToSelectInput]);

  /* запрос на сервер для графика */
  const graphRequestHandler = async (e) => {
    e.preventDefault();

    const responce = await axios.get(
      `/course-valute-on-period/${dateFrom}/${dateTo}/${valuteData.value}`
    );
    console.log("graphRequestHandler -> responce", typeof responce.data);
    const data = JSON.parse(responce.data);
    setJsonDataToDownload(data);
    const { dateArray, valueArray } = data;
    console.log("graphRequestHandler -> ValueArray", valueArray);
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
          <SelectInput
            options={dataToSelectInput}
            isMulti={false}
            selectHandler={(value) => setValuteData(value)}
            closeMenuOnSelect={true}
            defaultValue={valuteData}
          />
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

        {jsonDataToDownload ? (
          <button className={"button__json"}>
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(jsonDataToDownload)
              )}`}
              download={`${valuteData.label}_period_${dateFrom}_to_${dateTo}.json`}
            >
              {`Download Json`}
            </a>
          </button>
        ) : null}
      </div>
      {jsonDataToDownload ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={HighchartsReactOptions}
        />
      ) : (
        <div style={{ height: "500px" }}></div>
      )}
    </div>
  );
}
