require('dotenv').config();

// module.exports = {
//   "migrationDirectory": "migrations",
//   "driver": "pg",
//   "host": process.env.LIVE_MIGRATION_DB_HOST,
//   "port": process.env.LIVE_MIGRATION_DB_PORT,
//   "database": process.env.LIVE_MIGRATION_DB_NAME,
//   "username": process.env.LIVE_MIGRATION_DB_USER,
//   "password": process.env.LIVE_MIGRATION_DB_PASS
// }

// console.log('migrate to NODE_ENV::', process.env.DB_URL)

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": (process.env.NODE_ENV === 'test')
      ? process.env.TEST_DATABASE_URL
      : process.env.DB_URL,
  "ssl": !!process.env.SSL,
};