const mongoose = require('mongoose');
const colors = require('colors');

//function mongodb database connection

 const conncetDatabase = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to Database ${mongoose.connection.host}`.bgCyan);

    } catch (error) {
        console.log('Db error', error,);
    }
}

module.exports = conncetDatabase;