import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import axios from "axios";
import Table from "../Table";
import Graph from "../Graph";
import SelectInput from "../SelectInput";
import ManualLoading from "../ManualLoading";

function App() {
  const [valCourse, setValCourse] = useState("");
  const [valCourseFilter, setValCourseFilter] = useState("");
  const [dataToSelectInput, setDataToSelectInput] = useState([]);
  const [dateForTableFilter, setDateForTableFilter] = useState("");
  const [noDataForTableMessage, setNoDataForTableMessage] = useState('');
  const [selectDataForTableFilter, setSelectDataForTableFilter] = useState("");
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
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

    const responce = await axios.get(
      `/course-valute-on-date/${dateForTableFilter}`
    );
    const data = JSON.parse(responce.data);
    if (data.result === 'Ошибка БД') {
      setNoDataForTableMessage(data.result);
    }else if (data.result === 'Нет данных') {
      setNoDataForTableMessage(data.result);
    }
     else {
      const nameList = data.ValCurs.Valute.map((e) => {
        return { value: e.ID, label: e.Name };
      });
      setNoDataForTableMessage('');
      setDataIsLoaded(true);
      setValCourse(data.ValCurs);
      setDataToSelectInput(nameList);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dataIsLoaded) {
        setDataIsLoaded('');
      }
      if (noDataForTableMessage) {
        setNoDataForTableMessage('');
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dataIsLoaded,noDataForTableMessage]);
  

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

        {dataIsLoaded ? (
          <span>{"Данные загружены"}</span>
        ) : noDataForTableMessage ? (
          <span>{noDataForTableMessage}</span>
        ) : null}

        <SelectInput
          options={dataToSelectInput}
          isMulti={true}
          selectHandler={filterTableHandler}
          closeMenuOnSelect={false}
          placeholder={"Filter..."}
        />
      </div>
      <div className={"App__table"}>

      <Table valCourse={valCourseFilter ? valCourseFilter : valCourse} />

      </div>
      <div>
        <h1>График</h1>
      </div>
      <Graph {...{ dataToSelectInput }} />
    </div>
  );
}

export default App;
