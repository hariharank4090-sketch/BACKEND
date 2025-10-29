import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const baseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true",
  },
};

// Default pool (for ERP_DB_SMT_TEST)
const defaultDbConfig = {
  ...baseConfig,
  database: process.env.DB_DATABASE_DEFAULT,
};

const poolPromise = new sql.ConnectionPool(defaultDbConfig)
  .connect()
  .then((pool) => {
    console.log("✅ Connected to Default DB:", process.env.DB_DATABASE_DEFAULT);
    return pool;
  })
  .catch((err) => {
    console.error("❌ Default DB Connection Failed:", err);
    process.exit(1);
  });

// Helper: Get pool for any database (e.g., master, ERP_DB_SMT_TEST, etc.)
const getPoolForDb = async (databaseName) => {
  try {
    const dynamicConfig = { ...baseConfig, database: databaseName };
    const pool = await new sql.ConnectionPool(dynamicConfig).connect();
    console.log(`✅ Connected to DB: ${databaseName}`);
    return pool;
  } catch (err) {
    console.error(`❌ Connection Failed for DB: ${databaseName}`, err);
    throw err;
  }
};

export { sql, poolPromise, getPoolForDb };
