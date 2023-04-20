import Event ,{validateEvent} from '../model/event.js'
// import cloudinary from '../utils/cloudTwo.js'

//Add new Event and joi validation
const addEvent=async(req,res)=>{
    
    try {
      const {error}=validateEvent(req.body)
      if(error) return res.status(400).send(error.details[0].message)

      const result = await cloudinary.uploader.upload(req.body.path);
        let add={ 
          imageName: req.body.imageName,
          profile_img: result.secure_url,
          cloudinary_id: result.public_id,
          event_name:req.body.event_name,
          event_place:req.body.event_place,
          event_date:req.body.event_date,
          total_students:req.body.total_students,
          inAssociationWith:req.body.inAssociationWith,
          description:req.body.description
          }
          let addData=await Event.insertMany([add])
          res.send(addData)

    } catch (error) {
    res.status(400).send(error.message)
    }
}

//view a single event using date
const viewEvent=async(req,res)=>{
    try {
      let getDate=await Event.findOne({event_date:req.body.event_date})
      const view=await Event.find({_id:getDate._id},{_id:0,__v:0})
      res.send(view)
      
    } catch (error) {
      res.status(400).send(error.message)
    }
  }
 
//view all the event
const allEvent=async(req,res)=>{
    try{
      const view=await Event.find()
      res.send(view)
  
    }catch(error){
      res.status(400).send(error.message)
    }
 
  }

//update event using event date

  const updateEvent=async(req,res)=>{
    try {
      let getDate=await Event.findOne({event_date:req.body.event_date})
      // console.log(event.imageName)
      let event=await Event.findOne({_id:getDate._id})

        if(!event) return res.send('Event not found')
        
        await cloudinary.uploader.destroy(event.cloudinary_id);
       
        const result = await cloudinary.uploader.upload(req.body.path);
        // console.log(result)

        const data = {
          imageName: req.body.imageName || event.imageName,
          profile_img: result.secure_url || event.profile_img,
          cloudinary_id: result.public_id || event.cloudinary_id,
        };
        // console.log(data)
        let fresult=await Event.findOneAndUpdate({event_date:req.body.event_date},{$set:data},{new:true})
        res.send(fresult)
    } catch (error) {
      res.status(400).send(error.message)
    }
  }


//Event date wise
// const dateWise=async(req,res)=>{
//   try {
//       const event_date=req.body.event_date
//       console.log(event_date);
//       const findDate=await Event.find({event_date:new Date(event_date)})
//       res.send(findDate)
      
//   } catch (error) {
//       console.log(error.message);
//   }
 
// }


//get Event between  dates
const eventDate=async(req,res)=>{
  const from= req.body.from
  const to=req.body.to

  // console.log(from);
  // console.log(to);
 
  const findDate=await Event.aggregate(
      [{$match: {event_date: { $gte:new Date(from),$lte:new Date(to)}}},
      {$project:{'_id':0}}
      ])
    if(findDate.length<=0) return res.status(400).send("Data not found")
    res.send(findDate);
}

export {addEvent,viewEvent,allEvent,updateEvent,eventDate}