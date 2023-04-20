import cloudinary from '../utils/cloudinary.js'
import fs from 'fs'


const imageUpload=async(path)=>{
    return await cloudinary.v2.uploader.upload(
        path,
        {
          public_id: `${Date.now()}`, 
          resource_type: "auto"
        },
        (err, result) => {
          if (err) return err
  
          fs.unlinkSync(path);
          
        }
      );
}


export {imageUpload} 