const mongoose = require('mongoose')

//Function to get Get Url Of Mongodb & connect to it
function db(req, res) {
    try {
        mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    } catch (err) {
        res.json({ error: err.toString() })
    }
}

module.exports = db;
