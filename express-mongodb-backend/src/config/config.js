const config = {
    dbURI: process.env.DB_URI || 'mongodb+srv://malindakawshalya:mkk123@pet.70rojzs.mongodb.net/',
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || 'your_secret_key'
};

module.exports = config;