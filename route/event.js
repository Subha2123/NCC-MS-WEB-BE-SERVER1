import express from 'express'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../utils/multer.js'

import {addEvent,viewEvent,allEvent,updateEvent,eventDate} from '../controller/event.js'
import { addCamp,referCamp, updateCamp ,campDate,dateFilter,otherFilter} from '../controller/camp.js'


const router=express.Router()

//add events

router.post('/event/add',[auth,admin],upload.single('image'),addEvent)

router.get('/event/view',[auth,admin],viewEvent)

router.get('/event/all',[auth,admin],allEvent)

router.put('/update/event',[auth,admin],upload.single('image'),updateEvent)

// router.get('/event/date',[auth,admin],dateWise)

router.get('/event/between',[auth,admin],eventDate)

//add camps

router.post('/camp/add',[auth,admin],upload.single('image'),addCamp)

router.post('/camp/refer',[auth,admin],referCamp)

router.put('/update/camp',[auth,admin],upload.single('image'),updateCamp)

router.get('/camp/between',[auth,admin],campDate)

router.get('/camp/date',[auth,admin],dateFilter)

router.get('/camp/other',[auth,admin],otherFilter)

export default router