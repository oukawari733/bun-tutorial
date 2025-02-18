export class Router {
    constructor() {
        this.routes = [];
    }

    addRoute(path, handlers, options = { method: 'GET' }) {
        this.routes.push({
            path,
            handlers: Array.isArray(handlers) ? handlers : [handlers],
            method: options.method,
        });
    }

    handleRequest(req, res) {
        const url = new URL(req.url, `https://${req.headers.host}`);
        const route = this.routes.find(r => r.path === url.pathname && r.method === req.method);

        if (route) {
            const handlers = route.handlers; // Array of middleware/handlers
            let index = 0;

            const next = () => {
                if (index < handlers.length) {
                    const handler = handlers[index++];
                    handler(req, res, next); // Pass `next` to the handler
                }
            };

            next(); // Start executing the middleware chain
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Not Found' }));
        }
    }
}
