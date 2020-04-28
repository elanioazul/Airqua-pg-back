import { Router } from 'express'
const router = Router();

import { getUsers, getUserbyId, createUser, updateUser, deleteUser } from '../controllers/users.controllers'

// /api/v1/users
router.get('/', getUsers);
router.post('/', createUser);


// /api/v1/users/id
router.get('/:id', getUserbyId);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;