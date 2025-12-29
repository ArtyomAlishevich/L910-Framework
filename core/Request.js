const url = require('url');
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
        const parsedUrl = url.parse(this.url);
        this.path = parsedUrl.pathname;

        if (parsedUrl.query) {
            this.query = querystring.parse(parsedUrl.query);
        }
    }

    setBody(body) {
        this.body = body;
    }
}

module.exports = Request;