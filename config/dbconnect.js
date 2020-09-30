const mongoose = require('mongoose')

//Function to get Get Url Of Mongodb & connect to it
function db(req, res) {
    try {
        const URL = "mongodb://localhost:27017/nodeexpressmondocrud";
        mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

module.exports = db;
