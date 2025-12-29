class Response {
    constructor(res) {
        this.res = res;
        this.statusCode = 200;
        this.headers = {};
    }

    status(code) {
        this.statusCode = code;
        return this;
    }

    setHeader(name, value) {
        this.res.setHeader(name, value);
        return this;
    }

    send(data) {
        this.res.writeHead(this.statusCode, {
            'Content-Type' : 'text/plain',
            ...this.headers
        });

        if (typeof data === 'object') {
            this.res.end(JSON.stringify(data));
        } else {
            this.res.end(data);
        }
    }

    json(data) {
        this.setHeader('Content-Type', 'application/json');
        this.send(data);
    }
}

module.exports = Response;