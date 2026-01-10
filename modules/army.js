const FileHandler = require('../utils/fileHandler');
const bodyParser = require('../utils/bodyParser');

module.exports = (app) => {
    const armyFileHandler = new FileHandler('data');
    const soldiersPath = 'soldiers.json';

    app.use(bodyParser());

    app.get('/soldiers', async (req, res) => {
        try {
            const soldiers = await armyFileHandler.getAll(soldiersPath);
            res.status(200).json({ data: soldiers });
        } catch(error) {
            console.error('Ошибка при получении всех солдат: ', error);
            res.status(500).json({error: 'Ошибка при получении списка солдат: ' + error});
        }
    });

    app.get('/soldiers/:id', async (req, res) => {
        try {
            const soldierId = req.params.id;
            const soldier = await armyFileHandler.getById(soldiersPath, soldierId);

            if (!soldier) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующего солдата' });
            }

            res.status(200).json(soldier);
        } catch (error) {
            console.error('Ошибка при получении солдата по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении данных солдата: ' + error });
        }
    });

    app.post('/soldiers', async (req, res) => {
        try {
            let soldierData = req.body;

            if (!soldierData || Object.keys(soldierData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать запись о солдате с пустым телом запроса' });
            }

            const newSoldier = await armyFileHandler.create(soldiersPath, soldierData);

            res.status(201).json({ soldier: newSoldier });
        } catch (error) {
            console.error('Ошибка при создании записи о солдате: ', error);
            res.status(500).json({ error: 'Ошибка при регистрации солдата: ' + error});
        }
    });

    app.put('/soldiers/:id', async (req, res) => {
        try {
            const soldierId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления данных солдата с пустым телом' })
            }

            const updatedSoldier = await armyFileHandler.update(soldiersPath, soldierId, updates);

            if (!updatedSoldier) {
                return res.status(404).json({ error: 'Попытка обновления несуществующего солдата' });
            }

            res.status(200).json({ soldier: updatedSoldier });
        } catch (error) {
            console.error('Ошибка при обновлении данных солдата: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении информации о солдате: ' + error});
        }
    });

    app.patch('/soldiers/:id', async (req, res) => {
        try {
            const soldierId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления данных солдата без тела запроса' });
            }

            const updatedSoldier = await armyFileHandler.update(soldiersPath, soldierId, updates);

            if (!updatedSoldier) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующего солдата' });
            }

            res.status(200).json({ soldier: updatedSoldier });
        } catch (error) {
            console.error('Ошибка при частичном обновлении данных солдата: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении информации о солдате: ' + error});
        }
    });

    app.delete('/soldiers/:id', async (req, res) => {
        try {
            const soldierId = req.params.id;
            const isDeleted = await armyFileHandler.delete(soldiersPath, soldierId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующего солдата' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении записи о солдате: ', error);
            res.status(500).json({ error: 'Ошибка при удалении солдата из списка: ' + error });
        }
    });

    const missionsPath = 'missions.json';

    app.get('/missions', async (req, res) => {
        try {
            const missions = armyFileHandler.getAll(missionsPath);
            res.status(200).json({ data: missions });
        } catch (error) {
            console.error('Ошибка при получении всех миссий: ', error);
            res.status(500).json({ error: 'Ошибка при получении списка миссий: ' + error});
        }
    });

    app.get('/missions/:id', async (req, res) => {
        try {
            const missionId = req.params.id;
            const mission = await armyFileHandler.getById(missionsPath, missionId);

            if (!mission) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующей миссии' });
            }

            res.status(200).json(mission);
        } catch (error) {
            console.error('Ошибка при получении миссии по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении данных миссии: ' + error });
        }
    });

    app.post('/missions', async (req, res) => {
        try {
            let missionData = req.body;

            if (!missionData || Object.keys(missionData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать миссию с пустым телом запроса' });
            }

            const newMission = await armyFileHandler.create(missionsPath, missionData);

            res.status(201).json({ mission: newMission });
        } catch (error) {
            console.error('Ошибка при создании миссии: ', error);
            res.status(500).json({ error: 'Ошибка при создании новой миссии: ' + error});
        }
    });

    app.put('/missions/:id', async (req, res) => {
        try {
            const missionId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления миссии с пустым телом' })
            }

            const updatedMission = await armyFileHandler.update(missionsPath, missionId, updates);

            if (!updatedMission) {
                return res.status(404).json({ error: 'Попытка обновления несуществующей миссии' });
            }

            res.status(200).json({ mission: updatedMission });
        } catch (error) {
            console.error('Ошибка при обновлении миссии: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении информации о миссии: ' + error});
        }
    });

    app.patch('/missions/:id', async (req, res) => {
        try {
            const missionId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления миссии без тела запроса' });
            }

            const updatedMission = await armyFileHandler.update(missionsPath, missionId, updates);

            if (!updatedMission) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующей миссии' });
            }

            res.status(200).json({ mission: updatedMission });
        } catch (error) {
            console.error('Ошибка при частичном обновлении миссии: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении информации о миссии: ' + error});
        }
    });

    app.delete('/missions/:id', async (req, res) => {
        try {
            const missionId = req.params.id;
            const isDeleted = await armyFileHandler.delete(missionsPath, missionId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующей миссии' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении миссии: ', error);
            res.status(500).json({ error: 'Ошибка при удалении миссии: ' + error });
        }
    });
}