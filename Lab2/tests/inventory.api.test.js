import request from 'supertest';
import app from '../app.js';

describe('Inventory API', () => {
    test('GET /api/inventory повертає список товарів', async () => {
        const response = await request(app).get('/api/inventory');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/inventory/:id повертає товар за id', async () => {
        const listResponse = await request(app).get('/api/inventory');
        const item = listResponse.body.data[0];

        const response = await request(app)
            .get(`/api/inventory/${item.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(item.id);
    });

    test('GET /api/inventory/:id повертає 404 для невідомого id', async () => {
        const response = await request(app)
            .get('/api/inventory/non-existing-id');

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test('POST /api/inventory створює товар', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({ name: 'Клавіатура', quantity: 50 });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Клавіатура');
        expect(response.body.data.quantity).toBe(50);
    });

    test('POST /api/inventory відхиляє відсутню кількість', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({ name: 'Миша' });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test('POST /api/inventory відхиляє null-значення', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({ name: 'Миша', quantity: null });

        expect(response.statusCode).toBe(400);
    });

    test('POST /api/inventory без тіла не повертає помилку 500', async () => {
        const response = await request(app).post('/api/inventory');

        expect(response.statusCode).toBe(400);
    });
});