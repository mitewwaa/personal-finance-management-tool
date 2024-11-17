import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const databaseConfig = {
    username: process.env.DB_USER || 'default_username',
    password: process.env.DB_PASS || 'default_password',
    database: process.env.DB_NAME || 'default_db_name',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres' as Dialect,  // Explicitly cast as Dialect
};
