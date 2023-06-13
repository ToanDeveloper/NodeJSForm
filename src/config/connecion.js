const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('NodeJS', 'sa', '123456789', {
    dialect: 'mssql',
    host: 'localhost',
    port: 1433, // Default port
    dialectOptions: {
        instanceName: 'SQLEXPRESS',
        requestTimeout: 30000
    },
    pool: {
        max: 50,
        min: 0,
        idle: 10000
    }
});

let connectDB = async() => {
    try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
    console.error('Unable to connect to the database:', error);
    }
}

export default connectDB
