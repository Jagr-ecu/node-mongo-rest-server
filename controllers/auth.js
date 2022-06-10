const { response } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user') 
const { generateJWT } = require('../helpers/generate-jwt')

const login = async(req, res = response) => {
    const { email, password } = req.body

    try{

        //Verificar si email existe
        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({
                msg: "El correo que ha ingresado no existe"
            })
        }

        //Verificar si usario esta activo
        if(!user.state){
            return res.status(400).json({
                msg: "El correo que ha ingresado no existe"
            })
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password)
        if(!validPassword){
            return res.status(400).json({
                msg: "Contraseña incorrecta"
            })
        }

        //Generar JWT
        const token = await generateJWT(user.id)

        res.json({
            user,
            token
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg: "Sucedio un error"
        })
    }
}

module.exports = {
    login
}