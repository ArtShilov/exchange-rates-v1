const express = require('express');
const logger = require('morgan');
const path = require('path')
const CronJob = require('cron').CronJob;
const {decoderResponseCBR_XMLtoJSON} = require('./helpers/decoderResponseCBR_XMLtoJSON')
require("dotenv").config({path: './.env'});

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve("../client/build/")));;
app.use('/', indexRouter);

/* запрос данных каждый день 7:00 */
var job = new CronJob({
  cronTime: '0 00 07 * * * ',
  onTick: async function () {
  const todayFormatedDate = new Date().toISOString().split("T")[0].split("-").reverse().join("/")
  
  let jsonOfDB = await readRecordsFromMediaTable(`courseOf_${todayFormatedDate}`);

  if (jsonOfDB.Valute === null) {
    const reqToCBR = `${process.env.requestCBRonDate}${todayFormatedDate}`
    const decoder = await decoderResponseCBR_XMLtoJSON(reqToCBR) 

    await createTable(decoder,todayFormatedDate);
  } 
  job.stop()
  },
  start: true,
  runOnInit: false,
  onComplete:() => console.log('load success')
})

job.start()

module.exports = app;
