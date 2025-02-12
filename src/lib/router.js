export class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(path, handler, options = { method: 'GET' }) {
        this.routes.push({ path, handler, method: options.method });
    }

    handleRequest(req, res) {
        const url = new URL(req.url, `https://${req.headers.host}`);
        const route = this.routes.find(r => r.path === url.pathname && r.method === req.method);

        if (route) {
            route.handler(req, res);
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    }
}
