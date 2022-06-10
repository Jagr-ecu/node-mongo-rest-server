const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const validateJWT = async( req = request, res = response, next) => {
    const token = req.header('x-token') 

    if(!token){
        return res.status(401).json({
            msg: 'No hay token en los headers'
        })
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)

        //leer el usuario con el id
        const user  = await User.findById(uid);

        if(!user){
            return res.status(401).json({
                msg: "Token no valido - usuario no existente"
            }) 
        }

        //Verificar que el usuario este activo
        console.log(user)
        if(!user.state){
            return res.status(401).json({
                msg: "Token no valido - usuario inactivo"
            })
        }

        req.user = user
        next()
    }catch (error){
        console.log(error)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = {
    validateJWT
}