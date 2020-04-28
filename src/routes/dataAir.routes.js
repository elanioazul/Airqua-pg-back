import { Router } from 'express'
const router = Router();

import { getAirDataByStation } from '../controllers/dataAir.controllers';

// /api/v1/airdata
router.get('/station/:stationid', getAirDataByStation);



export default router;