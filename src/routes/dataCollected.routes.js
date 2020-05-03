import Router from 'express';
const router = Router();

import verifyAuth from '../helpers/verifyAuth'

import { 
    getAllPoints, 
    createPoint, 
    getPointsByUserForMap, 
    getPointsByUserForTable, 
    createPointByUser,
    createPointByUserALTERNATIVE, 
    updatePointByUser,
    updatePointByUserALTERNATIVE, 
    deletePointByUser,
    deletePointByUserALTERNATIVE
} from '../controllers/dataCollected.controllers';



///api/v1/datacollected
router.get('/', getAllPoints);
router.post('/', verifyAuth, createPoint);

///api/v1/datacollected/user
router.get('/formap/:userid', verifyAuth, getPointsByUserForMap)
router.get('/fortable/:userid', verifyAuth, getPointsByUserForTable)
router.post('/:userid', verifyAuth, createPointByUser)

///api/v1/datacollected/id/user
router.put('/:id/:userid', updatePointByUser)
router.delete('/:id/:userid', verifyAuth, deletePointByUser)





export default router;