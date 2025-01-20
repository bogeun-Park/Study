var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams; 
    var pathname = new URL('http://localhost:3000' + _url).pathname;
    
    console.log('\n\n');
    console.log(new URL('http://localhost:3000' + _url));

    if(pathname === '/') {
        var title, items, template;
        var list = '';
        if (queryData.get('id') === null) {
            fs.readdir('./data', (err, filelist) => {
                for(var i=0; i<filelist.length; i++) 
                    list += `<li><a href="?id=${filelist[i]}">${filelist[i]}</a></li>`;

                title = 'Welcome';
                description = 'Hello, Node.js!';
                template = `
                    <!doctype html>
                    <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
                        <ul>${list}</ul>
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                    </html>
                `
                response.writeHead(200);
                response.end(template);
            }) ;
        }
        else {
            fs.readdir('./data', (err, filelist) => {
                filelist.forEach(file => {
                    list += `<li><a href="?id=${file}">${file}</a></li>`
                });

                fs.readFile(`data/${queryData.get('id')}`, 'utf-8', (err, description) => {
                    title = queryData.get('id');
                    template = `
                        <!doctype html>
                        <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <h1><a href="/">WEB</a></h1>
                            <ul>${list}</ul>
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </body>
                        </html>
                    `
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
    
});
app.listen(3000);