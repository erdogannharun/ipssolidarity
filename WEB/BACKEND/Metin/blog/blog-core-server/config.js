import {readFileSync} from 'fs'
export const PORT = parseInt(process.env.PORT || 5000);
export const ACCESS_SECRET = readFileSync("./public_key.pem")
export const PG_OPTIONS = {
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    max: parseInt(process.env.PG_POOL_MAX),
    connectionTimeoutMillis: parseInt(process.env.PG_POOL_TIMEOUT),
    idleTimeoutMillis: parseInt(process.env.PG_POOL_IDLE)
}