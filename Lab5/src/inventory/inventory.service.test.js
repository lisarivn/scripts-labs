import { jest } from '@jest/globals';
import { InventoryService } from './inventory.service.js';

describe('InventoryService', () => {
    let repository;
    let service;

    beforeEach(() => {
        repository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };

        service = new InventoryService(repository);
    });

    test('повертає товари з репозиторію', async () => {
        const items = [
            {
                name: 'Монітор',
                quantity: 5,
                price: 5000
            }
        ];

        repository.findAll.mockResolvedValue(items);

        await expect(service.getItems())
            .resolves.toEqual(items);

        expect(repository.findAll)
            .toHaveBeenCalledTimes(1);
    });

    test('повертає товар за id', async () => {
        const item = {
            _id: '68d8a1234567890123456789',
            name: 'Монітор',
            quantity: 5,
            price: 5000
        };

        repository.findById.mockResolvedValue(item);

        await expect(
            service.getItemById(item._id)
        ).resolves.toEqual(item);

        expect(repository.findById)
            .toHaveBeenCalledWith(item._id);
    });

    test('повертає 404, якщо товар не знайдено', async () => {
        repository.findById.mockResolvedValue(null);

        await expect(
            service.getItemById('68d8a1234567890123456789')
        ).rejects.toMatchObject({
            statusCode: 404
        });

        expect(repository.findById)
            .toHaveBeenCalledTimes(1);
    });

    test('створює валідний товар', async () => {
        const item = {
            name: 'Клавіатура',
            quantity: 10,
            price: 1500
        };

        repository.create.mockResolvedValue(item);

        await expect(service.createItem(item))
            .resolves.toEqual(item);

        expect(repository.create)
            .toHaveBeenCalledWith(item);
    });

    test('відхиляє некоректні дані', async () => {
        await expect(
            service.createItem({
                name: '',
                quantity: -1,
                price: 0
            })
        ).rejects.toMatchObject({
            statusCode: 400
        });

        await expect(
            service.createItem({
                name: 'Миша',
                quantity: null,
                price: null
            })
        ).rejects.toMatchObject({
            statusCode: 400
        });

        await expect(
            service.createItem()
        ).rejects.toMatchObject({
            statusCode: 400
        });

        expect(repository.create)
            .not.toHaveBeenCalled();
    });
});