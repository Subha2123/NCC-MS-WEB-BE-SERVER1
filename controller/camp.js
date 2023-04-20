import Camp,{validateCamp} from '../model/camp.js'
// import cloudinary1 from '../cloudinary1.js'
import Student from '../model/student.js'

// import cloudinary from '../utils/cloudinary.js'

const addCamp=async(req,res)=>{
try{
   const {error}=validateCamp(req.body)
   const regNo=await Student.findOne({regimentNo:req.body.regimentNo})
   if(!regNo) return res.send("There is no cadet in this regiment Number")
   else if(error) return res.send(error.details[0].message);
   const  result =await cloudinary1.uploader.upload(req.body.path);

   let data={
    cadet_regimentNo:regNo.regimentNo,
    cadet_name:regNo.name,
    camp_name:req.body.camp_name,
    camp_place:req.body.camp_place,
    camp_type:req.body.camp_type,
    start_date:req.body.start_date,
    end_date:req.body.end_date,
    imageName:req.body.imageName,
    camp_img:result.secure_url,
    cloudinary_id:result.public_id
   }
   let addCamp=await Camp.insertMany([data])
   referCamp()
   if(addCamp) return res.send(addCamp)

}catch(error){
    res.status(400).send(error.message)
}
}


//update camp in Student data

const referCamp=async(req,res)=>{

try{
    const getStudent=await Student.findOne({regimentNo:req.body.regimentNo})
    // console.log(getStudent.camp)
    const camp=await Camp.find({cadet_regimentNo:getStudent.regimentNo})
    // console.log(camp)
    if(!camp) res.status(400).send("No cadet")
    
    let arr=[];
    
    if(camp.length<=0){
        return res.send("no data")
    }
    else{
        camp.map(item => {
            arr.push(item._id)
        });
    }
    // console.log(arr);
      const updateCamp=await Student.findByIdAndUpdate({_id:getStudent._id},{new:true})
      updateCamp.camp=arr
      const result=await  updateCamp.save()
      res.send(result)
      
}catch(error){
   res.status(400).send(error.message)
}
}

//update camp using  cadet regimentno
const updateCamp=async(req,res)=>{
    try {
      let getCadet=await Camp.findOne({cadet_regimentNo:req.body.cadet_regimentNo})
      if(!getCadet) return res.status(400).send("There is no cadet")
      
      let getdata=await Camp.findOne({$and:[{_id:getCadet._id},{start_date:req.body.start_date}]})
      if(!getdata) return res.send('Camp not found')
        
      await cloudinary1.uploader.destroy(getdata.cloudinary_id);
       
      const result = await cloudinary1.uploader.upload(req.body.path);
        // console.log(result)

        const data = {
          camp_name:req.body.camp_name,
          camp_place:req.body.camp_place,
          camp_type:req.body.camp_type,
          start_date:req.body.start_date,
          end_date:req.body.end_date,
          imageName: req.body.imageName || getdata.imageName,
          camp_img: result.secure_url || getdata.camp_img,
          cloudinary_id: result.public_id || getdata.cloudinary_id,
        };
        // console.log(data)
        let fresult=await Camp.findOneAndUpdate({cadet_regimentNo:req.body.cadet_regimentNo},{$set:req.body},{new:true})
        res.send(fresult)

    } catch (error) {
      res.status(400).send(error.message)
    }
  }


  const updateCampImage=async(req,res)=>{
    try {
      let getCadet=await Camp.findOne({cadet_regimentNo:req.body.cadet_regimentNo})
      if(!getCadet) return res.status(400).send("There is no cadet")
      
      let getdata=await Camp.findOne({$and:[{_id:getCadet._id},{start_date:req.body.start_date}]})
      if(!getdata) return res.send('Camp not found')
        
      await cloudinary1.uploader.destroy(getdata.cloudinary_id);
       
      const result = await cloudinary1.uploader.upload(req.body.path);
        // console.log(result)

        const data = {
          imageName: req.body.imageName || getdata.imageName,
          camp_img: result.secure_url || getdata.camp_img,
          cloudinary_id: result.public_id || getdata.cloudinary_id,
        };
        // console.log(data)
        let fresult=await Camp.findOneAndUpdate({cadet_regimentNo:req.body.cadet_regimentNo},{$set:data},{new:true})
        res.send(fresult)

    } catch (error) {
      res.status(400).send(error.message)
    }

  }
//get Event between  dates

const campDate=async(req,res)=>{
try{
 const start_date= req.body.start_date
 const end_date=req.body.end_date

const resent=await Student.aggregate([
 {
   $lookup:{
  from:'camps',//reference schema
  localField:'camp',//field in camp
  foreignField:'_id',
  as:'date'
 }
},{
  $unwind:'$date'
},{
  $match:{
    "date.start_date":{ $gte:new Date(start_date)},"date.end_date":{$lte:new Date(end_date)}
  }
}
])

if(resent.length<=0) return res.status(400).send("no data")
return res.send(resent)
 


//  const findcamp=await Student.findOne({camp: {$elemMatch:{start_date:{$gte:new Date(start_date)},end_date:{$lte:new Date(end_date)}}}})
// console.log(findcamp)

//  const find=await Camp.find({start_date:{$gte:new Date(start_date)},end_date:{$lte:new Date(end_date)}})
//  res.send(find)

// let date= new Date (Date.now());
// console.log(date)

}catch(error){
  res.send(error.message)
}
}

//get Date wise camps

const dateFilter=async(req,res)=>{
  try{
   let  start_date=req.body.start_date
   let  end_date=req.body.end_date
   
    if(start_date){
      const resent=await Student.aggregate([
        {
          $lookup:{
         from:'camps',
         localField:'camp',
         foreignField:'_id',
         as:'date'
        }
       },{
         $unwind:'$date'
       },{
         $match:{
           "date.start_date":new Date(start_date)
        }
       }
       ])
      if(resent.length<=0) return res.status(400).send("No data in this start date")
      return res.send(resent)
    }
    if(end_date){
      const resent=await Student.aggregate([
        {
          $lookup:{
         from:'camps',
         localField:'camp',
         foreignField:'_id',
         as:'date'
        }
       },{
         $unwind:'$date'
       },{
         $match:{
           "date.end_date":new Date(end_date)
        }
       }
       ])
      if(resent.length<=0) return res.status(400).send("No data in this end date")
      return res.send(resent)
    }
    else{
      res.status(400).send("There is no input")
     }
  }catch(error){
    res.send(error.message)
  }
}

//get type wise/place wise/name wise

const otherFilter=async(req,res)=>{
try{
 let camp_name=req.body.camp_name
 let camp_place=req.body.camp_place
 let camp_type=req.body.camp_type
 
 if(camp_name){
    
      const resent=await Student.aggregate([
        {
          $lookup:{
         from:'camps',
         localField:'camp',
         foreignField:'_id',
         as:'type'
        }
       },{
         $unwind:'$type'
       },{
         $match:{
           "type.camp_name":camp_name
        }
       }
       ])
      if(resent.length<=0) return res.status(400).send("No data in this camp name")
      return res.send(resent)
 }
 if(camp_place){
 
  const resent=await Student.aggregate([
    {
      $lookup:{
     from:'camps',
     localField:'camp',
     foreignField:'_id',
     as:'type'
    }
   },{
     $unwind:'$type'
   },{
     $match:{
       "type.camp_place":camp_place
    }
   }
   ])
  if(resent.length<=0) return res.status(400).send("No data in this camp place")
  return res.send(resent)
 }
 if(camp_type){
  
  const resent=await Student.aggregate([
    {
      $lookup:{
     from:'camps',
     localField:'camp',
     foreignField:'_id',
     as:'type'
    }
   },{
     $unwind:'$type'
   },{
     $match:{
       "type.camp_type":camp_type
    }
   }
   ])
  if(resent.length<=0) return res.status(400).send("No data in this camp type")
  return res.send(resent)
 }
 else{
  res.status(400).send("There is no input")
 }
  

}catch(error){
   res.status(400).send(error.message)
}
}



export {addCamp,referCamp,updateCamp,campDate,dateFilter,otherFilter}
