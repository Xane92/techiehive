import pkg from "pg";
const { Pool } = pkg;

const connectionString =
  process.env["SUPABASE_DATABASE_URL"] ?? process.env["DATABASE_URL"];

export const pool = new Pool({ connectionString, ssl: process.env["SUPABASE_DATABASE_URL"] ? { rejectUnauthorized: false } : false });
