"use strict";
exports.__esModule = true;
exports.serve = void 0;
var fs = require("fs");
var path = require("path");
function serve(title, style, stc, res, parameters) {
    var assetsPath = path.join(__dirname, '../styles/');
    var stylesheetContent;
    var staticContentPath = path.join(__dirname, '../static/');
    var fileContent;
    if (!fs.existsSync(assetsPath)) {
        return res.status(404).send('Stylesheet not found');
    }
    else if (!fs.existsSync(staticContentPath)) {
        return res.status(404).send('Static content not found');
    }
    else {
        stylesheetContent = fs.readFileSync(path.join(assetsPath, style), 'utf8');
        fileContent = fs.readFileSync(path.join(staticContentPath, stc), 'utf8');
    }
    if (parameters) {
        fileContent = fileContent.replace(/{{(\w+)}}/g, function (match, key) {
            return parameters[key] || '';
        });
    }
    res.send("\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <title>" + title + "</title>\n            <style>\n                " + stylesheetContent + "\n            </style>\n            <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n            <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n            <link\n                href=\"https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap\"\n                rel=\"stylesheet\">\n        </head>\n        <body>\n        " + fileContent + "\n        </body>\n        </html>\n    ");
}
exports.serve = serve;
