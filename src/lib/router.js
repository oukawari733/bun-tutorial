export class Router {
    constructor() {
        this.routes = {};
    }

    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    handleRequest(req, res) {
        const { url } = req;
        const handler = this.routes[url];

        if (handler) {
            handler(req, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
}
