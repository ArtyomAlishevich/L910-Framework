const http = require('http');
const EventEmitter = require('events');
const Router = require('./router');
const Request = require('./request');
const Response = require('./response');

class Application extends EventEmitter {
    constructor() {
        super();
        this.router = new Router();
        this.middleware = [];
        this.settings = {};
    }

    use(middleware) {
        if (typeof middleware === 'function') {
            this.middleware.push(middleware);
        }
        else if (typeof middleware === 'string' && arguments[1]) {
            const staticMiddleware = arguments[1];
            this.middleware.push((req, res, next) => {
                if (req.url.startsWith(middleware)) {
                    staticMiddleware(req, res, next);
                } else {
                    next();
                }
            });
        }
        return this;
    }

    get(path, ...handlers) {
        this.router.get(path, handlers);
        return this;
    }

    post(path, ...handlers) {
        this.router.post(path, handlers);
        return this;
    }

    put(path, ...handlers) {
        this.router.put(path, handlers);
        return this;
    }

    patch(path, ...handlers) {
        this.router.patch(path, handlers);
        return this;
    }

    delete(path, ...handlers) {
        this.router.delete(path, handlers);
        return this;
    }

    listen(port, callback) {
        const server = http.createServer(async (req, res) => {
            const request = new Request(req);
            const response = new Response(res);

            try {
                await this.applyMiddleware(request, response);

                const route = this.router.findRoute(request.method, request.url);

                if (route) {
                    request.params = route.params;
                    await this.executeHandlers(route.handlers, request, response);
                } else {
                    response.status(404).json({ error: 'Route not found' });
                }
            }
            catch (error) {
                console.error('Application error:', error);
                
                if (!response.hasSent) {
                    try {
                        this.emit('error', error, request, response);
                        response.status(500).json({ 
                            error: 'Internal Server Error',
                            message: error.message 
                        });
                    } catch (responseError) {
                        console.error('Failed to send error response:', responseError);
                        if (!res.headersSent) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                        }
                    }
                }
            }
        });

        server.on('error', (error) => {
            console.error('Server error:', error);
            this.emit('error', error);
        });

        server.on('clientError', (error, socket) => {
            console.error('Client error:', error);
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });

        server.listen(port, callback);
        return server;
    }

    async applyMiddleware(req, res) {
        let idx = 0;
        const next = async () => {
            if (idx < this.middleware.length) {
                const middleware = this.middleware[idx++];
                try {
                    await middleware(req, res, next);
                } catch (error) {
                    console.error('Middleware error:', error);
                    throw error;
                }
            }
        };
        await next();
    }

    async executeHandlers(handlers, req, res) {
        let idx = 0;
        const next = async () => {
            if (idx < handlers.length) {
                const handler = handlers[idx++];
                try {
                    await handler(req, res, next);
                } catch (error) {
                    console.error('Handler error:', error);
                    throw error;
                }
            }
        };
        await next();
    }

    set(key, value) {
        this.settings[key] = value;
        return this;
    }
}

module.exports = Application;