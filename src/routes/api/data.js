export function dataHandler(req, res) {
    const data = {
        message: 'Hello from the API!',
        timestamp: new Date().toISOString(),
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
