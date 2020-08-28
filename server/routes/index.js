const express = require("express");
const router = express.Router();
const {
  decoderResponseCBR_XMLtoJSON,
} = require("../helpers/decoderResponseCBR_XMLtoJSON");
const {
  fillDBTable,
  readRecordsFromDBTableOnDay,
  readRecordsFromTableOnPeriod,
} = require("../helpers/sqlite3");
const { getDateArray, dateFormat } = require("../helpers/dateFormat");

router.get("/manualLoader/:dateFrom/:dateTo", async function (req, res, next) {
  const { dateFrom, dateTo } = req.params;

  const dateArray = getDateArray(dateFrom, dateTo);

  for (let i = 0; i < dateArray.length; i++) {
    const reqToCBR = `${process.env.requestCBRonDate}?date_req=${dateArray[i]}`;
    const decoder = await decoderResponseCBR_XMLtoJSON(reqToCBR);
    await fillDBTable(decoder);
  }
  res.json(JSON.stringify({ result: true }));
});

router.get("/course-valute-on-date/:date", async function (req, res, next) {
  const { date } = req.params;

  const jsonOfDB = await readRecordsFromDBTableOnDay(date);

  if (jsonOfDB.result === false) {
    res.json(JSON.stringify({result:"Ошибка БД"}));
  }else if (jsonOfDB.ValCurs.Valute.length === 0) {
    res.json(JSON.stringify({result:"Нет данных"}));
  }
   else {
    res.json(JSON.stringify(jsonOfDB));
  }
});

router.get("/course-valute-on-period/:dateFrom/:dateTo/:valID", async function (
  req,
  res,
  next
) {
  const { dateFrom, dateTo, valID } = req.params;

  const formatedDateFrom = dateFormat(dateFrom, "DD.MM.YYYY");
  const formatedDateTo = dateFormat(dateTo, "DD.MM.YYYY");

  const jsonOfDB = await readRecordsFromTableOnPeriod(dateFrom, dateTo, valID);

  const valueForResponce = jsonOfDB.map((e) => +e.Value.split(",").join("."));
  const dateForResponce = jsonOfDB.map((e) => dateFormat(e.DATE, "DD.MM.YYYY"));

  res.json(
    JSON.stringify({
      valID,
      dateArray: dateForResponce,
      valueArray: valueForResponce,
      periodDate: { from: formatedDateFrom, to: formatedDateTo },
    })
  );
});

module.exports = router;
