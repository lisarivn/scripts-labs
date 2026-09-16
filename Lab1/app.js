import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello World');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;