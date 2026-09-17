import request from 'supertest';
import app from './app.js';

describe('Test the root path', () => {
    test('It should respond to the GET method', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World');
    });
});

describe('Test the health path', () => {
    test('It should return health status', async () => {
        const response = await request(app).get('/health');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});