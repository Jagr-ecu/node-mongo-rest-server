const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const User = require('../models/user')

const userGet = async(req = request, res = response) => {
    //const { nombre, limit = 100, page } = req.query //obtiene las query de la endpoint ?q=10&limit=100
    const { limit, skip = 0 } = req.query
    const query = { estado: true }//condiciones que se pueden enviar a mongo

    //son dos promesos separadas, y se ejecutan separadas
    // const users = await User.find(query)
    //     .skip(Number(skip))
    //     .limit(Number(limit))
    // const total = await User.countDocuments(query)

    //ejecuta las promesas de manera simultanea
    const [ total, users ] = await Promise.all([
        User.count(query),
        User.find(query)
         .skip(Number(skip))
         .limit(Number(limit))
    ])



    res.json({
        total,
        users,
    })
}

const userPost = async(req = request, res = response) => {

    const { name, email, password, role } = req.body;//Obtiene el body que envian
    const user = new User({ name, email, password, role }) //usa modelo de usuario para guardar en moongose

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt )

    //Guardar en base de datos
    await user.save();//Con esto guarda el usuario en la base de datos

    res.json({
        msg: "El usuario fue creado",
        user
    })
}

const userDelete = async(req = request, res = response) => {

    const { id } = req.params

    //Borrado fisicamente
    //const user = await User.findByIdAndDelete(id)

    //Se actualiza el campo de estado a false, no se borra fisicamente
    const usuario = await User.findByIdAndUpdate(id, {state: false})

    res.status(200).json({
        usuario
    })
}

const userPut = async(req = request, res = response) => {
    const id = req.params.id //obtiene el parametro de la endpoint www.df..../api/user/10
    const { _id, password, google, email, ...rest } = req.body

    if(password){
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync( password, salt )
    }

    const user = await User.findByIdAndUpdate( id, rest )

    res.json({
        msg: "El usuario fue actualizado",
        user
    })
}

module.exports = {
    userGet,
    userPost,
    userDelete,
    userPut
}