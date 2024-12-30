import mysql from 'mysql2/promise';

// Define the User type
export interface User {
  id: number;
  email: string;
  password: string;
  reset_token?: string | null;
  reset_token_expiry?: Date | null;
  created_at: Date;
  updated_at: Date;
}

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

interface QueryParams {
  query: string;
  values?: Array<string | number | boolean | null | Buffer | Date>;
}

export async function query<T>({ query: queryString, values = [] }: QueryParams): Promise<T> {
  try {
    const [results] = await pool.execute(queryString, values);
    return results as T;
  } catch (error: unknown) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

export default pool;
