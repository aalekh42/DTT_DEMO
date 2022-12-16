const mongoose = require('mongoose');
const { winstonLogger } = require('../errorLogger/winstonLogger');
// let Admin = mongoose.mongo.Admin;

// mongoose.connect('mongodb://ddt-cosmos-test2:ExpXJkaXMGkDgtWL7ZbmCMtzoCnftmXeEXSra5vEQCbPorseZ3EKwdjiypwp9C6CveYBtJg0ICoZACDb031fCQ==@ddt-cosmos-test2.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@ddt-cosmos-test2@', {useNewUrlParser: true});
mongoose.connect(process.env.DB_CONN_STRING, {useNewUrlParser: true});
// mongoose.connect('mongodb://ddt-cosmos:KtPqjMyhrpplpjRP4zzmJOiUgVQnn4p1ymgrScRVHZ6rgM0P4tV37tiy4yslZs93TN9IADBQKrRtACDbkzm4Cw==@ddt-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@ddt-cosmos@', {useNewUrlParser: true});

var conn = mongoose.connection;
conn.on('connected', function() {
    winstonLogger.info('database is connected successfully');
});
conn.on('disconnected',function() {
    winstonLogger.info('database is disconnected successfully');
})
conn.on('error', function(err) {
    winstonLogger.error('Cosmos-MongoDB connection error')
    // console.error.bind(console, 'connection error:');
})
// conn.on('open', function() {
    //     // connection established
    //     new Admin(conn.db).listDatabases(function(err, result) {
        //         console.log('listDatabases succeeded');
        //         // database list stored in result.databases
//         var allDatabases = result.databases;
//         console.log(allDatabases);
//     });
// })

// module.exports = {
//     conn
// };