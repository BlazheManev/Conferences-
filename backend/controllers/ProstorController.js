var ProstorModel = require('../models/ProstorModel.js');

/**
 * ProstorController.js
 *
 * @description :: Server-side logic for managing Prostors.
 */
module.exports = {

    /**
     * ProstorController.list()
     */
    list: async function (req, res) {
        try {
            const Prostors = await ProstorModel.find();
            return res.json(Prostors);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Prostor.',
                error: err
            });
        }
    },
    
    show: async function (req, res) {
        var id = req.params.id;
    
        try {
            const Prostor = await ProstorModel.findOne({ _id: id });
            if (!Prostor) {
                return res.status(404).json({
                    message: 'No such Prostor'
                });
            }
            return res.json(Prostor);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting Prostor.',
                error: err
            });
        }
    },
    

    /**
     * ProstorController.create()
     */
    create: async function (req, res) {
        try {
            var Prostor = new ProstorModel({
                naziv: req.body.naziv,
                sedezi: req.body.sedezi,
                dostopnost: req.body.dostopnost,
                naslov: req.body.naslov
            });

            const savedProstor = await Prostor.save();
            return res.status(201).json(savedProstor);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when creating Prostor',
                error: err
            });
        }
    },

    /**
     * ProstorController.update()
     */
    update: async function (req, res) {
        try {
            var id = req.params.id;

            const Prostor = await ProstorModel.findOne({_id: id});

            if (!Prostor) {
                return res.status(404).json({
                    message: 'No such Prostor'
                });
            }

            Prostor.naziv = req.body.naziv ? req.body.naziv : Prostor.naziv;
            Prostor.sedezi = req.body.sedezi ? req.body.sedezi : Prostor.sedezi;
            Prostor.dostopnost = req.body.dostopnost;
            Prostor.naslov = req.body.naslov ? req.body.naslov : Prostor.naslov;

            const updatedProstor = await Prostor.save();
            return res.status(200).json(updatedProstor);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating Prostor.',
                error: err
            });
        }
    },

    /**
     * ProstorController.remove()
     */
    remove: async function (req, res) {
        try {
            var id = req.params.id;

            const removedProstor = await ProstorModel.findByIdAndRemove(id);

            return res.status(204).json();
        } catch (err) {
            return res.status(500).json({
                message: 'Error when deleting the Prostor.',
                error: err
            });
        }
    }
};
