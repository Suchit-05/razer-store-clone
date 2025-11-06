    const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Suchit@07",
  database: "razer_clone"
});

module.exports = pool.promise();
