import Student,{validateStudent} from '../model/student.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import cloudinary from '../utils/cloudinary.js'
import { imageUpload } from '../helpers/ImageUpload.js'
import * as xlsx from 'xlsx';
import _ from 'lodash';
import moment from 'moment';
import cloudinary from '../utils/cloudinary.js';


// admin add a student
const addStudent=async(req,res)=>{
  try { 
 
    let payload=req.body

     let cryptPass= await  bcrypt.hash(payload.password,10) 
  
    // const {error}=validateStudent(payload)

    const regNo=await Student.findOne({$or:[{regimentNo:payload.regimentNo},{email:payload.email},{mobileNo:payload.mobileNo}]})
    
    if(regNo) return res.send("Regiment Number or Email or Mobile Number must be unique")

    // else if(error) return res.send(error.details[0].message);

  
    else{
    
      // sample date 2023-01-05T00:00:00.000Z
       
      let {secure_url,public_id}=payload.image

      payload.password=cryptPass
      payload.image={
        profile_img:secure_url,
        cloudinary_id:public_id
      }
      payload.bankDetails={
        holdername:payload.holdername,
        accNo:payload.accNo,
        bankName:payload.bankName,
        branch:payload.branch,
        ifscCode:payload.ifscCode
      }

      payload.batch=new Date(payload.batch)
      payload.dob=new Date(payload.dob);
      payload.dateOfEnroll=new Date(payload.dateOfEnroll)

   

      // console.log("payload: " ,payload)
  //     let addData=await Student.create(payload)
     
  if(addData)  return res.json({
    message:"Cadet Information successfully added",
    data:addData,
    status:res.statusCode
  })

  }
  } catch (error) {
    return res.json({
      message:error.message,
      
    })
  }
}

//add profile image
const addProfileImage=async(req,res)=>{
  try { 
 
    
    const { path } = req.file;
    const uploadimage =await imageUpload(path)

    console.log("upload Image",uploadimage);

    
     
  res.json({

    message:"Cadet Information successfully added",
    data:uploadimage,
    status:200
  })

  
  } catch (error) {
    return res.send({
      err:error.message,
      status:400
    })
  }
}


//admin update student profile image in cloudinary and db
const updateStudent=async(req,res)=>{

 try {
    let payload=req.body

  let user=await Student.findOne({regimentNo:req.query.regimentNo})
  if(!user) return res.send('user not found')
 


let result=await Student.findOneAndUpdate({regimentNo:req.query.regimentNo},{$set:payload},{new:true})
if(result){
  return res.json({
    message:"Cadet Information successfully updated",
    data:result
  })
}
return res.json({
  message:"Unknown error occurred while updating cadet information",
  data:result
})
    
  
 } catch (error) {
  res.status(400).send(error.message)
 }

}

const updateProfileImg=async(req,res)=>{
  try {
    const {path}=req.file
    let regNo=req.query.regimentNo
    let user=await Student.findOne({regimentNo:regNo})
  
    if(!user) return res.json({
      message:"User doesn't Exist"
    })

  //delete image cloud
 await cloudinary.v2.uploader.destroy(user.image.cloudinary_id);
 //insert image cloud
   const upload = await imageUpload(path)

 let result=await Student.findOneAndUpdate({regimentNo:regNo},{
  $set:{image:{
   profile_img:upload.secure_url,
   cloudinary_id:upload.public_id
  }
 }},{new:true})

  if(result){
    return res.json({
       message:"Image successfully updated",
       data:result
    })
  }
  return res.json({
    message:"Error while updating image",
    data:result
 })
 

  } catch (error) {
    res.status(400).send(error.message)
  }
}


//admin view all student data
const viewAll=async(req,res)=>{
  let {match='{}',project="{}"}=req.query
  match=JSON.parse(match)
  match.status=true
  
  try{

    const view=await Student.find(match,JSON.parse(project)).populate('camp')
    res.send(view)
 
  }catch(error){
    res.status(400).send(error.message)
  }
}




//student login with their email /password  provided by admin
const loginUsers=async(req,res)=>{
  try {
    // console.log( req.body.email);
    let userData=await Student.findOne({email:req.body.email}).populate('camp');
   
    if (!userData) {
        return res.status(400).send("email Not found")
    }
    let validpassword =await bcrypt.compare(req.body.password,userData.password)
   if(!validpassword) {
    return res.status(400).send("Not a valid password")
   }
   const id=userData._id
   const isStudent=userData.isStudent
  const token =await jwt.sign({id:id,isStudent:isStudent},process.env.JWTKEY);

  res.header('auth',token).send({
    message:'Logged in successfully',
    token:token,
    data:userData
  })
} catch (error) {
    res.status(400).send(error.message)
}
}


//student update their password
const updatePassword=async(req,res)=>{
  try {
    
    let payload=req.body

    let student=await Student.findOne({_id:req.user.id})
    // console.log(student.password)
    let stuPwd=student.password
    
    
    if(payload.new_pass!==payload.confirm_pass) return res.status(400).json({message:"Password Missmatch"})

    let hash=await bcrypt.hash(payload.new_pass,10);

    let update=await Student.findOneAndUpdate({_id:req.user.id},{$set:{password:hash}},{new:true})
    res.status(200).json({message:"Password changed Successfuly"})
    
} catch (error) {
    res.status(400).send(error.message)
}
}


//admin delete a student data from db

const deleteStudent=async(req,res)=>{
  try {
    let student=await Student.findOne({regimentNo:req.params.regimentNo})

    let user = await Student.findOne({_id:student._id});
    if(!user) return res.send('no user found')

     
    let deleeImage= await cloudinary.v2.uploader.destroy(user?.image?.cloudinary_id)
    
      await Student.updateOne({_id:student._id},{$set:{
        status:false
      }});

      res.json({
        message:`${req.params.regimentNo} data deleted successfully`
       }); 

  } catch (error) {
    res.status(400).send(error.message)
  }
}

//student view their profile only
const ViewProfile=async(req,res)=>{
  try {
    let result=await Student.findById({_id:req.user.id}).populate('camp')
    return res.status(200).send(result)
  } catch (error) {
    res.status(400).send(error.message)
  }
}
 

const UploadFile=async(req,res)=>{
  try {
 

    const file  = req.file;

    console.log("File",file);
    
            const readFile = xlsx.read(file.buffer, {
                type: 'buffer',
                cellDates: true,
                cellText: false,
            });

            let arr=[]

         let mapdata=_.map(readFile.Sheets, async (sheet) => {

            
            
                const conSheet = xlsx.utils.sheet_to_json(sheet, {
                    raw: false,
                });
               
                const mapData = _.map(conSheet, async (value) => {
                    let obj = {};
                    obj=value
                      const {holdername,accNo,branch,bankName,ifscCode,password}=value
                   
                      let cryptPass= await  bcrypt.hash(password,10) 

                    obj.bankDetails={
                      holdername:holdername,
                      accNo:accNo,
                      branch:branch,
                      bankName:bankName,
                      ifscCode:ifscCode
                    }
                    let newObj= _.omit(obj, ["holdername","accNo","branch","bankName","ifscCode"])
                  

                    newObj.image=null
                    newObj.password=cryptPass

                    // console.log("newobj",newObj);
                   
                    arr.push(...arr,newObj);
                    let result=await Student.create(newObj)
                    
                    if(result){
                      return res.json({
                        message:"Cadets details uploaded successfully",
                        data:arr
                      })
                    }
                    else{
                      return res.json({
                        message:"Error While  upload cadet details",
                        
                      })
                    }

                  

                });

            });

           

           
            if(arr.length>0){
              console.log("if",arr);
              let result=await Student.insertMany(arr)
              if(result.length>0){
                return res.json({
                  message:"Cadets details uploaded successfully",
                  data:arr
                })
              }
              else{
                return res.json({
                  message:"Error While  upload cadet details",
                  
                })
              }
            }

          
  } catch (error) {
    res.status(400).send(error.message)
  }
}

export {addStudent,addProfileImage,updateStudent,viewAll,updatePassword,loginUsers,deleteStudent,ViewProfile,updateProfileImg,UploadFile}



