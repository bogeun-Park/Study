module.exports = {  // 함수를 담은 객체(함수를 리펙토링화 시킴)
    html: function(title, list, body, control) {
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
    list: function(topics) {
        var list = '<ul>';
        topics.forEach(topic => {
            list += `<li><a href="/?id=${topic.ID}">${topic.TITLE}</a></li>`
        });
        list += '</ul>';

        return list;

        // for (var i = 0; i < topics.length; i++)
        //     list += `<li><a href="?id=${topics[i]}">${topics[i]}</a></li>`;
    },
    authorSelect: function(authors, author_id) {
        var tag = '';
        for(var i=0; i<authors.length; i++) {
            var selected = '';
            if(authors[i].ID === author_id){
                selected = ' selected';
            }

            tag += `<option value="${authors[i].ID}"${selected}>${authors[i].NAME}</option>`
        }

        return `
            <select name="author">
                ${tag}
            </select>
        `
    }
}

