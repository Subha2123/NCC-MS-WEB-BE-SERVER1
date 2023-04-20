
import Admin,{validateAdmin} from '../model/admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import env from 'dotenv/config'

const adminReg=async(req,res)=>{
    const saltRounds=10;
    const cryptPass= await  bcrypt.hash(req.body.password,saltRounds)
    
        var add={
            name:req.body.name,
            email:req.body.email,
            password:cryptPass,
            }  
          
    const {error}=validateAdmin(req.body)
    try {
        if(error) return res.status(400).send(error.details[0].message);

        const getLen=await Admin.find().count()
        if(getLen!==0) return res.status(400).send("This is only for Admin")

        var insert=await Admin.insertMany([add])
        res.send(insert)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
}


const adminLogin=async(req,res)=>{
    const email=req.body.email
    const pwd=req.body.password
    try {
        const adminLog=await Admin.findOne({email:email},{})//find all user using and condition
        // console.log(logUser.password);
    
        if (adminLog) {
          const bhash=await  bcrypt.compare(pwd, adminLog.password).then(function(result) {
                if(result) {
                    const token=jwt.sign({id:adminLog._id,isAdmin:adminLog.isAdmin},process.env.JWTKEY)
                    return res.header('auth',token).send({
                        message:"Logged in successfully",
                        token:token,
                        data:adminLog
                    })
                }
                else{return res.status(401).send("Invalid Password")}     
            });
           
        }
        if(!adminLog){
            return res.status(401).send("Invalid Email")
        }
        
    } catch (error) {
        res.status(400).send(error.message)
    }

}

export {adminReg,adminLogin}