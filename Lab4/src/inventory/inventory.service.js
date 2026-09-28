import inventoryRepository from './inventory.repository.js';

export class InventoryService {
    constructor(repository = inventoryRepository) {
        this.repository = repository;
    }

    getItems() {
        return this.repository.findAll();
    }

    async createItem(data = {}) {
        const name = typeof data.name === 'string'
            ? data.name.trim()
            : '';

        const { quantity, price } = data;

        const isInvalid = !name
            || typeof quantity !== 'number'
            || !Number.isInteger(quantity)
            || quantity < 0
            || typeof price !== 'number'
            || !Number.isFinite(price)
            || price < 0;

        if (isInvalid) {
            const error = new Error('Некоректні дані товару');
            error.statusCode = 400;
            throw error;
        }

        return this.repository.create({
            name,
            quantity,
            price
        });
    }
}

export default new InventoryService();