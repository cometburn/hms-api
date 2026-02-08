import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const encodedPassword = encodeURIComponent(DB_PASSWORD);
process.env.DATABASE_URL = `postgresql://${DB_USER}:${encodedPassword}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`;
export const prisma = new PrismaClient();
