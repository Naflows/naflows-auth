"use strict";
exports.__esModule = true;
exports.serve = void 0;
var fs = require("fs");
var path = require("path");
function serve(title, style, stc, res, parameters) {
    var assetsPath = path.join(__dirname, "../styles/");
    var stylesheetContent;
    var staticContentPath = path.join(__dirname, "../static/");
    var fileContent;
    if (!fs.existsSync(assetsPath)) {
        console.error('Stylesheet not found:', assetsPath);
        return res.status(404).send('Stylesheet not found');
    }
    else {
        console.log('Stylesheet found:', assetsPath);
        stylesheetContent = fs.readFileSync(assetsPath + style, 'utf8');
        fileContent = fs.readFileSync(staticContentPath + stc, 'utf8');
    }
    if (parameters) {
        fileContent = fileContent.replace(/{{(\w+)}}/g, function (match, key) {
            return parameters[key] || '';
        });
    }
    return res.send("\n        <!DOCTYPE html>\n        <html>\n        <head>\n            <title>" + title + "</title>\n            <style>\n                " + stylesheetContent + "\n            </style>\n            <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n            <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n            <link\n                href=\"https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap\"\n                rel=\"stylesheet\">\n        </head>\n        " + fileContent + "\n      \n        \n    ");
}
exports.serve = serve;
