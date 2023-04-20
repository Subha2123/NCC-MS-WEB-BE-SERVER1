import mongoose from 'mongoose';
import Joi from 'joi'

const campSchema={
     cadet_regimentNo:{
        type:String,
        required:true
     },
      cadet_name:{
        type:String,
        required:true
      },
      camp_name:{
        type:String,
        required:true
      },
      camp_place:{
        type:String,
        required:true
      },
      start_date:{
        type:Date,
        required:true
      },
      end_date:{
        type:Date,
        required:true
      },
      camp_type:{
        type:String,
        required:true,
        enum:['National','State']
      },
      imageName:{
        type:String,
        required:true
      },
      camp_img:{
        type:String,
        required:true,
      } ,
      cloudinary_id:{
        type:String,
        required:true,
      },  
      
}


const Camp=mongoose.model('Camp',campSchema)

const validateCamp=(camp)=>{
  const schema=Joi.object({
    cadet_regimentNo:Joi.string(),
    cadet_name:Joi.string(),
    camp_name:Joi.string().required(),
    camp_place:Joi.string().required(),
    start_date:Joi.date().raw().required(),
    end_date:Joi.date().raw().required(),
    camp_type:Joi.string().required(),
    imageName:Joi.string().required(),
    camp_img:Joi.string(),
    cloudinary_id:Joi.string(),
  }).options({ allowUnknown: true });

  return schema.validate(camp)
}

export {validateCamp}
export default Camp