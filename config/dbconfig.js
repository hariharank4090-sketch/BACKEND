// src/config/dbconfig.js
import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  try {
    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      requestTimeout: 60000,
    };

    await sql.connect(config);
    console.log('✅ Connected Successfully to Default DB');
  } catch (err) {
    console.error('❌ Default DB Connection Error:', err);
    process.exit(1);
  }
};
