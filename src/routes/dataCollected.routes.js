import Router from 'express';
const router = Router();

import {getAllPoints, createPoint, getPointsByUserForMap, getPointsByUserForTable, updatePoint} from '../controllers/dataCollected.controllers';


///api/v1/datacollected
router.get('/', getAllPoints);
router.post('/', createPoint);

///api/v1/datacollected/id


//fetch data filtered by user
router.get('/:userid', getPointsByUserForMap)
//¿cómo diferenciar la ruta????
router.get('/:userid', getPointsByUserForTable)



router.put('/:id', updatePoint)


export default router;