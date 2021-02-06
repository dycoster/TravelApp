// from https://knowledge.udacity.com/questions/336147
// Setup Server
const app = require('./server.js')
const port = 3030;

const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}