// MySQL Config.
module.exports = {
    host: process.env.DB_HOST,
    username: process.env.DB_USER, //' < MySQL username >
    password: process.env.DB_PASSWORD, // < MySQL password >
    database: process.env.DB_DATABASE, // < MySQL Database name >
    dialect: "mysql"
}; 
