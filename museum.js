const path = require('path');
const fs = require('fs');
const FileHandler = require('../utils/fileHandler');
const bodyParser = require('../utils/bodyParser');
const { error } = require('console');

module.exports = (app) => {
    const museumFileHandler = new FileHandler('data');
    const visitorsPath = 'visitors.json';

    app.use(bodyParser());

    app.get('/visitors', async (req, res) => {
        try {
            const visitors = await museumFileHandler.getAll(visitorsPath);
            res.status(200).json({ data: visitors });
        } catch(error) {
            console.error('Ошибка при получении всех посетителей: ', error);
            res.status(500).json({error: 'Ошибка при получении посетителей: ' + error});
        }
    });

    app.get('/visitors/:id', async (req, res) => {
        try {
            const visitorId = req.params.id;
            const visitor = await museumFileHandler.getById(visitorsPath, visitorId);

            if (!visitor) {
                return res.status(404).json({ error : 'Посетитель с таким id не найден' });
            }

            res.status(200).json(visitor);
        } catch (error) {
            console.error('Ошибка при получении посетителя по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении посетителя по id: ' + error });
        }
    });

    app.post('/visitors', async (req, res) => {
        try {
            let visitorData = req.body;

            if (!visitorData || Object.keys(visitorData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать посетителя с пустым телом запроса' });
            }

            const newVisitor = await museumFileHandler.create(visitorsPath, visitorData);

            res.status(201).json({ visitor: newVisitor });
        } catch (error) {
            console.error('Ошибка при создании посетителя: ', error);
            res.status(500).json({ error: 'Ошибка при создании посетителя: ' + error});
        }
    });

    app.put('/visitors/:id', async (req, res) => {
        try {
            const visitorId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления посетителя с пустым телом' })
            }

            const updatedVisitor = await museumFileHandler.update(visitorsPath, visitorId, updates);

            if (!updatedVisitor) {
                return res.status(404).json({ error: 'Посетитель не найден' });
            }

            res.status(200).json({ visitor: updatedVisitor });
        } catch (error) {
            console.error('Ошибка при обновлении посетителя: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении посетителя: ' + error});
        }
    });

    app.patch('/visitors/:id', async (req, res) => {
        try {
            const visitorId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления посетителя без тела запроса' });
            }

            const updatedVisitor = await museumFileHandler.update(visitorsPath, visitorId, updates);

            if (!updatedVisitor) {
                return res.status(404).json({ error: 'Посетитель не найден' });
            }

            res.status(200).json({ visitor: updatedVisitor });
        } catch (error) {
            console.error('Ошибка при частичном обновлении посетителя: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении посетителя: ' + error});
        }
    });

    app.delete('/visitors/:id', async (req, res) => {
        try {
            const visitorId = req.params.id;
            const isDeleted = await museumFileHandler.delete(visitorsPath, visitorId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Посетитель не найден' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении посетителя: ', error);
            res.status(500).json({ error: 'Ошибка при удалении посетителя: ' + error });
        }
    });

    const exhibitsPath = 'exhibits.json';

    app.get('/exhibits', async (req, res) => {
        try {
            const exhibits = await museumFileHandler.getAll(exhibitsPath);
            res.status(200).json({ data: exhibits });
        } catch (error) {
            console.error('Ошибка при получении всех экспонатов: ', error);
            res.status(500).json({ error: 'Ошибка при получении экспонатов: ' + error});
        }
    });

    app.get('/exhibits/:id', async (req, res) => {
        try {
            const exhibitId = req.params.id;
            const exhibit = await museumFileHandler.getById(exhibitsPath, exhibitId);

            if (!exhibit) {
                return res.status(404).json({ error : 'Экспонат с таким id не найден' });
            }

            res.status(200).json(exhibit);
        } catch (error) {
            console.error('Ошибка при получении экспоната по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении экспоната по id: ' + error });
        }
    });

    app.post('/exhibits', async (req, res) => {
        try {
            let exhibitData = req.body;

            if (!exhibitData || Object.keys(exhibitData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать экспонат с пустым телом запроса' });
            }

            const newExhibit = await museumFileHandler.create(exhibitsPath, exhibitData);

            res.status(201).json({ exhibit: newExhibit });
        } catch (error) {
            console.error('Ошибка при создании экспоната: ', error);
            res.status(500).json({ error: 'Ошибка при создании экспоната: ' + error});
        }
    });

    app.put('/exhibits/:id', async (req, res) => {
        try {
            const exhibitId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления экспоната с пустым телом' })
            }

            const updatedExhibit = await museumFileHandler.update(exhibitsPath, exhibitId, updates);

            if (!updatedExhibit) {
                return res.status(404).json({ error: 'Экспонат не найден' });
            }

            res.status(200).json({ exhibit: updatedExhibit });
        } catch (error) {
            console.error('Ошибка при обновлении экспоната: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении экспоната: ' + error});
        }
    });

    app.patch('/exhibits/:id', async (req, res) => {
        try {
            const exhibitId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления экспоната без тела запроса' });
            }

            const updatedExhibit = await museumFileHandler.update(exhibitsPath, exhibitId, updates);

            if (!updatedExhibit) {
                return res.status(404).json({ error: 'Экспонат не найден' });
            }

            res.status(200).json({ exhibit: updatedExhibit });
        } catch (error) {
            console.error('Ошибка при частичном обновлении экспоната: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении экспоната: ' + error});
        }
    });

    app.delete('/exhibits/:id', async (req, res) => {
        try {
            const exhibitId = req.params.id;
            const isDeleted = await museumFileHandler.delete(exhibitsPath, exhibitId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Экспонат не найден' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении экспоната: ', error);
            res.status(500).json({ error: 'Ошибка при удалении экспоната: ' + error });
        }
    });
}
