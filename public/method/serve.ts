import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

export function serve(title: string, style: string, stc: string, res: Response, parameters?: any) {

    const assetsPath = path.join(__dirname, '../styles/');
    let stylesheetContent: string;
    const staticContentPath = path.join(__dirname, '../static/');
    let fileContent: string;
    if (!fs.existsSync(assetsPath)) {
        return res.status(404).send('Stylesheet not found');
    } else if (!fs.existsSync(staticContentPath)) {
        return res.status(404).send('Static content not found');
    } else {
        stylesheetContent = fs.readFileSync(path.join(assetsPath, style), 'utf8');
        fileContent = fs.readFileSync(path.join(staticContentPath, stc), 'utf8');
    }

    if (parameters) {
        fileContent = fileContent.replace(/{{(\w+)}}/g, (match, key) => {
            return parameters[key] || '';
        });
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                ${stylesheetContent}
            </style>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link
                href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
                rel="stylesheet">
        </head>
        <body>
        ${fileContent}
        </body>
        </html>
    `);
}