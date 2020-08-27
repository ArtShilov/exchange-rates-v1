const moment = require('moment')
const {dateFormat} = require('../helpers/dateFormat')
var start = moment("2019-01-01")
var end = moment("2019-02-10");

var list = [];

for (var current = start; current <= end; current.add(1, 'd')) {
  list.push(current.format("DD/MM/YYYY"))
}



console.log("list", list)

const alal = new Date('2019.01.01')
console.log(moment(alal).format("DD/MM/YYYY"));

console.log("dateFormat", dateFormat("2019-01-01","DD/MM/YYYY"))
