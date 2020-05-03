import { Router } from 'express'
const router = Router();

import { 
    getUsers, 
    getUserbyId, 
    createUser, 
    updateUserTotal, 
    deleteUser, 
    siginUser, 
    searchUsername 
} from '../controllers/users.controllers'


//PRIMARY ROUTES

// /api/v1/users/auth/signup
router.post('/auth/signup', createUser)
// /api/v1/users/auth/signin
router.post('/auth/signin', siginUser)
// /api/v1/users/username
router.get('/username/:username', searchUsername);
// /api/v1/users/id
router.delete('/:id', deleteUser);



//SECONDARY ROUTES

// /api/v1/users
router.get('/', getUsers);
// /api/v1/users/id
router.get('/:id', getUserbyId);
router.put('/:id', updateUserTotal);


export default router;