import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const testDatabaseConfig = {
    username: process.env.TEST_DB_USER || 'default_test_username',
    password: process.env.TEST_DB_PASS || 'default_test_password',
    database: process.env.TEST_DB_NAME || 'default_test_db_name',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    dialect: 'postgres' as Dialect,  // Explicitly cast as Dialect
};
