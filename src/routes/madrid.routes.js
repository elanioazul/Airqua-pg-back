import { Router } from 'express'
const router = Router();

import {getAirStations, getAirStationInfoById } from '../controllers/madrid.controllers'

// /api/vi/airstations
router.get('/', getAirStations);
router.get('/:id', getAirStationInfoById);

export default router;