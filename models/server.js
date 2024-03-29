const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT

        this.userRoutePath = '/api/user'
        this.authPath = '/api/auth'

        //Connect to db
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Rutas de la app
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares(){

        //CORS
        this.app.use( cors() )

        // Lectura y parseo del body
        this.app.use( express.json() )

        //Directorio publico
        this.app.use( express.static('public') )
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'))
        this.app.use(this.userRoutePath, require('../routes/user'))
    }

    listen(){
        this.app.listen( this.port )
    }
}

module.exports = Server