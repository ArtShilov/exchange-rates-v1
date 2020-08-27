import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import axios from "axios";
import Table from "../Table";
import Loader from "../Loader";
import Graph from "../Graph";
import SelectInput from "../SelectInput";
import ManualLoading from "../ManualLoading";

function App() {
  const [valCourse, setValCourse] = useState("");
  const [valCourseFilter, setValCourseFilter] = useState("");
  const [dataToSelectInput, setDataToSelectInput] = useState([]);
  const [dateForTableFilter, setDateForTableFilter] = useState("");
  const [noDateForTable, setNoDateForTable] = useState(false);
  const [selectDataForTableFilter, setSelectDataForTableFilter] = useState("");
  const today = useMemo(() => new Date().toISOString().split("T")[0], [
    dateForTableFilter,
  ]);

  /* фильтрация таблицы */
  const filterTableHandler = (elements) => {
    setSelectDataForTableFilter(elements);

    if (elements === null || elements.length === 0) {
      setValCourseFilter("");
    } else {
      const newValCourse = valCourse.Valute.filter((element) =>
        elements.some((chooseElements) => chooseElements.value === element.ID)
      );
      setValCourseFilter({ ...valCourse, Valute: newValCourse });
    }
  };

  /* запрос на сервер */
  const fetchData = async () => {
    const dateNow = new Date();
    const formatDate = dateNow.toISOString().split("T")[0];
    const responce = await axios.get(
      `/course-valute-on-date/${
        dateForTableFilter ? dateForTableFilter : formatDate
      }`
    );
    const data = JSON.parse(responce.data);
    if (data.result === false) {
      setNoDateForTable(true)
    }else{
      const nameList = data.ValCurs.Valute.map((e) => {
        return { value: e.ID, label: e.Name };
      });
      setNoDateForTable(false)
      setValCourse(data.ValCurs);
      setDataToSelectInput(nameList);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* изменяет данные фильтрованной таблицы */
  useEffect(() => {
    filterTableHandler(selectDataForTableFilter);
  }, [valCourse]);

  return (
    <div className="App">
      <h1>Ручная загрузка</h1>
      <ManualLoading />

      <h1>Курсы валют</h1>
      <div>
        <input
          type="date"
          value={dateForTableFilter}
          onChange={(e) => setDateForTableFilter(e.target.value)}
          min={"2015-01-01"}
          max={today}
        />
        <button onClick={fetchData}>отправить</button>

        {noDateForTable ? <span>{"На этот день нет данных"}</span> : null}

        <SelectInput
          options={dataToSelectInput}
          isMulti={true}
          selectHandler={filterTableHandler}
          closeMenuOnSelect={false}
          placeholder={"Filter..."}
        />
      </div>
      <div className={"App__table"}>
        {valCourse.Valute ? (
          <Table valCourse={valCourseFilter ? valCourseFilter : valCourse} />
        ) : (
          <Loader type={"bars"} color={"grey"} height={667} width={375} />
        )}
      </div>
      <div>
        <h1>График</h1>
      </div>
      <Graph {...{ dataToSelectInput }} />
    </div>
  );
}

export default App;
