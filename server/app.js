const express = require("express");
const logger = require("morgan");
const path = require("path");
const CronJob = require("cron").CronJob;
const {
  decoderResponseCBR_XMLtoJSON,
} = require("./helpers/decoderResponseCBR_XMLtoJSON");
const { todayDate } = require("./helpers/dateFormat");
const { fillDBTable } = require("./helpers/sqlite3");
require("dotenv").config({ path: "./.env" });

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("../client/build/")));
app.use("/", indexRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/build/index.html"));
});

/* запрос данных каждый день 7:00 */
var job = new CronJob({
  cronTime: "0 00 07 * * *",

  onTick: async function () {
    const todayFormatedDate = todayDate("DD/MM/YYYY");

    const reqToCBR = `${process.env.requestCBRonDate}?date_req=${todayFormatedDate}`;
    const decoder = await decoderResponseCBR_XMLtoJSON(reqToCBR);
    await fillDBTable(decoder);
    job.stop();
  },
  start: true,
  runOnInit: false,
  onComplete: () => console.log("load success"),
});

job.start();

module.exports = app;
