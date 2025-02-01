var oracledb = require('oracledb');

module.exports = async function initDB() {
  try {
        var connection = await oracledb.getConnection({
        user          : "qhrms",
        password      : "1234",
        connectString : "localhost:1521/xe"
    });
    console.log("✅ Oracle DB 전역 연결 성공!");

    return connection;  // connection.execute(sql문, bind값, 옵션, callback)
  } catch (err) {
    console.error("❌ Oracle DB 연결 실패:", err);
  }
}