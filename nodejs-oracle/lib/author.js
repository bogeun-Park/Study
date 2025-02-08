var qs = require('querystring');
var oracledb = require('oracledb');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.home = (request, response, connection) => {
    connection.execute(`SELECT * FROM topic ORDER BY id`, 
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
                var authors = await connection.execute(`SELECT * FROM author ORDER BY name`,
                                                    {},
                                                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
            } catch (err) {
                console.error('Error occurred:', err);
                response.statusCode = 500;
                response.end('Internal Server Error');
            }

            authors = authors.rows;

            var title = 'author';
            var list = template.list(topics.rows);
            var html = template.html(sanitizeHtml(title), list, `
                    ${template.authorTable(authors)}
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td {
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p><input type="text" name="name" placeholder="name"></p>
                        <p>
                            <textarea name="profile" placeholder="profile"></textarea>
                        </p>
                        <p>
                            <input type="submit" value="create">
                        </p>
                    </form>
                `, ``
            );
            
            response.writeHead(200);
            response.end(html);
        }
    );
}
        
exports.create_process = (request, response, connection) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    });

    request.on('end', () => {
        var post = qs.parse(body);
        connection.execute(`INSERT INTO author 
                            VALUES (seq_author.nextval, :name, :profile)`,
            {
                name: post.name, 
                profile: post.profile, 
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },
            (err, res) => {
                if (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                    return;
                }

                response.writeHead(302, {location: `/author`});
                response.end('sucess');

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@author created : ");
                console.log(post);
            }
        );
    });
}

exports.update = (request, response, connection) => {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;

    connection.execute(`SELECT * FROM topic ORDER BY id`, 
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
                var author = await connection.execute(`SELECT * FROM author WHERE id = :id`,
                                                    {id: queryData.get('id')},
                                                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
            } catch (err) {
                console.error('Error occurred:', err);
                response.statusCode = 500;
                response.end('Internal Server Error');
            }

            author = author.rows;

            try{
                var authors = await connection.execute(`SELECT * FROM author ORDER BY name`,
                                                    {},
                                                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
            } catch (err) {
                console.error('Error occurred:', err);
                response.statusCode = 500;
                response.end('Internal Server Error');
            }

            authors = authors.rows;

            var title = 'author';
            var list = template.list(topics.rows);
            var html = template.html(sanitizeHtml(title), list, `
                    ${template.authorTable(authors)}
                    <style>
                        table {
                            border-collapse: collapse;
                        }
                        td {
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <p><input type="hidden" name="id" value="${queryData.get('id')}"></p>
                        <p><input type="text" name="name" value="${sanitizeHtml(author[0].NAME)}"></p>
                        <p>
                            <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].PROFILE)}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>
                `, ``
            );
            
            response.writeHead(200);
            response.end(html);
        }
    );
}

exports.update_process = (request, response, connection) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    })

    request.on('end', () => {
        var post = qs.parse(body);
        connection.execute(`UPDATE author 
                            SET name = :name, profile = :profile
                            WHERE id = :id`,
            {
                name: post.name, 
                profile: post.profile, 
                id: post.id
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },
            (err, res) => {
                if (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                    return;
                }

                response.writeHead(302, {location: `/author`});
                response.end('sucess');

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@author updated : ");
                console.log(post);
            }
        );
    });
}

exports.delete_process = (request, response, connection) => {
    var body = '';
    request.on('data', (data) => {
        body += data;
    })

    request.on('end', () => {
        var post = qs.parse(body);
        connection.execute(`DELETE FROM author 
                            WHERE id = :id`,
            {
                id: post.id
            }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true },
            async (err, res) => {
                if (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                    return;
                }

                try{
                    await connection.execute(`DELETE FROM topic WHERE author_id = :id`,
                                            { id: post.id },
                                            { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true });
                } catch (err) {
                    console.error('Error occurred:', err);
                    response.statusCode = 500;
                    response.end('Internal Server Error');
                }

                response.writeHead(302, {location: `/author`});
                response.end('sucess');

                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@author deleted : ");
                console.log(post);
            }
        );
    });
}