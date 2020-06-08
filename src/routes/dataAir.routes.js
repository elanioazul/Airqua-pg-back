import { Router } from 'express'
const router = Router();

import { getAirDataByStation } from '../controllers/dataAir.controllers';

// /api/v1/airdata
router.post('/station/:stationid', getAirDataByStation);



export default router;