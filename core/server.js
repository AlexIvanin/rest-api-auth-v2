import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import router from '../router';
import config from '../config';

const server = express();
mongoose.connect(config.db);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(cors());
server.use(helmet.xssFilter());
server.use(helmet.noSniff());
server.use(helmet.frameguard());
server.use(methodOverride());
server.use(helmet.ieNoOpen());
server.use(helmet.hidePoweredBy());
server.use(compression({ threshold: 0 }));
server.use('/', router);


module.exports = server;
