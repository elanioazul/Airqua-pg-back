import Router from 'express';
const router = Router();

import {getAllPoints, createPoint, getPointsByUserForMap, getPointsByUserForTable, createPointByUser, updatePointByUser, deletePointByUser} from '../controllers/dataCollected.controllers';



///api/v1/datacollected
router.get('/', getAllPoints);
router.post('/', createPoint);

///api/v1/datacollected/user
router.get('/formap/:userid', getPointsByUserForMap)
router.get('/fortable/:userid', getPointsByUserForTable)
router.post('/:userid', createPointByUser)

///api/v1/datacollected/id/user
router.put('/:id/:userid', updatePointByUser)
router.delete('/:id/:userid', deletePointByUser)





export default router;