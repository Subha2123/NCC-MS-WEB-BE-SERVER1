

function admin(req,res,next){
    if(req.user.isAdmin ===false) {
        return res.status(403).send('Access denied')
    }
    else{
        next();
    }
    
}

export default admin