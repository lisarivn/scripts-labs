import mongoose from 'mongoose';
import InventoryItem from './inventory.model.js';

class InventoryRepository {
    findAll() {
        return InventoryItem.find({});
    }

    findById(id) {
        if (!mongoose.isValidObjectId(id)) {
            return null;
        }

        return InventoryItem.findById(id);
    }

    create(itemData) {
        return InventoryItem.create(itemData);
    }

    async getStats() {
        const [stats] = await InventoryItem.aggregate([
            {
                $group: {
                    _id: null,
                    productCount: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalValue: {
                        $sum: {
                            $multiply: ['$price', '$quantity']
                        }
                    },
                    outOfStockCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$quantity', 0] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ]);

        return stats ?? {
            productCount: 0,
            totalQuantity: 0,
            totalValue: 0,
            outOfStockCount: 0
        };
    }
}

export default new InventoryRepository();