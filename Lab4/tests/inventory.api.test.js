import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import { connectDB } from '../src/config/database.js';
import InventoryItem from '../src/inventory/inventory.model.js';

beforeAll(async () => {
    await connectDB(
        'mongodb://127.0.0.1:27017/inventory_test_db'
    );
});

beforeEach(async () => {
    await InventoryItem.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Inventory API', () => {
    test('GET /api/inventory повертає список товарів', async () => {
        const response = await request(app)
            .get('/api/inventory');

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/inventory/:id повертає товар за id', async () => {
        const item = await InventoryItem.create({
            name: 'Монітор',
            quantity: 5,
            price: 5000
        });

        const response = await request(app)
            .get(`/api/inventory/${item._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Монітор');
        expect(response.body.data.quantity).toBe(5);
        expect(response.body.data.price).toBe(5000);
    });

    test('GET /api/inventory/:id повертає 404 для невідомого id', async () => {
        const unknownId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/inventory/${unknownId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Товар не знайдено');
    });

    test('GET /api/inventory/:id повертає 404 для некоректного id', async () => {
        const response = await request(app)
            .get('/api/inventory/abc');

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Товар не знайдено');
    });

    test('POST /api/inventory створює товар', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({
                name: 'Клавіатура',
                quantity: 50,
                price: 1500
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe('Клавіатура');
        expect(response.body.data.quantity).toBe(50);
        expect(response.body.data.price).toBe(1500);
    });

    test('POST /api/inventory відхиляє null-значення', async () => {
        const response = await request(app)
            .post('/api/inventory')
            .send({
                name: 'Миша',
                quantity: null,
                price: null
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
});