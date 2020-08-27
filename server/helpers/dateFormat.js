const moment = require("moment");

function getDateArray(dateFrom, dateTo) {
  const start = moment(dateFrom);
  const end = moment(dateTo);

  const dateList = [];

  for (let current = start; current <= end; current.add(1, "d")) {
    dateList.push(current.format("DD/MM/YYYY"));
  }

  return dateList;
}

function dateFormat(date, formatBefore, formatAfter) {
  if (formatAfter) {
    return (result = moment(date, formatBefore).format(formatAfter));
  } else {
    return (result = moment(new Date(date)).format(formatBefore));
  }
}

module.exports = { getDateArray, dateFormat };
