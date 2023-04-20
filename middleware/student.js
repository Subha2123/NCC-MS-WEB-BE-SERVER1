

function student(req,res,next){
    if(req.user.isStudent ===false) {
        return res.status(403).send('Access denied')
    }
    else{
        next();
    }
    
}

export default student