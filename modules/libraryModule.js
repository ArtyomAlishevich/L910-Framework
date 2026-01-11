const FileHandler = require('../utils/fileHandler');
const bodyParser = require('../utils/bodyParser');

module.exports = (app) => {
    const libraryFileHandler = new FileHandler('data');
    const readersPath = 'readers.json';
    app.use(bodyParser());
    app.get('/readers', async (req, res) => {
        try {
            const readers = await libraryFileHandler.getAll(readersPath);
            res.status(200).json({ data: readers });
        } catch(error) {
            console.error('Ошибка при получении всех читателей: ', error);
            res.status(500).json({error: 'Ошибка при получении читателей: ' + error});
        }
    });
    app.get('/readers/:id', async (req, res) => {
        try {
            const readerId = req.params.id;
            const reader = await libraryFileHandler.getById(readersPath, readerId);
            if (!reader) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующего читателя' });
            }
            res.status(200).json(reader);
        } catch (error) {
            console.error('Ошибка при получении читателя по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении читателя по id: ' + error });
        }
    });
    app.post('/readers', async (req, res) => {
        try {
            let readerData = req.body;

            if (!readerData || Object.keys(readerData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать читателя с пустым телом запроса' });
            }

            const newReader = await libraryFileHandler.create(readersPath, readerData);

            res.status(201).json({ reader: newReader });
        } catch (error) {
            console.error('Ошибка при создании читателя: ', error);
            res.status(500).json({ error: 'Ошибка при создании читателя: ' + error});
        }
    });

    app.put('/readers/:id', async (req, res) => {
        try {
            const readerId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления читателя с пустым телом' })
            }

            const updatedReader = await libraryFileHandler.update(readersPath, readerId, updates);

            if (!updatedReader) {
                return res.status(404).json({ error: 'Попытка обновления несуществующего читателя' });
            }

            res.status(200).json({ reader: updatedReader });
        } catch (error) {
            console.error('Ошибка при обновлении читателя: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении читателя: ' + error});
        }
    });

    app.patch('/readers/:id', async (req, res) => {
        try {
            const readerId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления читателя без тела запроса' });
            }

            const updatedReader = await libraryFileHandler.update(readersPath, readerId, updates);

            if (!updatedReader) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующего читателя' });
            }

            res.status(200).json({ reader: updatedReader });
        } catch (error) {
            console.error('Ошибка при частичном обновлении читателя: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении читателя: ' + error});
        }
    });

    app.delete('/readers/:id', async (req, res) => {
        try {
            const readerId = req.params.id;
            const isDeleted = await libraryFileHandler.delete(readersPath, readerId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующего читателя' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении читателя: ', error);
            res.status(500).json({ error: 'Ошибка при удалении читателя: ' + error });
        }
    });
    const booksPath = 'books.json';
    app.get('/books', async (req, res) => {
        try {
            const books = await libraryFileHandler.getAll(booksPath);
            res.status(200).json({ data: books });
        } catch (error) {
            console.error('Ошибка при получении всех книг: ', error);
            res.status(500).json({ error: 'Ошибка при получении всех книг: ' + error});
        }
    });

    app.get('/books/:id', async (req, res) => {
        try {
            const bookId = req.params.id;
            const book = await libraryFileHandler.getById(booksPath, bookId);

            if (!book) {
                return res.status(404).json({ error : 'Попытка получения по id несуществующей книги' });
            }

            res.status(200).json(book);
        } catch (error) {
            console.error('Ошибка при получении книги по id: ', error);
            res.status(500).json({ error: 'Ошибка при получении книги по id: ' + error });
        }
    });

    app.post('/books', async (req, res) => {
        try {
            let bookData = req.body;

            if (!bookData || Object.keys(bookData).length === 0) {
                return res.status(400).json({ error: 'Попытка создать книгу с пустым телом запроса' });
            }

            const newBook = await libraryFileHandler.create(booksPath, bookData);

            res.status(201).json({ book: newBook });
        } catch (error) {
            console.error('Ошибка при создании книги: ', error);
            res.status(500).json({ error: 'Ошибка при создании книги: ' + error});
        }
    });

    app.put('/books/:id', async (req, res) => {
        try {
            const bookId = req.params.id;
            const updates = req.body;
            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка обновления книги с пустым телом' })
            }
            const updatedBook = await libraryFileHandler.update(booksPath, bookId, updates);
            if (!updatedBook) {
                return res.status(404).json({ error: 'Попытка обновления несуществующей книги' });
            }
            res.status(200).json({ book: updatedBook });
        } catch (error) {
            console.error('Ошибка при обновлении книги: ', error);
            res.status(500).json({ error: 'Ошибка при обновлении книги: ' + error});
        }
    });
    app.patch('/books/:id', async (req, res) => {
        try {
            const bookId = req.params.id;
            const updates = req.body;

            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ error: 'Попытка частичного обновления книги без тела запроса' });
            }

            const updatedBook = await libraryFileHandler.update(booksPath, bookId, updates);

            if (!updatedBook) {
                return res.status(404).json({ error: 'Попытка частичного обновления несуществующей книги' });
            }

            res.status(200).json({ book: updatedBook });
        } catch (error) {
            console.error('Ошибка при частичном обновлении книги: ', error);
            res.status(500).json({ error: 'Ошибка при частичном обновлении книги: ' + error});
        }
    });
    app.delete('/books/:id', async (req, res) => {
        try {
            const bookId = req.params.id;
            const isDeleted = await libraryFileHandler.delete(booksPath, bookId);

            if (!isDeleted) {
                return res.status(404).json({ error: 'Попытка удаления несуществующей книги' });
            }

            res.status(204).send();
        } catch (error) {
            console.error('Ошибка при удалении книги: ', error);
            res.status(500).json({ error: 'Ошибка при удалении книги: ' + error });
        }
    });
}