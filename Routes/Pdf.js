const express = require('express');
const router = express.Router();
const { conn } = require('../db')
const { upload } = require('../gridFs')
const mongoose = require("mongoose");


// models
const { phdStudent, btechStudent, mtechStudent } = require('../model/Model')

let gfs;
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});


// pdf get roues(from btech):    http://localhost:8000/pdf/btech
// pdf get roues(from mtech):    http://localhost:8000/pdf/mtech
// pdf get roues(from phd):    http://localhost:8000/pdf/phd
router.get("/btech", async (req, res) => {
    try {
        const year = await btechStudent.find().sort({ year: 1 });
        res.send({ year });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
})
router.get("/mtech", async (req, res) => {
    try {
        const year = await mtechStudent.find().sort({ year: 1 });
        res.send({ year });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
})
router.get("/phd", async (req, res) => {
    try {
        const year = await phdStudent.find().sort({ year: 1 });
        res.send({ year });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

}) 

// pdf upload roues(from btech):    http://localhost:8000/pdf/btech/upload
// pdf upload roues(from mtech):    http://localhost:8000/pdf/mtech/upload
// pdf upload roues(from phd):    http://localhost:8000/pdf/phd/upload
router.post("/btech/upload", upload.single('file'), async (req, res) => {
    try {
        const student = await btechStudent.create({
            filename: req.file.filename,
            fileid: req.file.id,
            year: req.body.year
        })
        res.json(student)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});
router.post("/mtech/upload", upload.single('file'), async (req, res) => {
    try {
        const student = await mtechStudent.create({
            filename: req.file.filename,
            fileid: req.file.id,
            year: req.body.year
        })
        res.json(student)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});
router.post("/phd/upload", upload.single('file'), async (req, res) => {
    try {
        const student = await phdStudent.create({
            filename: req.file.filename,
            fileid: req.file.id,
            year: req.body.year
        })
        res.json(student)
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});


// pdf delete roues(from btech):    http://localhost:8000/pdf/btech/del/:id
// pdf delete roues(from mtech):    http://localhost:8000/pdf/mtech/del/:id
// pdf delete roues(from phd):    http://localhost:8000/pdf/phd/del/:id
router.delete("/btech/del/:id", async (req, res) => {
    try {
        let year = await btechStudent.findById(req.params.id);
        year = await btechStudent.findByIdAndDelete(req.params.id)
        res.json({ "msg": "Note has been deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

})
router.delete("/mtech/del/:id", async (req, res) => {
    try {
        let year = await mtechStudent.findById(req.params.id);
        year = await mtechStudent.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

})
router.delete("/phd/del/:id", async (req, res) => {
    try {
        let year = await phdStudent.findById(req.params.id);
        year = await phdStudent.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note has been deleted" })
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }

})


module.exports = router