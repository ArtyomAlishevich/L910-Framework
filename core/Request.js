const querystring = require('querystring');

class Request {
    constructor(req) {
        this.req = req;
        this.url = req.url;
        this.method = req.method;
        this.headers = req.headers;
        this.params = {};
        this.query = {};
        this.body = {};

        this.parseUrl();
    }

    parseUrl() {
        try {
            const urlObj = new URL(this.url, `http://${this.headers.host || 'localhost'}`);
            this.path = urlObj.pathname;
            
            this.query = {};
            urlObj.searchParams.forEach((value, key) => {
                this.query[key] = value;
            });
        } catch (error) {
            const queryIndex = this.url.indexOf('?');
            if (queryIndex !== -1) {
                this.path = this.url.substring(0, queryIndex);
                const queryString = this.url.substring(queryIndex + 1);
                this.query = querystring.parse(queryString);
            } else {
                this.path = this.url;
                this.query = {};
            }
        }
    }

    setBody(body) {
        this.body = body;
    }
}

module.exports = Request;