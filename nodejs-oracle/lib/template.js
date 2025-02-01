var sanitizeHtml = require('sanitize-html');

module.exports = {  // 함수를 담은 객체(함수를 리펙토링화 시킴)
    html: function(title, list, body, control) {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${sanitizeHtml(title)}</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB</a></h1>
                <a href="/author">author</a>
                ${list}
                ${control}
                ${body}
            </body>
            </html>
        `
    },
    list: function(topics) {
        var list = '<ul>';
        topics.forEach(topic => {
            list += `<li><a href="/?id=${topic.ID}">${sanitizeHtml(topic.TITLE)}</a></li>`
        });
        list += '</ul>';

        return list;
    },
    authorSelect: function(authors, author_id) {
        var tag = '';
        for(var i=0; i<authors.length; i++) {
            var selected = '';
            if(authors[i].ID === author_id){
                selected = ' selected';
            }

            tag += `<option value="${authors[i].ID}"${sanitizeHtml(selected)}>${sanitizeHtml(authors[i].NAME)}</option>`
        }

        return `
            <select name="author">
                ${tag}
            </select>
        `
    },
    authorTable: function(authors) {
        var tag = '<table>';
        for(var i=0; i<authors.length; i++) {
            tag += `
                <tr>
                    <td>${sanitizeHtml(authors[i].NAME)}</td>
                    <td>${sanitizeHtml(authors[i].PROFILE)}</td>
                    <td><a href="/author/update?id=${authors[i].ID}">update</a></td>
                    <td>
                        <form action="/author/delete_process" method="post">
                            <input type="hidden" name="id" value="${authors[i].ID}">
                            <input type="submit" value="Delete">
                        </form>
                    </td>
                </tr>
            `
        }
        tag += '</table>'

        return tag;
    }
}