const Role = require('../models/role')
const User = require('../models/user')

const isRoleValid = async(role = '') => {
    const roleExists = await Role.findOne({ role })
    if(!roleExists) {
        throw new Error(`El rol ${role} no está registrado en la BD`)
    }
}

//Verificar que el correo existe
const emailExists = async( email = '' ) => {
    const emailExist = await User.findOne({ email });
    if( emailExist ){
        throw new Error(`El correo ${email} ya esta en uso`)
    }
}

const userExistsByID = async( id = '' ) => {
    const userExist = await User.findById(id);
    if( !userExist ){
        throw new Error(`El id ${id} no existe`)
    }
}


module.exports = {
    isRoleValid,
    emailExists,
    userExistsByID
}