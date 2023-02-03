const express = require("express");
const app = express();
const path = require("path");
const { GridFsStorage } = require('multer-gridfs-storage');
var cors = require('cors')
let port = process.env.PORT || 8000;


// Middlewares
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");


// routes
// testing purpose
app.get('/', (req, res) => {res.send("Hellow world")})
app.use('/pdf', require('./Routes/Pdf'))
app.use('/files', require('./Routes/File'))
app.use('/placement',require('./Routes/Placements'));

app.listen(port, () => {
    console.log("server started on " + port);
});
