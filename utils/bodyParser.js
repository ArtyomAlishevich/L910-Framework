const bodyParser = () => {
    return async (req, res, next) => {
        if (!['POST', 'PUT', 'PATCH'].includes(req.method)) {
            req.body = {};
            return next();
        }

        const parseBody = () => {
            return new Promise((resolve) => {
                const chunks = [];
                const nodeReq = req.req || req;
                
                nodeReq.on('data', chunk => {
                    chunks.push(chunk);
                });
                
                nodeReq.on('end', () => {
                    if (chunks.length === 0) {
                        req.body = {};
                        return resolve();
                    }
                    
                    try {
                        const bodyString = Buffer.concat(chunks).toString('utf8');
                        if (!bodyString.trim()) {
                            req.body = {};
                        } else {
                            req.body = JSON.parse(bodyString);
                        }
                        resolve();
                    } catch (error) {
                        console.error('Ошибка обработки тела: ', error);
                        req.body = {};
                        resolve();
                    }
                });
                
                nodeReq.on('error', (error) => {
                    console.error('Ошибка запроса: ', error);
                    req.body = {};
                    resolve();
                });
            });
        };

        await parseBody();
        next();
    };
};

module.exports = bodyParser;