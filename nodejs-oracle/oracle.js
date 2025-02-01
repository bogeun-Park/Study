const oracledb = require('oracledb');

const dbConfig = {
    user          : "qhrms",
    password      : "1234",
    connectString : "localhost:1521/xe"
};

async function run() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        console.log("✅ Oracle DB 연결 성공!");

        // SQL 실행
        const result = await connection.execute("SELECT * FROM topic");
        console.log(result.rows);  // 조회 결과 출력

    } catch (err) {
        console.error("❌ 오류 발생:", err);
    } finally {
        if (connection) {
            await connection.close(); // 연결 종료
            console.log("✅ Oracle DB 연결 종료");
        }
    }
}

run();

module.exports = dbConfig;