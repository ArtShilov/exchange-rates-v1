import React, { useEffect, useCallback } from "react";
import "./Table.css";
import { useState, useMemo } from "react";

export default function Table({ valCourse}) {
  
  const [pageSize] = useState(10);
  const [courseArray, setCourseArray] = useState([]);
  const [currentValutes, setCurrentValutes] = useState([]);
  const totalValuteCount = useMemo(() => valCourse.Valute.length, [valCourse]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Name');
  const [tableHead, setTableHead] = useState([
    { name: "Name", sort: true },
    { name: "CharCode", sort: null },
    { name: "Nominal", sort: null },
    { name: "Value", sort: null },
    { name: "NumCode", sort: null },
  ]);

    /* расчет количества страниц пагинации */
    const pageCount = useMemo(
      () =>
        [...Array(Math.ceil(totalValuteCount / pageSize)).keys()].map(
          (n, i) => i + 1
        ),
      [totalValuteCount, pageSize]
    );


  /* вывод постранично элементов таблицы */
  const currentValutesMemo = useCallback(() => {
    const calcElement = currentPage * pageSize;
    return courseArray.slice(calcElement - pageSize, calcElement);
  }, [currentPage, pageSize, courseArray]);

  
  /* сортировка колонок */
  const sortColumn = (sortElementName) => {
    const sortElement = tableHead.filter(e=>e.name === sortElementName)[0]
    if (sortElement.sort === true) {
      const newSort = valCourse.Valute.sort((a, b) => {
        if (a[sortElement.name] < b[sortElement.name]) return -1;
        if (a[sortElement.name] > b[sortElement.name]) return 1;
        return 0;
      });
      setCourseArray(newSort);
    }
    else if (sortElement.sort === false) {
      const newSort = valCourse.Valute.sort((a, b) => {
        if (a[sortElement.name] > b[sortElement.name]) return -1;
        if (a[sortElement.name] < b[sortElement.name]) return 1;
        return 0;
      });
      setCourseArray(newSort);
    }
  };

    /* обработчик начала сотрировки */
  const handleSortTable = (sortElement) => {
    const newTableHeadState = tableHead.map((e) => {
      if (e.name === sortElement.name && e.sort === null) {
        return { name: e.name, sort: true };
      } else if (e.name === sortElement.name && e.sort) {
        return { name: e.name, sort: false };
      } else if (e.name === sortElement.name && !e.sort) {
        return { name: e.name, sort: true };
      } 
      return { name: e.name, sort: null }
     
    });
    setTableHead(newTableHeadState);
    setSortBy(sortElement.name)
  };

  useEffect(() => {
    sortColumn(sortBy)
    setCurrentValutes(currentValutesMemo())
    
  }, [tableHead, courseArray, sortBy, currentValutesMemo, valCourse ])

  useEffect(() => {
    if (valCourse.Valute.length < 10) {
      setCurrentPage(1)
}
  }, [valCourse ])
  

  return (
    <div className={"container"}>
      <table className={"courseTable"}>
        <thead>
          <tr>
            <th colSpan="5">{valCourse._attributes.Date}</th>
          </tr>
          <tr>
            {tableHead.map((obj, i) => (
              <th onClick={() => handleSortTable(obj)} key={`${obj + i}`}>
                <div className={"tableHead__sort"}>
                  <span>{obj.name}</span>
                  <span
                    className={
                      obj.sort
                        ? "arrow-up"
                        : obj.sort === null
                        ? ""
                        : "arrow-down"
                    }
                  ></span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentValutes.length !== 0?
          currentValutes.map((obj) => {
            const {
              Name,
              CharCode,
              NumCode,
              Nominal,
              Value,
              ID,
            } = obj;
            return (
              <tr key={ID}>
                <td>{Name}</td>
                <td>{CharCode}</td>
                <td>{Nominal}</td>
                <td>{Value}</td>
                <td>{NumCode}</td>
              </tr>
            );
          }):null
          }
        </tbody>
      </table>
      {valCourse.Valute.length > pageSize ? (
        <div className={"pagination"}>
          {pageCount.map((e) => (
            <button
              key={Math.random()}
              className={currentPage === e ? "--selected" : ""}
              onClick={() => setCurrentPage(e)}
            >
              {e}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
