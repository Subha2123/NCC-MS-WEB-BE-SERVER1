import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import admin from './route/admin.js'
import student from './route/student.js'
import event from './route/event.js'


const app = express();
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });
app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Methods', 'POST,PUT,DELETE GET, OPTIONS');
           next();
     });
app.use('/api/admin',admin)
app.use('/api/student',student)
// app.use('/api/admin',event)


try {
    // mongoose.connect('mongodb://localhost:27017/NccManage')
    mongoose.connect('mongodb+srv://Subhashini:subhashini@cluster0.yrxfb3a.mongodb.net/NCCManagement?retryWrites=true&w=majority')
    console.log('db is connected') 
} catch (error) {
    console.log(error.message)
}

const port=process.env.PORT || 2000
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})

