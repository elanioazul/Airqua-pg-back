import { Router}  from 'express'
const router = Router();

import {getMeteoStations, getMeteoStationbyId} from '../controllers/stationsMeteo.controllers'

// /api/v1/airstations
router.get('/', getMeteoStations);
router.get('/:id', getMeteoStationbyId);

export default router;