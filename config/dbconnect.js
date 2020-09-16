const mongoose = require('mongoose')
    //Get Url Of Mongodb to connect
    const URL = "mongodb://localhost:27017/nodeexpressmondocrud";
    function db() {
        mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    }
    module.exports = db;
    