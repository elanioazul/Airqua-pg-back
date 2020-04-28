import { Router } from 'express'
const router = Router();

import {getAirStations, getAirStationbyId } from '../controllers/stationsAir.controllers'

// /api/v1/airstations
router.get('/', getAirStations);
router.get('/:id', getAirStationbyId);


export default router;