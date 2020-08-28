const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbPath = path.resolve(__dirname, "../database.db");
const { dateFormat } = require("./dateFormat");

function fillDBTable(data) {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to ../sqlite3/database.db SQlite database.");
  });

  const jsonData = JSON.parse(data);
  const { _attributes, Valute } = jsonData.ValCurs;

  return new Promise(function (resolve, reject) {
    const sql = `CREATE TABLE IF NOT EXISTS courseValute (
    ID TEXT ,
    DATE DATE ,
    Name TEXT,
    NumCode INT,
    CharCode INT,
    Nominal INT,
    Value INT,
    UNIQUE(ID, DATE) ON CONFLICT REPLACE
   )`;

    db.run(sql, (error) => {
      if (error) {
        reject(error);
      } else {
        const stmt = db.prepare(
          `INSERT INTO courseValute VALUES(?,?,?,?,?,?,?)`
        );
        for (let i = 0; i < Valute.length; i++) {
          const obj = Valute[i];
          const formatDate = dateFormat(
            _attributes.Date,
            "DD.MM.YYYY",
            "YYYY-MM-DD"
          );
          stmt.run(
            obj._attributes.ID,
            formatDate,
            obj.Name._text,
            obj.NumCode._text,
            obj.CharCode._text,
            obj.Nominal._text,
            obj.Value._text
          );
        }
        stmt.finalize();
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Close the database connection.");
      resolve("ok");
    });
  });
}

const readRecordsFromDBTableOnDay = function (date) {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to ../sqlite3/database.db SQlite database.");
  });
  const formatDate = dateFormat(date,'YYYY-MM-DD','DD.MM.YYYY')
  return new Promise(function (resolve, reject) {
    db.all(`SELECT * FROM courseValute WHERE DATE = '${date}'`, function (
      err,
      row
    ) {
      if (err) {
        console.error(err.message);
        resolve({result:false});
      } else {
        resolve({
          ValCurs: { Valute: [...row], _attributes: { Date: formatDate } },
        });
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });
};

const readRecordsFromTableOnPeriod = function (dateFrom, dateTo, valID) {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to ../sqlite3/database.db SQlite database.");
  });

  return new Promise(function (resolve, reject) {
    db.all(
      `SELECT Value,DATE FROM courseValute WHERE ID LIKE '${valID}' AND DATE BETWEEN '${dateFrom}' AND '${dateTo}'`,
      function (err, row) {
        if (err) {
          console.error(err.message);
          resolve(err.message);
        } else {
          resolve([...row]);
        }
      }
    );

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  });
};

module.exports = {
  fillDBTable,
  readRecordsFromDBTableOnDay,
  readRecordsFromTableOnPeriod,
};
