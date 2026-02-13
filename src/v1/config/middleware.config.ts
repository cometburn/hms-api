import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './cors.config';

export const configureMiddleware = (app: Application) => {
  // CORS
  app.use(cors(corsOptions));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parsing
  app.use(cookieParser());
};