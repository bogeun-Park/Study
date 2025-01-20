var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
const { describe } = require('pm2');

function templateHTML(title, list, body, control) {
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
}

function templateList(filelist) {
    var list = '<ul>';
    filelist.forEach(file => {
        list += `<li><a href="/?id=${file}">${file}</a></li>`
    });
    list += '</ul>';

    return list;

    // for (var i = 0; i < filelist.length; i++)
    //     list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;    
}

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams; 
    var pathname = new URL('http://localhost:3000' + _url).pathname;
    
    console.log(new URL('http://localhost:3000' + _url + '\t'));

    var title, items, template, list;
    if(pathname === '/') {
        if (queryData.get('id') === null) {
            fs.readdir('./data', (err, filelist) => {
                list = templateList(filelist);
                title = 'Welcome';
                description = 'Hello, Node.js!';
                template = templateHTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">Create</a>`
                );

                response.writeHead(200);
                response.end(template);
            }) ;
        }
        else {
            fs.readdir('./data', (err, filelist) => {
                fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
                    list = templateList(filelist);
                    title = queryData.get('id');
                    template = templateHTML(title, list, 
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`
                    );

                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else if(pathname === '/create') {
        fs.readdir('./data', (err, filelist) => {
            list = templateList(filelist);
            title = 'WEB - create';
            template = templateHTML(title, list, `
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
            response.end(template);
        });
    }
    else if(pathname === '/create_process') {
        var body = '';
        request.on('data', (data) => {
            body += data;
        })

        request.on('end', () => {
            var post = qs.parse(body);
            title = post.title;
            description = post.description;

            fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, {location: `/?id=${title}`});  // 302 = 현재 페이지를 옮긴다(리다이렉션)
                response.end('sucess');
            })
        })
    }
    else if(pathname === '/update') {
        fs.readdir('./data', (err, filelist) => {
            fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
                list = templateList(filelist);
                title = queryData.get('id');
                
                template = templateHTML(title, list,
                    `
                    <form action="/update_process" method="post">
                        <p><input type="text" name="id" value="${title}"></p>
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
                response.end(template);
            });
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);