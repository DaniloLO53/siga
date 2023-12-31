import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'http';
import cors from 'cors';
import routerAdmins from './core/admins/routes';
import routerHealthAdmins from './core/health/admins';
import { errorController } from './utils/errors';
import { authenticate } from './middlewares/auth';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
let server: Server;
const PORT = process.env.PORT;

export const validate = (port: number | string | undefined) => {
  if (!port) throw new Error('Port is undefined');
}

const initApi = () => {
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(authenticate);

  app.use('/admins', routerAdmins);
  app.use('/health', routerHealthAdmins);

  app.use(errorController);
}

export const listenApi = () => {
  validate(PORT);
  initApi();

  server = app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
  });
}

export const closeApi = () => {
  if (server) {
    server.close((err) => {
      if (err) {
        console.error(`Error closing server: ${err.message}`);
      } else {
        console.log('Server closed successfully.');
      }
    });
  } else {
    console.warn('Server not initialized or already closed.');
  }
}

listenApi();
