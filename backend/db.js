const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
    // Para producción en Render (PostgreSQL)
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    });
} else {
    // Para desarrollo local (MySQL)
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'mysql',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
        }
    );
}

module.exports = sequelize;
