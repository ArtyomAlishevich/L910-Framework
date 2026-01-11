const bodyParser = () => {
    return (req, res, next) => {
        const readBody = () => {
            return new Promise((resolve) => {
                if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
                    req.body = {};
                    return resolve();
                }
                
                const contentType = req.headers['content-type'];
                if (!contentType || !contentType.includes('application/json')) {
                    req.body = {};
                    return resolve();
                }
                
                let data = '';
                
                req.req.on('data', (chunk) => {
                    data += chunk.toString('utf8');
                });
                
                req.req.on('end', () => {
                    try {
                        req.body = data.trim() ? JSON.parse(data) : {};
                    } catch (error) {
                        console.error('BodyParser Error:', error.message);
                        req.body = {};
                    }
                    resolve();
                });
                
                req.req.on('error', () => {
                    req.body = {};
                    resolve();
                });
            });
        };
        
        readBody().then(() => next());
    };
};

module.exports = bodyParser;