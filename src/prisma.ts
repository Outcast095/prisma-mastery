


// src/prisma.ts
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// Импортируем из client.js (TypeScript сам свяжет типы с client.ts на лету)
import { PrismaClient } from "./generated/prisma/client.js"; 

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });