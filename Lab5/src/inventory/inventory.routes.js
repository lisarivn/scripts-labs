import { Router } from 'express';
import {
    createItem,
    getItems,
    getItemById,
    getStats
} from './inventory.controller.js';

const router = Router();

router.get('/', getItems);
router.post('/', createItem);
router.get('/stats', getStats);
router.get('/:id', getItemById);

export default router;