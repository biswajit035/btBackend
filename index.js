const express = require("express");
const app = express();
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const BtechStudentSchema = require("./model/BtechStudentSchema");
var cors = require('cors')
require('dotenv').config();
let port = process.env.PORT || 8000;


// models


// Middlewares
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");

// DB
const mongoURI = `mongodb+srv://${process.env.DATABASE_ID}:${process.env.DATABASE_PASS}@cluster0.4m23f.mongodb.net/studentpdf?retryWrites=true&w=majority`;

// connection
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


conn.on('connected', () => {
    console.log('MongoDB connected!');
});
conn.on('error', (err) => {
    console.log('MongoDB connection error: ' + err);
});
const btechStudent = conn.model('BtechStudentModel', BtechStudentSchema)
const mtechStudent = conn.model('MtechStudentModel', BtechStudentSchema)
const phdStudent = conn.model('PhdStudentModel', BtechStudentSchema)

// init gfs
let gfs;
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});

// Storage
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        });
    }
});

const upload = multer({
    storage
});



// testing purpose
app.get('/',(req,res)=>{
    res.send("Hellow world")
})




// pdf upload roues(from btech):    http://localhost:8000/btech/upload
// pdf upload roues(from mtech):    http://localhost:8000/mtech/upload
// pdf upload roues(from phd):    http://localhost:8000/phd/upload
app.post("/btech/upload", upload.single('file'), async (req, res) => {

    const student = await btechStudent.create({
        filename: req.file.filename,
        fileid: req.file.id,
        year: req.body.year
    })
    res.json(student)

});
app.post("/mtech/upload",upload.single('file'), async(req, res) => {
    const student = await mtechStudent.create({
        filename: req.file.filename,
        fileid: req.file.id,
        year: req.body.year
    })
    res.json(student)

});
app.post("/phd/upload",upload.single('file'), async(req, res) => {
    const student = await phdStudent.create({
        filename: req.file.filename,
        fileid: req.file.id,
        year: req.body.year
    })
    res.json(student)

});

// pdf get roues(from btech):    http://localhost:8000/btech
// pdf get roues(from mtech):    http://localhost:8000/mtech
// pdf get roues(from phd):    http://localhost:8000/phd
app.get("/btech", async (req, res) => {
    const year = await btechStudent.find().sort({ year: 1 });;
    res.send({ year });
})
app.get("/mtech", async (req, res) => {
    const year = await mtechStudent.find();
    res.send({ year });
})
app.get("/phd", async (req, res) => {
    const year = await phdStudent.find();
    res.send({ year });
})


// pdf delete roues(from btech):    http://localhost:8000/btech/del/:id
// pdf delete roues(from mtech):    http://localhost:8000/mtech/del/:id
// pdf delete roues(from phd):    http://localhost:8000/phd/del/:id
app.delete("/btech/del/:id", async (req, res) => {
    let year = await btechStudent.findById(req.params.id);
    year = await btechStudent.findByIdAndDelete(req.params.id)
    res.json({ "success": "Note has been deleted" })
})
app.delete("/mtech/del/:id", async (req, res) => {
    let year = await mtechStudent.findById(req.params.id);
    year = await mtechStudent.findByIdAndDelete(req.params.id)
    res.json({ "success": "Note has been deleted" })
})
app.delete("/phd/del/:id", async (req, res) => {
    let year = await phdStudent.findById(req.params.id);
    year = await phdStudent.findByIdAndDelete(req.params.id)
    res.json({ "success": "Note has been deleted" })
})

// files/del/:id
// Delete chunks from the db
app.delete("/files/del/:id", (req, res) => {
    gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
        if (err) return res.status(404).json({ err: err.message });
        res.send("delete done")
    });
});



// show pdf in browsrer
app.get("/image/:filename", (req, res) => {
    console.log(req.params.filename);
    const file = gfs
        .find({
            filename: req.params.filename
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist"
                });
            };

            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
});








// shoow all saved pdf
app.get("/files", (req, res) => {
    gfs.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist in"
            });
        }
        return res.json(files);
    });
});

// shoow named saved pdf
app.get("/files/:filename", (req, res) => {
    gfs.find({
        filename: req.params.filename
    }).toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "no files exist in"
            });
        }

        return res.json(files);
    });
});









app.listen(port, () => {
    console.log("server started on " + port);
});
