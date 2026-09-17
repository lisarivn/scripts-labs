import express from 'express';
import inventoryRouter from './src/inventory/inventory.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/inventory', inventoryRouter);

export default app;