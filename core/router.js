class Router {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: []
        }
    }

    addRoute(method, path, handlers) {
        const paramNames = [];
        const regexPath = path.replace(/\/:(\w+)/g, (_, paramName) => {
            paramNames.push(paramName);
            return '/([^/]+)';
        });

        const regex = new RegExp(`^${regexPath}$`);
        
        this.routes[method].push({
            path,
            regex,
            paramNames,
            handlers
        });
    }

    get(path, handlers) {
        this.addRoute('GET', path, handlers);
    }

    post(path, handlers) {
        this.addRoute('POST', path, handlers);
    }

    put(path, handlers) {
        this.addRoute('PUT', path, handlers);
    }

    patch(path, handlers) {
        this.addRoute('PATCH', path, handlers);
    }

    delete(path, handlers) {
        this.addRoute('DELETE', path, handlers);
    }

    findRoute(method, url) {
        const routes = this.routes[method] || [];
        
        for (const route of routes) {
            const match = url.match(route.regex);
            
            if (match) {
                const params = {};
                
                route.paramNames.forEach((paramName, index) => {
                    params[paramName] = match[index + 1];
                });
                
                return {
                    handlers: route.handlers,
                    params
                };
            }
        }
        
        return null;
    }
}

module.exports = Router;