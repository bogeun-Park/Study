var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = new URL('http://localhost:3000' + _url).pathname;

    console.log(new URL('http://localhost:3000' + _url + '\t'));

    if (pathname === '/') {
        if (queryData.get('id') === null) {
            fs.readdir('./data', (err, filelist) => {
                var title = 'Welcome';
                var description = 'Hello, Node.js!';
                var list = template.list(filelist);
                var html = template.html(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">Create</a>`
                );

                response.writeHead(200);
                response.end(html);
            });
        }
        else {
            fs.readdir('./data', (err, filelist) => {
                var filteredId = path.parse(queryData.get('id')).base;
                // fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
                // 파일을 읽을 때 위처럼 읽으면[ex) ../password.js]보안문제가 생김. 그래서 파일을 parse해서 파일base만 추출해야 함
                fs.readFile(`data/${filteredId}`, 'utf-8', (err, description) => {
                    var title = queryData.get('id');
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizeddescription = sanitizeHtml(description);
                    var list = template.list(filelist);
                    var html = template.html(sanitizedTitle, list,
                        `<h2>${sanitizedTitle}</h2><p>${sanitizeddescription}</p>`,
                        `<a href="/create">Create</a>
                         <a href="/update?id=${sanitizedTitle}">Update</a>
                         <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="Delete">
                         </from>`
                    );

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }
    else if (pathname === '/create') {
        fs.readdir('./data', (err, filelist) => {
            var title = 'WEB - create';
            var list = template.list(filelist);
            var html = template.html(title, list, `
                    <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                `, '');

            response.writeHead(200);
            response.end(html);
        });
    }
    else if (pathname === '/create_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, {location: `/?id=${title}`});  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                response.end('sucess');
            })
        })
    }
    else if (pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            var filteredId = path.parse(queryData.get('id')).base;
            fs.readFile(`data/${filteredId}`, 'utf-8', (err, description) => {
                var title = queryData.get('id');
                var list = template.list(filelist);
                var html = template.html(title, list,
                    `
                    <form action="/update_process" method="post">
                        <p><input type="hidden" name="id" value="${title}"></p>
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`
                );

                response.writeHead(200);
                response.end(html);
            });
        });
    }
    else if (pathname === '/update_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            fs.rename(`./data/${id}`, `./data/${title}`, (err) => {  // 파일명 id -> title로 바꾸기
                fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
                    response.writeHead(302, { location: `/?id=${title}` });  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                    response.end('sucess');
                })
            });
        })
    }
    else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`./data/${filteredId}`, (err) => {
                response.writeHead(302, { location: `/` });  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                response.end('sucess');
            })
        })
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }

});
app.listen(3000);