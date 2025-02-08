require('dotenv').config();
var oracledb = require('oracledb');

module.exports = async function initDB() {
  try {
        var connection = await oracledb.getConnection({
          user          : process.env.DB_USER,
          password      : process.env.DB_PASS,
          connectString : process.env.DB_HOST
        });
    console.log("✅ Oracle DB 전역 연결 성공!");

    return connection;  // connection.execute(sql문, bind값, 옵션, callback)
  } catch (err) {
    console.error("❌ Oracle DB 연결 실패:", err);
  }
}