import Router from 'express'
const router = Router();

import {getMeteoDataByStation } from '../controllers/dataMeteo.controllers';

// /api/v1/airdata
router.get('/station/:stationid', getMeteoDataByStation);



export default router;