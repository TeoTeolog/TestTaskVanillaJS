const http = require("http");
const cors = require('cors')

const host = 'localhost';
const PORT = 8000

const fs = require("fs");
const contents = fs.readFileSync("content.json");
const jsonContent = JSON.parse(contents);

jsonContent.forEach(element => console.log(element.name))

const books = JSON.stringify([
    { title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { title: "The Prophet", author: "Kahlil Gibran", year: 1923 }
]);

const requestListener = function (req, res) {
    let body='';
    switch (req.method){
        case 'OPTIONS':
            res.writeHead(200, {
                'Access-Control-Allow-Methods' : '*',
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Allow-Origin' : '*'
            });
            break;
        case 'POST':
            res.writeHead(200, {
                'Access-Control-Allow-Origin' : '*'
            });
            body = books;
            break;
        case 'GET':
            res.writeHead(200, {
                'Access-Control-Allow-Origin' : '*'
            });
            body = contents
            break;
        default:
            console.log('Fuck')
    }
    res.end(body);
};

const server = http.createServer(requestListener);
server.listen(PORT, host, () => {
    console.log(`Server is running on http://${host}:${PORT}`);
});