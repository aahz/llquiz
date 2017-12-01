module.exports = function (params) {
    return (
`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${params.title}</title>
    </head>
    <body>
        <pre>Cannot GET ${params.path}</pre>
    </body>
</html>
`
    );
};