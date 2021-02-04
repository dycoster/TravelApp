// Setup Server
const port = 3030;

const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}