const jwt = require('jsonwebtoken')

const generateJWT = ( uid = '' ) => {

    return new Promise((resolve, reject) => {
        const payload = { uid }
        
        //publickey genera la firma del token, debe estar oculto
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '24h'
        }, ( err, token ) => {
            if(err){
                console.log(err)
                reject('No se pudo generar el token')
            }else {
                resolve( token )
            }
        })
    })
}

module.exports = {
    generateJWT
}