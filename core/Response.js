class Response {
    constructor(res) {
        this.res = res;
        this.statusCode = 200;
        this.headers = {};
        this.hasSent = false;
    }

    status(code) {
        if (!this.hasSent) {
            this.statusCode = code;
        }
        return this;
    }

    setHeader(name, value) {
        if (!this.hasSent) {
            this.headers[name] = value;
        }
        return this;
    }

    send(data) {
        if (this.hasSent) {
            console.warn('Попытка отправить отвте несколько раз');
            return;
        }
        
        this.hasSent = true;
        
        const headers = { ...this.headers };
        
        if (typeof data === 'object' && data !== null) {
            headers['Content-Type'] = 'application/json';
            data = JSON.stringify(data, null, 2);
        } else if (!headers['Content-Type']) {
            headers['Content-Type'] = 'text/plain; charset=utf-8';
        }
        
        try {
            this.res.writeHead(this.statusCode, headers);
            this.res.end(data);
        } catch (error) {
            console.error('Error sending response:', error);
        }
    }

    json(data) {
        this.setHeader('Content-Type', 'application/json');
        return this.send(data);
    }
}

module.exports = Response;