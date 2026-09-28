import InventoryItem from './inventory.model.js';

class InventoryRepository {
    findAll() {
        return InventoryItem.find({});
    }

    create(itemData) {
        return InventoryItem.create(itemData);
    }
}

export default new InventoryRepository();