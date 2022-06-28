const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "gearTracker"
});
console.log("sqlConn.js has been run")

exports.getConnection = function(callback) {
  pool.getConnection(function(err, conn) {
    if(err) {
      return callback(err);
    }
    callback(err, conn);
    conn.release();
  });
};