
const app = require('../app');
const port = process.env.PORT || '3001';
const http = require('http');


app.set('port', port);
const server = http.createServer(app);
server.listen(port);
