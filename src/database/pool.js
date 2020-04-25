require('dotenv').config();

const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL;


const pool = new Pool({
    connectionString: connectionString,
}).on('connect', () => {
    console.log('CONNECTED TO DB');
  });

export default pool;