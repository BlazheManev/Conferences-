var GradivoModel = require('../models/GradivoModel.js');

const { mongo, connection, mongoose } = require('mongoose');
const mongodb = require('mongodb');
const Grid = require('gridfs-stream');
const { isNamedExportBindings } = require('typescript');
const db = mongoose.connection;
const path = require('path');
const fs = require('fs');


db.once("open", function() {
    gfs = Grid(db.db, mongoose.mongo);
});

module.exports = {

    list: async function (req, res) {
        try {
            const Gradivos = await GradivoModel.find();
            return res.json(Gradivos);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Gradivo.',
                error: err
            });
        }
    },

    show: async function (req, res) {
        var id = req.params.id;

        try {
            const Gradivo = await GradivoModel.findOne({ _id: id });
            if (!Gradivo) {
                return res.status(404).json({
                    message: 'No such Gradivo'
                });
            }
            return res.json(Gradivo);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Gradivo.',
                error: err
            });
        }
    },

    /*download: async function (req, res) {
        console.log(req.params.id);
        gfs.collection('fs.files').findOne({filename: req.params.id}, (err, file) => { 
            console.log('pred if');
            if (err) {
                console.log('v err');
                return res.status(400).send(err);
            }
            else if (file) {
                console.log('v elif');
                let mimeType = file.contentType;
                if (!mimeType) {
                    mimeType = mime.lookup(file.filename);
                }
            
                console.log(req.params.id);
                res.set('Content-Type', file.contentType);
                res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

                res.set({
                    'Content-Type': mimeType,
                    'Content-Disposition': 'attachment; filename=' + file.filename
                });

                var readstream = gfs.createReadStream({
                    _id: req.params.id
                });

                readstream.on("error", function(err) { 
                    res.end();
                });
                readstream.pipe(res);
            };
        });
    },*/

    download: async function (req, res) {
        try {
            const { id } = req.params;
            const grad = await GradivoModel.findById(id);
            if (!grad) {
                return isNamedExportBindings(new Error("Gradivo ni najdeno"));
            }
            const file = grad.file;
            const filePath = path.join(__dirname, `../${file}`);
            return res.download(filePath);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating Gradivo',
                error: err
            });
        }
    },

    create: async function (req, res) {
        try {
            const gradivo = new GradivoModel({
                naslov: req.body.naslov,
                avtor: req.body.avtor,
                jePrispevek : req.body.jePrispevek,
                file: req.file.path
            });
            console.log(req.body.naslov)
            console.log(req.file.path)
            const savedGradivo = await gradivo.save();

            console.log(req.body.naslov)

            return res.status(201).json(savedGradivo);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating Gradivo',
                error: err
            });
        }
    },

    update: async function (req, res) {
        var id = req.params.id;

        try {
            const Gradivo = await GradivoModel.findOne({ _id: id });
            if (!Gradivo) {
                return res.status(404).json({
                    message: 'No such Gradivo'
                });
            }

            Gradivo.naslov = req.body.naslov ? req.body.naslov : Gradivo.naslov;
            Gradivo.avtor = req.body.avtor ? req.body.avtor : Gradivo.avtor;
            
            const updatedGradivo = await Gradivo.save();
            return res.json(updatedGradivo);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating Gradivo.',
                error: err
            });
        }
    },

    remove: async function (req, res) {
        var id = req.params.id;
        try {
            //
            const grad = await GradivoModel.findById(id);
            console.log(grad.file);
            fs.unlink(grad.file, (err) => {
                if (err) {
                    throw err;
                }
            });
            //
            await GradivoModel.findByIdAndRemove(id);
            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the Gradivo.',
                error: err
            });
        }
    },
    showOnlyGradiva: async function (req, res){
        try {
            const Gradivos = await GradivoModel.find({ jePrispevek: true });
            return res.json(Gradivos);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Gradivo.',
                error: err
            });
        }

    }
};
