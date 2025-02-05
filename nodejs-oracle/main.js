var http = require('http');
var initDB = require('./lib/initDB.js');
var topic = require('./lib/topic.js');
var author = require('./lib/author.js');

var app = http.createServer(async function (request, response) {
    var connection = await initDB();
    var _url = request.url;
    var queryData = new URL('http://localhost:3000' + _url).searchParams;
    var pathname = new URL('http://localhost:3000' + _url).pathname;

    console.log(new URL('http://localhost:3000' + _url));

    if (pathname === '/') {
        if (queryData.get('id') === null) {
            topic.home(request, response, connection);
        } else {
            topic.page(request, response, connection);
        }
    } else if (pathname === '/create') {
        topic.create(request, response, connection);
    } else if (pathname === '/create_process') {
        topic.create_process(request, response, connection);
    } else if (pathname === '/update') {
        topic.update(request, response, connection);
    } else if (pathname === '/update_process') {
        topic.update_process(request, response, connection);
    } else if (pathname === '/delete_process') {
        topic.delete_process(request, response, connection);
    } else if (pathname === '/author') {
        author.home(request, response, connection);
    } else if (pathname === '/author/create_process') {
        author.create_process(request, response, connection);
    } else if (pathname === '/author/update') {
        author.update(request, response, connection);
    } else if (pathname === '/author/update_process') {
        author.update_process(request, response, connection);
    } else if (pathname === '/author/delete_process') {
        author.delete_process(request, response, connection);
    } else {
        response.writeHead(404);
        response.end('Not found');
    }

});

app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
});