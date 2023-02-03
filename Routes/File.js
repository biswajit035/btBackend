const express = require('express');
const router = express.Router();
const { conn } = require('../db')
const mongoose = require("mongoose");



let gfs;
conn.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads"
    });
});


// shoow all saved pdf: http://localhost:8000/files/
router.get("/", (req, res) => {
    try {
        gfs.find().toArray((err, files) => {
            // check if files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist in"
                });
            }
            return res.json(files);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});

// delete files:  http://localhost:8000/files/del/:id
// Delete chunks from the db
router.delete("/del/:id", (req, res) => {
    try {
        gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err) return res.status(404).json({ err: err.message });
            res.send("delete done")
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});



// show pdf in browsrer http://localhost:8000/files/image/:filename
router.get("/image/:filename", (req, res) => {
    try {
        gfs.find({
            filename: req.params.filename
        }).toArray(async (err, files) => {
            // check if files
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: "no files exist in"
                });
            }

            const pdf = await gfs.openDownloadStreamByName(req.params.filename);
            res.setHeader('Content-Type', 'application/pdf');
            pdf.pipe(res);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});


// shoow named saved pdf: http://localhost:8000/files/:filename
router.get("/:filename", (req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).send({ "msg": "Some error occured" });
    }
});

module.exports = router