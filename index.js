const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';

const port = 8080;

const server = http.createServer((request, response) => {
    console.log('request was made: ' + request.url)
    response.writeHead(200, {'Content-Type': 'text/html'});

    if (request.url === '/') {
        console.log(request.url)
        let myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
        myReadStream.pipe(response);
    } else if (request.method === 'POST' && request.url === '/message') {
        let body = '';
        // converts buffer to a string
        request.on('data', chunk => {
            body += chunk.toString();
        });
        
        request.on('end', () => {
            console.log(body);
            // after conversion we get 'message=WhateverTextWasInputted', why meesage? because we named the input field as 'message'

            // so in order to get the actual value, we replace 'message=' with an empty string
            let message = body.replace("message=", "");

            fs.appendFile('message.txt', message, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            response.end('Messaged saved!')
        })
    } else {
        response.write('<h1>404 - PAGE NOT FOUND</h1>')
        response.end();
    }
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
