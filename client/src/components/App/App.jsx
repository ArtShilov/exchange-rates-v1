import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import axios from "axios";
import Table from "../Table";
import Graph from "../Graph";
import SelectInput from "../SelectInput";
import ManualLoading from "../ManualLoading";
import Button from "../Button/";
import DateInput from "../DateInput/";

function App() {
  const [valCourse, setValCourse] = useState("");
  const [valCourseFilter, setValCourseFilter] = useState("");
  const [dataToSelectInput, setDataToSelectInput] = useState([]);
  const [dateForTableFilter, setDateForTableFilter] = useState("");
  const [noDataForTableMessage, setNoDataForTableMessage] = useState("");
  const [jsonDataToDownload, setJsonDataToDownload] = useState("");
  const [selectDataForTableFilter, setSelectDataForTableFilter] = useState("");
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const today = useMemo(() => new Date().toISOString().split("T")[0], [
    dateForTableFilter,
  ]);

  /* button state */
  const [buttonSelected, setbuttonSelected] = useState([
    { name: "manualLoading", value: "Ручная загрузка", isSelect: true },
    { name: "table", value: "Таблица", isSelect: false },
    { name: "graph", value: "График", isSelect: false },
  ]);
  const [componentSelected, setComponentSelected] = useState("manualLoading");

  const buttonSelectedHandler = (select) => {
    const newButtonSelected = buttonSelected.map((obj) => {
      obj.name === select ? (obj.isSelect = true) : (obj.isSelect = false);
      return obj;
    });
    setbuttonSelected(newButtonSelected);
    setComponentSelected(select);
  };

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
  const fetchData = async (e) => {
    e.preventDefault();
    const responce = await axios.get(
      `/course-valute-on-date/${dateForTableFilter}`
    );
    const data = JSON.parse(responce.data);
    if (data.result === "Ошибка БД") {
      setNoDataForTableMessage(data.result);
    } else if (data.result === "Нет данных") {
      setNoDataForTableMessage(data.result);
    } else {
      setJsonDataToDownload(data)
      const nameList = data.ValCurs.Valute.map((e) => {
        return { value: e.ID, label: e.Name };
      });
      setNoDataForTableMessage("");
      setDataIsLoaded(true);
      setValCourse(data.ValCurs);
      setDataToSelectInput(nameList);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dataIsLoaded) {
        setDataIsLoaded("");
      }
      if (noDataForTableMessage) {
        setNoDataForTableMessage("");
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dataIsLoaded, noDataForTableMessage]);

  /* изменяет данные фильтрованной таблицы */
  useEffect(() => {
    filterTableHandler(selectDataForTableFilter);
  }, [valCourse]);

  return (
    <div className="App">
    <div className="App__container">
      <header className="App__header">
      <div className="App__header--select">
        {buttonSelected.map(({ name, value, isSelect }) => {
          return (
            <Button
              key={name}
              type={"button"}
              isSelect={isSelect}
              onClick={() => buttonSelectedHandler(name)}
            >
              {value}
            </Button>
          );
        })}
      </div>
      <div className="App__header--icon">{
      componentSelected === "manualLoading" ?
        <div className="App__header--icon--start"/>:
        componentSelected === "graph" ?
        <div className="App__header--icon--graph"/>:
        componentSelected === "table" ?
        <div className="App__header--icon--table"/>:
        null
        }
      </div>

      </header>
      {componentSelected === "manualLoading" ? (
        <>
          <h1>Ручная загрузка</h1>
          <ManualLoading {...{ setDataToSelectInput }} />
        </>
      ) : componentSelected === "table" ? (
        <>
          <h1>Курсы валют</h1>
          <div className={"App__tableSettigs"}>
            <div className={"App__tableSettigs--form"}>
              <form onSubmit={(e) => fetchData(e)}>
                <DateInput
                  value={dateForTableFilter}
                  onChange={(e) => setDateForTableFilter(e.target.value)}
                  min={"2015-01-01"}
                  max={today}
                />
                <Button type={"submit"}>отправить</Button>
              </form>
              {dataIsLoaded ? (
                <div>{"Данные загружены"}</div>
              ) : noDataForTableMessage ? (
                <div>{noDataForTableMessage}</div>
              ) : (
                <div></div>
              )}
            </div>
            <SelectInput
              options={valCourse ? dataToSelectInput : []}
              isMulti={true}
              selectHandler={filterTableHandler}
              closeMenuOnSelect={false}
              placeholder={"Фильтр по курсу валют"}
            />
          </div>
          <div className={"App__table"}>
          <div className={'Button--right'}>
        {jsonDataToDownload ? (
          <Button type={"button"}>
            <a
              style={{ textDecoration: "inherit", color: "inherit" }}
              href={`data:text/json;charset=utf-8,${encodeURIComponent(
                JSON.stringify(jsonDataToDownload)
              )}`}
              download={`valute_Course_On_${dateForTableFilter}.json`}
            >
              {`Download Json`}
            </a>
          </Button>
        ) : null}
          </div>

            <Table valCourse={valCourseFilter ? valCourseFilter : valCourse} />
          </div>
        </>
      ) : componentSelected === "graph" ? (
        <>
          <div>
            <h1>График</h1>
          </div>
          <Graph {...{ dataToSelectInput }} />
        </>
      ) : null}
    </div>
    </div>
  );
}

export default App;
