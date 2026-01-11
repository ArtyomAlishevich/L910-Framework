const Application = require('./core/application');
const armyModule = require('./modules/army');
const museumModule = require('./modules/museum');
const foodDeliveryModule = require('./modules/foodDeliveryModule');
const libraryMode = require('./modules/libraryModule');

const app = new Application();
armyModule(app);
foodDeliveryModule(app);
museumModule(app);
libraryMode(app);

app.on('error', (error, req, res) => {
    console.error('Application Error:', error);
    res.status(500).send('Internal Server Error');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер слушает порт ${PORT}`);
});