var http = require('http');
var qs = require('querystring');
var template = require('./lib/template.js');
var oracledb = require('oracledb');

let connection;
// connection.execute(sql문, bind값, 옵션, callback)
async function initDB() {
  try {
    connection = await oracledb.getConnection({
        user          : "qhrms",
        password      : "1234",
        connectString : "localhost:1521/xe"
    });
    console.log("✅ Oracle DB 전역 연결 성공!");
  } catch (err) {
    console.error("❌ Oracle DB 연결 실패:", err);
  }
}

// 서버 시작 전에 DB 연결
initDB();

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = new URL('http://localhost:3000' + _url).pathname;

    if (pathname === '/') {
        if (queryData.get('id') === null) {
            connection.execute(`SELECT * FROM topic`, 
                {}, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT }, 
                (err, topics) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;  // 500 내부 서버 오류
                        response.end('Internal Server Error');
                        return;
                    }

                    var title = 'Welcome';
                    var description = 'Hello, Node.js!';
                    var list = template.list(topics.rows);
                    var html = template.html(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">Create</a>`
                    );
                    
                    response.writeHead(200);
                    response.end(html);
                }
            );
        }
        else {
            connection.execute(`SELECT * FROM topic`, 
                {}, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT }, 
                async (err, topics) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;
                        response.end('Internal Server Error');
                        return;
                    }
                    
                    try{
                        var topic = await connection.execute(`SELECT * FROM topic 
                                                              LEFT JOIN author 
                                                              ON topic.author_id = author.id
                                                              WHERE topic.id = :id`,
                                                            {id: queryData.get('id')},
                                                            { outFormat: oracledb.OUT_FORMAT_OBJECT });
                    } catch (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;
                        response.end('Internal Server Error');
                    }
                    
                    topic = topic.rows;
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@selected : ");
                    console.log(topic);

                    var title = topic[0].TITLE;
                    var description = topic[0].DESCRIPTION;
                    var list = template.list(topics.rows);
                    var html = template.html(title, list,
                        `
                        <h2>${title}</h2>
                        <p>${description}</p>
                        <p>by ${topic[0].NAME}</p>
                        `
                        ,
                        `<a href="/create">Create</a>
                        <a href="/update?id=${queryData.get('id')}">Update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.get('id')}">
                            <input type="submit" value="Delete">
                        </from>`
                    );
                    
                    response.writeHead(200);
                    response.end(html);
                }
            );
        }
    }
    else if (pathname === '/create') {
        connection.execute(`SELECT * FROM topic`, 
            {}, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }, 
            async (err, topics) => {
                if (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                    return;
                }

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@creating...")

                try{
                    var authors = await connection.execute(`SELECT * FROM author`,
                                                        {},
                                                        { outFormat: oracledb.OUT_FORMAT_OBJECT });
                } catch (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                }

                authors = authors.rows;
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@authors : ")
                console.log(authors);

                var title = 'WEB - create';
                var list = template.list(topics.rows);
                var html = template.html(title, list, `
                            <form action="/create_process" method="post">
                            <p><input type="text" name="title" placeholder="title"></p>
                            <p>
                                <textarea name="description" placeholder="description"></textarea>
                            </p>
                            <p>
                                ${template.authorSelect(authors)}
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                    `, `<a href="/create">Create</a>`
                );
                
                response.writeHead(200);
                response.end(html);
            }
        );
    }
    else if (pathname === '/create_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            connection.execute(`INSERT INTO topic 
                                VALUES (seq_topic.nextval, :title, :description, SYSDATE, :author_id)
                                RETURNING id INTO :id`,  // id 값을 반환받을 변수 설정` 
                {
                    title: post.title, 
                    description: post.description, 
                    author_id: post.author,
                    id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } // 삽입된 nextval반환을 위한 설정
                }, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },  // insert후에 commit
                (err, res) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;  // 500 내부 서버 오류
                        response.end('Internal Server Error');
                        return;
                    }
                    
                    var insertedId = res.outBinds.id[0];  // 반환된 id 값

                    response.writeHead(302, {location: `/?id=${insertedId}`});  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                    response.end('sucess');

                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@created : ");
                    console.log(post);
                }
            );
        })
    }
    else if (pathname === '/update') {
        connection.execute(`SELECT * FROM topic`, 
            {}, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }, 
            async (err, topics) => {
                if (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;  // 500 내부 서버 오류
                    response.end('Internal Server Error');
                    return;
                }

                try{
                    var topic = await connection.execute(`SELECT * FROM topic WHERE id = :id`,  // sql
                                                        {id: queryData.get('id')},  // 바인딩 값
                                                        { outFormat: oracledb.OUT_FORMAT_OBJECT }); // 옵션    
                } catch (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                }

                topic = topic.rows;
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@updating : ");
                console.log(topic);

                try{
                    var authors = await connection.execute(`SELECT * FROM author`,
                                                        {},
                                                        { outFormat: oracledb.OUT_FORMAT_OBJECT });
                } catch (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                }

                authors = authors.rows;
                
                var list = template.list(topics.rows);
                var html = template.html(topic[0].TITLE, list,`
                        <form action="/update_process" method="post">
                            <p><input type="hidden" name="id" value="${topic[0].ID}"></p>
                            <p><input type="text" name="title" placeholder="title" value="${topic[0].TITLE}"></p>
                            <p>
                                <textarea name="description" placeholder="description">${topic[0].DESCRIPTION}</textarea>
                            </p>
                            <p>
                                ${template.authorSelect(authors, topic[0].AUTHOR_ID)}
                            </p>
                            <p>
                                <input type="submit">
                            </p>
                        </form>
                    `, `<a href="/create">Create</a> <a href="/update?id=${topic[0].ID}">Update</a>`
                );

                response.writeHead(200);
                response.end(html);
            }
        );
    }
    else if (pathname === '/update_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            connection.execute(`UPDATE topic 
                                SET title = :title, description = :description, author_id = :author_id
                                WHERE id = :id`,
                {
                    title: post.title, 
                    description: post.description, 
                    author_id: post.author,
                    id: post.id
                }, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },  // update후에 commit
                (err, res) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;  // 500 내부 서버 오류
                        response.end('Internal Server Error');
                        return;
                    }

                    response.writeHead(302, {location: `/?id=${post.id}`});  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                    response.end('sucess');

                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@updated : ");
                    console.log(post);
                }
            );
        })
    }
    else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            connection.execute(`DELETE FROM topic 
                                WHERE id = :id`,
                {
                    id: post.id
                }, 
                { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },  // update후에 commit
                (err, res) => {
                    if (err) {
                        console.error('Error occurred:', err);
                        response.statusCode = 500;  // 500 내부 서버 오류
                        response.end('Internal Server Error');
                        return;
                    }

                    response.writeHead(302, {location: `/`});
                    response.end('sucess');

                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@deleted : ");
                    console.log(post);
                }
            );
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }

});

app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
});

// pm2 start main.js --watch --ignore-watch="./data/*" --no-daemon
// data디렉토리 안에 파일들이 변경되어도 pm2를 껏다 키지 않고 재실행(세션유지)