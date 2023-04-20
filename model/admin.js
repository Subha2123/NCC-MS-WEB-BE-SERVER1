import mongoose from 'mongoose'
import Joi from 'joi'

const adminSchema={
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:true
    }
    
}


const Admin=mongoose.model('Admin',adminSchema)

const validateAdmin = (value) => {
    const schema = Joi.object({
      name:Joi.string(),
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().required().min(3),
    
    });
    const result = schema.validate(value)
  
    return result  
  };

export default Admin
export {validateAdmin}
