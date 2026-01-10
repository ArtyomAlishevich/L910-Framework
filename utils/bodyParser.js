const bodyParser = () => {
    return async (req, res, next) => {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks = [];
            
            const nodeReq = req.req || req;
            
            const contentType = req.headers['content-type'];
            if (!contentType || !contentType.includes('application/json')) {
                req.setBody({});
                return next();
            }

            nodeReq.on('data', chunk => {
                chunks.push(chunk);
            });

            nodeReq.on('end', () => {
                try {
                    if (chunks.length === 0) {
                        req.setBody({});
                        return next();
                    }
                    
                    const body = Buffer.concat(chunks).toString('utf-8');
                    
                    if (body.trim() === '') {
                        req.setBody({});
                        return next();
                    }
                    
                    const parsedBody = JSON.parse(body);
                    req.setBody(parsedBody);
                    next();
                } catch (error) {
                    console.error('Ошибка парсинга JSON:', error.message);
                    req.setBody({});
                    next();
                }
            });

            nodeReq.on('error', (error) => {
                console.error('Ошибка чтения тела запроса:', error);
                req.setBody({});
                next();
            });

            if (nodeReq.complete) {
                req.setBody({});
                next();
            }
        } else {
            req.setBody({});
            next();
        }
    };
};

module.exports = bodyParser;