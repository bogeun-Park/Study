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
    list: function(filelist) {
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

