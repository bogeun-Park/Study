var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const { describe } = require('pm2');

var template = {  // 함수를 담은 객체(함수를 리펙토링화 시킴)
    html: (title, list, body, control) => {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `
    },
    list: (filelist) => {
        var list = '<ul>';
        filelist.forEach(file => {
            list += `<li><a href="/?id=${file}">${file}</a></li>`
        });
        list += '</ul>';

        return list;

        // for (var i = 0; i < filelist.length; i++)
        //     list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
}

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
                fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
                    var title = queryData.get('id');
                    var list = template.list(filelist);
                    var html = template.html(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">Create</a>
                         <a href="/update?id=${title}">Update</a>
                         <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
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
            fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
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

            fs.unlink(`./data/${id}`, (err) => {
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