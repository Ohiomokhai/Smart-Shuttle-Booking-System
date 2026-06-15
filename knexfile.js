module.exports = {
  development: {
    client: 'pg',
    connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'doughlas',
    database: 'bookingapp',
    port: 5432
  },
  
  pool: {
    min: 2,
    max: 10
  },
      
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
      
  seeds: {
    directory: './seeds'
   }
  },
}