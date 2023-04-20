
import jwt from 'jsonwebtoken'
import env from 'dotenv/config'


function auth(req,res,next){
    const token=req.header('auth')
    if(!token) return res.status(401).send(' token Access denied')
    try {
    const decode=jwt.verify(token, process.env.JWTKEY)
    req.user=decode
    next();   
    } catch (error) {
        console.log('invalid token');
        res.status(400).send(error.message)
    }

}

export default auth