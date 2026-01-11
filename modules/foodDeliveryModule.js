const FileHandler = require('../utils/fileHandler');
const bodyParser = require('../utils/bodyParser');

module.exports = (app) => {
    const deliveryFileHandler = new FileHandler('data');
    const clientsPath = 'clients.json';

    app.use(bodyParser());

    app.get('/clients', async (req, res) => {
        try {
            const clients = await deliveryFileHandler.getAll(clientsPath);
            res.status(200).json({ data: clients });
        } catch(error) {
            console.error('Ошибка при получении всех клиентов: ', error);
            res.status(500).json({error: 'Ошибка при получении клиентов: ' + error});
        }
    });

    app.get('/clients/:id', async (req, res) => {
        try {
            const clientId = req.params.id;
            const client = await deliveryFileHandler.getById(clientsPath, clientId);

            if (!client) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующего клиента' });
            }

            res.status(200).json(client);
        } catch (error) {
            console.error('Ошибка при получении клиента по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении клиента по id: ' + error });
        }
    });

    app.post('/clients', async (req, res) => {
        try {
            let clientData = req.body;

            if (!clientData || Object.keys(clientData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать клиента с пустым телом запроса' });
            }

            const newClient = await deliveryFileHandler.create(clientsPath, clientData);

            res.status(201).json({ client: newClient });
        } catch (error) {
            console.error('Ошибка при создании клиента: ', error);
            res.status(500).json({ error: 'Ошибка при создании клиента: ' + error});
        }
    });

    app.put('/clients/:id', async (req, res) => {
        try {
            const clientId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления клиента с пустым телом' })
            }

            const updatedClient = await deliveryFileHandler.update(clientsPath, clientId, updates);

            if (!updatedClient) {
                return res.status(404).json({ error: 'Попытка обновления несуществующего клиента' });
            }

            res.status(200).json({ client: updatedClient });
        } catch (error) {
            console.error('Ошибка при обновлении клиента: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении клиента: ' + error});
        }
    });

    app.patch('/clients/:id', async (req, res) => {
        try {
            const clientId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления клиента без тела запроса' });
            }

            const updatedClient = await deliveryFileHandler.update(clientsPath, clientId, updates);

            if (!updatedClient) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующего клиента' });
            }

            res.status(200).json({ client: updatedClient });
        } catch (error) {
            console.error('Ошибка при частичном обновлении клиента: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении клиента: ' + error});
        }
    });

    app.delete('/clients/:id', async (req, res) => {
        try {
            const clientId = req.params.id;
            const isDeleted = await deliveryFileHandler.delete(clientsPath, clientId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующего клиента' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении клиента: ', error);
            res.status(500).json({ error: 'Ошибка при удалении клиента: ' + error });
        }
    });


    const deliveriesPath = 'deliveries.json';


    app.get('/deliveries', async (req, res) => {
        try {
            const deliveries = await deliveryFileHandler.getAll(deliveriesPath);
            res.status(200).json({ data: deliveries });
        } catch (error) {
            console.error('Ошибка при получении всех заказов: ', error);
            res.status(500).json({ error: 'Ошибка при получении всех заказов: ' + error});
        }
    });

    app.get('/deliveries/:id', async (req, res) => {
        try {
            const deliveryId = req.params.id;
            const delivery = await deliveryFileHandler.getById(deliveriesPath, deliveryId);

            if (!delivery) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующего заказа' });
            }

            res.status(200).json(delivery);
        } catch (error) {
            console.error('Ошибка при получении заказа по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении заказа по id: ' + error });
        }
    });

    app.post('/deliveries', async (req, res) => {
        try {
            let deliveryData = req.body;

            if (!deliveryData || Object.keys(deliveryData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать заказ с пустым телом запроса' });
            }

            const newDelivery = await deliveryFileHandler.create(deliveriesPath, deliveryData);

            res.status(201).json({ delivery: newDelivery });
        } catch (error) {
            console.error('Ошибка при создании заказа: ', error);
            res.status(500).json({ error: 'Ошибка при создании заказа: ' + error});
        }
    });

    app.put('/deliveries/:id', async (req, res) => {
        try {
            const deliveryId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления заказа с пустым телом' })
            }

            const updatedDelivery = await deliveryFileHandler.update(deliveriesPath, deliveryId, updates);

            if (!updatedDelivery) {
                return res.status(404).json({ error: 'Попытка обновления несуществующего заказа' });
            }

            res.status(200).json({ delivery: updatedDelivery });
        } catch (error) {
            console.error('Ошибка при обновлении заказа: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении заказа: ' + error});
        }
    });

    app.patch('/deliveries/:id', async (req, res) => {
        try {
            const deliveryId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления заказа без тела запроса' });
            }

            const updatedDelivery = await deliveryFileHandler.update(deliveriesPath, deliveryId, updates);

            if (!updatedDelivery) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующего заказа' });
            }

            res.status(200).json({ delivery: updatedDelivery });
        } catch (error) {
            console.error('Ошибка при частичном обновлении заказа: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении заказа: ' + error});
        }
    });

    app.delete('/deliveries/:id', async (req, res) => {
        try {
            const deliveryId = req.params.id;
            const isDeleted = await deliveryFileHandler.delete(deliveriesPath, deliveryId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующего заказа' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении заказа: ', error);
            res.status(500).json({ error: 'Ошибка при удалении заказа: ' + error });
        }
    });
}
