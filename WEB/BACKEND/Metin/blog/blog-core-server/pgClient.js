import pg from "pg";
import { PG_OPTIONS } from "./config.js";

const pgClient = new pg.Pool(PG_OPTIONS)

export const executeQuery = async (query, values) => {
    const result = await pgClient.query(query, values);
    return result.rows;
};