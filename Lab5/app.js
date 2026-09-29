import express from 'express';
import cors from 'cors';
import inventoryRouter from './src/inventory/inventory.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/inventory', inventoryRouter);

// Централізована обробка помилок
app.use((error, req, res, next) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode === 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500
            ? 'Внутрішня помилка сервера'
            : error.message,
    });
});

export default app;