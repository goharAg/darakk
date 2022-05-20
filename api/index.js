require('dotenv').config();
const server = require('./app/server');

const port = process.env.PORT || 5000;

server.listen(port, () => console.log('Server running and listening to port: ', port));
