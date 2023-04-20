import express from 'express'
import{loginUsers,updatePassword,ViewProfile} from '../controller/student.js'
import auth from '../middleware/auth.js'
import student from '../middleware/student.js'



const router=express.Router()

router.post('/login',loginUsers)

router.post('/change-password',[auth,student],updatePassword)

router.get('/profile',[auth,student],ViewProfile)



export default router


