import express from 'express'
import { adminReg,adminLogin } from '../controller/admin.js'
import {addStudent,updateStudent,viewAll,deleteStudent,updateProfileImg, UploadFile, addProfileImage} from '../controller/student.js'


import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../utils/multer.js'
import uploadXlsx from '../utils/xlsx.js'


const router=express.Router()

//admin register/login
router.post('/register',adminReg)

router.post('/login',adminLogin)

//admin manage student data

router.post('/addStudent',addStudent)

router.post('/uploadProfile',upload.single('file'),addProfileImage)

router.patch('/updateStudent',updateStudent)

router.post('/update/image',[auth,admin],upload.single('image'),updateProfileImg)

// router.get('/view/:regimentNo',viewStudent)

router.get('/viewStudent',viewAll)

router.delete('/deleteStudent/:regimentNo',deleteStudent)

router.post('/fileUpload',uploadXlsx.single("file"),UploadFile)

export default router

