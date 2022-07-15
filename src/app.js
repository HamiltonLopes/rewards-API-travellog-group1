import express from 'express';
import Routes from './router.js';
import bodyParser from 'body-parser';

class App {
    constructor(){
        this.server = express();
        this.middlewares();
        this.routes();
    }
    
    middlewares(){
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({ extended: false }));
    }

    routes(){
        this.server.use(`/${process.env.API_NAME}/${process.env.API_VERSION}`,Routes);
    }
} 

export default new App().server;


