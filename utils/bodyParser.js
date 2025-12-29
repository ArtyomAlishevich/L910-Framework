const bodyParser = () => {
    return async (req, res, next) => {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chuncks = [];

            req.on('data', chunck => {
                chuncks.push(chunck);
            });

            req.on('end', () => {
                const body = Buffer.concat(chuncks).toString();

                if(req.headers['content-type'] === 'application/json') {
                    try {
                        req.setBody(JSON.parse(body));
                    }
                    catch(error) {
                        req.setBody({});
                    }
                }
                else {
                    req.setBody({raw: body});
                }

                next();
            });

            req.on('error', (error) => {
                console.error('Ошибка парсинга тела: ', error);
                req.setBody({});
                next();
            });
        } else {
            next();
        }
    };
};

module.exports = bodyParser;